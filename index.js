const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

const sessionStore = new Map();

// Epic Games API URLs
const EPIC_GAMES_FREE_GAMES_API = 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions';
const EPIC_STORE_URL = 'https://www.epicgames.com/store/en-US/p/';

async function startBot() {
    // Auth තොරතුරු ලබා ගැනීම
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        syncFullHistory: false
    });

    // Pairing Code logic
    if (!sock.authState.creds.registered) {
        let phoneNumber = await question('බොට් අංකය ඇතුළත් කරන්න (e.g. 9477xxxxxxx): ');
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(phoneNumber);
                console.log(`\n✅ Pairing Code: ${code}\n`);
            } catch (err) { console.error(err); }
        }, 3000);
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('\n🎮 Game Bot successfully connected! ✅');
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const jid = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const isGroup = jid.endsWith('@g.us');

        if (!isGroup) return;

        const messageType = Object.keys(msg.message)[0];
        const text = (messageType === 'conversation') ? msg.message.conversation : 
                     (messageType === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : '';

        const sessionKey = `${jid}_${sender}`;

        // 1. Show Free Epic Games
        if (text.startsWith('.freegames') || text.startsWith('.games')) {
            await sock.sendMessage(jid, { text: '🎮 Fetching free Epic Games... 🔍' }, { quoted: msg });

            try {
                const { data } = await axios.get(EPIC_GAMES_FREE_GAMES_API, {
                    timeout: 10000
                });

                const freeGames = [];
                
                if (data.data && data.data.Catalog && data.data.Catalog.searchStore && data.data.Catalog.searchStore.elements) {
                    const elements = data.data.Catalog.searchStore.elements;
                    
                    elements.forEach((game, index) => {
                        if (index < 10 && game.title) {
                            freeGames.push({
                                title: game.title,
                                id: game.catalogNs.mappings[0]?.pageSlug || game.id,
                                price: game.price?.totalPrice?.fmtPrice?.originalPrice || 'FREE',
                                description: game.description || 'No description'
                            });
                        }
                    });
                }

                if (freeGames.length > 0) {
                    sessionStore.set(sessionKey, { step: 'SELECT_GAME', games: freeGames });
                    let listMsg = "*🎮 FREE EPIC GAMES THIS WEEK*\n\n" + 
                                  freeGames.map((g, i) => `${i + 1}. ${g.title}\n   💰 ${g.price}`).join('\n\n') + 
                                  "\n\n*Reply with number to get download link*";
                    await sock.sendMessage(jid, { text: listMsg }, { quoted: msg });
                } else {
                    await sock.sendMessage(jid, { text: 'Could not fetch free games. Try again later. ⚠️' }, { quoted: msg });
                }
            } catch (e) {
                console.log('Error fetching free games:', e.message);
                await sock.sendMessage(jid, { text: 'Server connection error. Please try again. ⚠️' });
            }
            return;
        }

        // 2. Search Games
        if (text.startsWith('.search ')) {
            const gameName = text.replace('.search ', '').trim();
            if (!gameName) return;

            await sock.sendMessage(jid, { text: `🔍 Searching for "${gameName}"... ⏳` }, { quoted: msg });

            try {
                const { data } = await axios.get(EPIC_GAMES_FREE_GAMES_API, {
                    timeout: 10000
                });

                const searchResults = [];
                
                if (data.data && data.data.Catalog && data.data.Catalog.searchStore && data.data.Catalog.searchStore.elements) {
                    const elements = data.data.Catalog.searchStore.elements;
                    
                    elements.forEach((game) => {
                        if (game.title && game.title.toLowerCase().includes(gameName.toLowerCase()) && searchResults.length < 5) {
                            searchResults.push({
                                title: game.title,
                                id: game.catalogNs.mappings[0]?.pageSlug || game.id,
                                price: game.price?.totalPrice?.fmtPrice?.originalPrice || 'FREE',
                                description: game.description || 'No description'
                            });
                        }
                    });
                }

                if (searchResults.length > 0) {
                    sessionStore.set(sessionKey, { step: 'SELECT_GAME', games: searchResults });
                    let listMsg = `*🎮 SEARCH RESULTS FOR "${gameName}"*\n\n` + 
                                  searchResults.map((g, i) => `${i + 1}. ${g.title}\n   💰 ${g.price}`).join('\n\n') + 
                                  "\n\n*Reply with number to get download link*";
                    await sock.sendMessage(jid, { text: listMsg }, { quoted: msg });
                } else {
                    await sock.sendMessage(jid, { text: `No games found for "${gameName}". Try a different name. ❌` }, { quoted: msg });
                }
            } catch (e) {
                console.log('Error searching games:', e.message);
                await sock.sendMessage(jid, { text: 'Search failed. Please try again. ⚠️' });
            }
            return;
        }

        // 3. Game Info
        if (text.startsWith('.info ')) {
            const gameName = text.replace('.info ', '').trim();
            if (!gameName) return;

            await sock.sendMessage(jid, { text: `📋 Getting info for "${gameName}"... ⏳` }, { quoted: msg });

            try {
                const { data } = await axios.get(EPIC_GAMES_FREE_GAMES_API, {
                    timeout: 10000
                });

                let gameInfo = null;
                
                if (data.data && data.data.Catalog && data.data.Catalog.searchStore && data.data.Catalog.searchStore.elements) {
                    gameInfo = data.data.Catalog.searchStore.elements.find(g => 
                        g.title && g.title.toLowerCase() === gameName.toLowerCase()
                    );
                }

                if (gameInfo) {
                    const infoMsg = `*📋 ${gameInfo.title}*\n\n` +
                                   `💰 Price: ${gameInfo.price?.totalPrice?.fmtPrice?.originalPrice || 'FREE'}\n` +
                                   `📝 ${gameInfo.description || 'No description available'}\n\n` +
                                   `🔗 Download: https://www.epicgames.com/store/en-US/p/${gameInfo.catalogNs.mappings[0]?.pageSlug || gameInfo.id}`;
                    await sock.sendMessage(jid, { text: infoMsg }, { quoted: msg });
                } else {
                    await sock.sendMessage(jid, { text: `Game "${gameName}" not found. ❌` }, { quoted: msg });
                }
            } catch (e) {
                console.log('Error getting game info:', e.message);
                await sock.sendMessage(jid, { text: 'Could not fetch game info. ⚠️' });
            }
            return;
        }

        // 4. Selection Handling
        if (sessionStore.has(sessionKey)) {
            const session = sessionStore.get(sessionKey);
            const selection = parseInt(text.trim());
            if (isNaN(selection)) return;

            if (session.step === 'SELECT_GAME') {
                const selected = session.games[selection - 1];
                if (!selected) return;

                const downloadMsg = `✅ *GAME READY FOR DOWNLOAD*\n\n` +
                                   `🎮 *Game:* ${selected.title}\n` +
                                   `💰 *Price:* ${selected.price}\n` +
                                   `📝 *Description:* ${selected.description.substring(0, 100)}...\n\n` +
                                   `🔗 *DOWNLOAD LINK:*\n` +
                                   `${EPIC_STORE_URL}${selected.id}\n\n` +
                                   `📌 *Steps:*\n` +
                                   `1. Click the link above\n` +
                                   `2. Click "Get Game"\n` +
                                   `3. Install Epic Games Launcher if needed\n` +
                                   `4. Download through launcher\n\n` +
                                   `⚡ *Fast Download Tips:*\n` +
                                   `• Use wired connection for speed\n` +
                                   `• Close other apps while installing\n` +
                                   `• Check your internet speed`;
                
                await sock.sendMessage(jid, { text: downloadMsg }, { quoted: msg });
                sessionStore.delete(sessionKey);
            }
        }

        // 5. Help Command
        if (text === '.help' || text === '.commands') {
            const helpMsg = `*🎮 GAME BOT COMMANDS*\n\n` +
                           `📌 *Available Commands:*\n\n` +
                           `*.freegames* - Show free Epic Games this week\n` +
                           `*.search [game name]* - Search for a game\n` +
                           `*.info [game name]* - Get game details\n` +
                           `*.help* - Show this help menu\n\n` +
                           `*Example:*\n` +
                           `*.search Fortnite*\n` +
                           `*.info Elden Ring*\n\n` +
                           `⚡ Discord: Use on group chats only!`;
            await sock.sendMessage(jid, { text: helpMsg }, { quoted: msg });
        }
    });
}

startBot();
