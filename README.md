# 🎮 WhatsApp Epic Games Download Bot

A WhatsApp bot that helps you find and download PC games from Epic Games store directly through WhatsApp messages!

---

## ✨ Features

- 🎮 **Free Games**: Show free Epic Games available this week
- 🔍 **Game Search**: Search for any game on Epic Games store
- 📋 **Game Info**: Get detailed information about games
- 💻 **Download Links**: Direct links to Epic Games store
- ⚡ **Fast & Efficient**: Instant results
- 📱 **WhatsApp Interface**: Use through WhatsApp groups
- 🌐 **Live Data**: Real-time data from Epic Games API

---

## 📋 Prerequisites

Same as your movie bot:
- **Node.js** (v16 or higher)
- **npm**
- **Active WhatsApp Account**
- **Internet Connection**

---

## 🚀 Installation Steps

### 1. Install Dependencies

The game bot uses the same dependencies as your movie bot. No new packages needed!

```bash
npm install
```

### 2. Start the Game Bot

```bash
node game-bot.js
```

### 3. Link WhatsApp Account

Same process as your movie bot:

1. Enter your phone number
2. Get pairing code
3. Open WhatsApp → Settings → Linked Devices
4. Scan QR code or enter pairing code
5. Wait for connection confirmation

---

## 📖 How to Use - Commands

### **1. Show Free Epic Games**

Send:
```
.freegames
```

Or:
```
.games
```

**Bot Response:**
```
🎮 FREE EPIC GAMES THIS WEEK

1. Elden Ring
   💰 $59.99

2. A Plague Tale: Innocence
   💰 $39.99

3. Control Ultimate Edition
   💰 $39.99

...

Reply with number to get download link
```

### **2. Search for a Game**

Send:
```
.search [game name]
```

**Examples:**
```
.search Fortnite
.search Cyberpunk 2077
.search The Witcher 3
```

**Bot Response:**
```
🔍 Searching for "Fortnite"... ⏳

Searching...

🎮 SEARCH RESULTS FOR "FORTNITE"

1. Fortnite
   💰 FREE

2. Fortnite - Save the World
   💰 FREE

Reply with number to get download link
```

### **3. Get Game Information**

Send:
```
.info [game name]
```

**Example:**
```
.info Elden Ring
```

**Bot Response:**
```
📋 Elden Ring

💰 Price: $59.99
📝 Elden Ring is an action role-playing game developed by FromSoftware...

🔗 Download: https://www.epicgames.com/store/en-US/p/elden-ring
```

### **4. Get Help**

Send:
```
.help
```

Or:
```
.commands
```

**Bot Response:**
```
🎮 GAME BOT COMMANDS

📌 Available Commands:

.freegames - Show free Epic Games this week
.search [game name] - Search for a game
.info [game name] - Get game details
.help - Show this help menu

Example:
.search Fortnite
.info Elden Ring

⚡ Discord: Use on group chats only!
```

---

## 📥 Step-by-Step Download Instructions

### **Step 1: Search or Browse**
```
.freegames
```
Get list of available games

### **Step 2: Select a Game**
Reply with the game number:
```
1
```

### **Step 3: Get Download Link**
Bot sends download link and instructions:

```
✅ GAME READY FOR DOWNLOAD

🎮 Game: Elden Ring
💰 Price: $59.99
📝 Description: Elden Ring is an action RPG...

🔗 DOWNLOAD LINK:
https://www.epicgames.com/store/en-US/p/elden-ring

📌 Steps:
1. Click the link above
2. Click "Get Game"
3. Install Epic Games Launcher if needed
4. Download through launcher

⚡ Fast Download Tips:
• Use wired connection for speed
• Close other apps while installing
• Check your internet speed
```

### **Step 4: Download**
1. Click the Epic Games store link
2. Click **"Get Game"** button
3. Sign in to your Epic Games account
4. Install Epic Games Launcher (if needed)
5. Download and install the game

---

## 🎯 Command Reference

| Command | Example | Description |
|---------|---------|-------------|
| `.freegames` | `.freegames` | Show free games this week |
| `.search` | `.search Fortnite` | Search for a game |
| `.info` | `.info Elden Ring` | Get game details |
| `.help` | `.help` | Show all commands |

---

## ⚡ Performance Tips for Fast Downloads

### Before Downloading:

1. **Internet Speed**
   ```
   Test your speed: https://speedtest.net
   Recommended: 25+ Mbps for fast download
   ```

2. **System Requirements**
   - Check game requirements before downloading
   - Ensure enough hard drive space
   - Close unnecessary applications

3. **Network Optimization**
   ```
   • Use wired connection (faster than WiFi)
   • Close VPNs if not needed
   • Disable large file syncs
   • Close download managers
   ```

4. **Epic Games Launcher Settings**
   - Set launcher to high priority in Task Manager
   - Disable bandwidth limit in launcher settings
   - Use local drive (not external drive) for installation

---

## 🔍 Troubleshooting

### Problem: Bot not responding to commands

**Solution:**
- Make sure WhatsApp is linked
- Bot only works in group chats
- Restart with `node game-bot.js`
- Check internet connection

### Problem: "No games found"

**Solution:**
- Check spelling of game name
- Try a simpler search term
- Wait a few seconds and try again
- Some games may be region-restricted

### Problem: Download link not working

**Solution:**
- The game may be region-restricted
- Try visiting epicgames.com directly
- Log in to your Epic Games account
- Check if account has purchase restrictions

### Problem: Can't install game

**Solution:**
```
1. Make sure you have enough disk space
   Required: Check game store page

2. Run Epic Games Launcher as Administrator
   Right-click → Run as administrator

3. Disable antivirus temporarily during install
   (Enable it again after)

4. Check game system requirements
   Visit: https://www.epicgames.com/store

5. Reinstall Epic Games Launcher
   Uninstall → Download → Install
```

### Problem: Very slow download

**Solution:**
- Check internet speed
- Switch to wired connection
- Close all other downloads
- Restart Epic Games Launcher
- Check Epic Games servers status

---

## 📊 How Epic Games API Works

The bot uses Epic Games public API to:
- Get list of free games
- Search game catalog
- Show game details and prices
- Provide direct download links

**API Endpoint Used:**
```
https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions
```

This is the same API Epic Games website uses, so it's safe and legal!

---

## 🌐 About Epic Games

**Epic Games** is the official creator of:
- Fortnite
- Unreal Engine
- Epic Games Launcher (PC game platform)

**Benefits:**
- Free games every week
- Cross-platform play
- Cloud save support
- Regular sales and discounts
- Free games library

[Visit Epic Games Store](https://www.epicgames.com/store)

---

## 🔒 Security & Legality

✅ **This bot is 100% Legal**
- Uses Epic Games public API
- Links directly to official store
- No piracy or illegal downloads
- All games are legitimate

✅ **Your Safety**
- Data stays on your computer
- No personal information collected
- Secure WhatsApp communication
- No unauthorized account access

---

## 📁 File Structure

```
movie-Dl/
├── index.js              # Movie downloader bot
├── game-bot.js           # NEW: Game downloader bot
├── package.json          # Dependencies
├── README.md             # Movie bot guide
└── auth_info_baileys/    # WhatsApp auth files
```

---

## 🚀 Running Both Bots

If you want to run both movie and game bots:

### Option 1: Separate Sessions
```bash
# Terminal 1
node index.js

# Terminal 2
node game-bot.js
```

### Option 2: Combine into One Bot
Create a master bot that handles both movie and game commands!

---

## 💡 Pro Tips

1. **Bookmark Free Games**
   - Get notification every week of free games
   - Add `.freegames` to your regular checks

2. **Search Wisely**
   - Use exact game names for better results
   - Example: `.search the witcher` → finds "The Witcher 3"

3. **Check Prices**
   - Free games show "FREE"
   - Sale games show discounted prices
   - Regular games show full price

4. **System Requirements**
   - Always check before downloading
   - Some games require powerful PCs
   - Better games = larger file sizes

5. **Fast Downloads**
   - Wired connection preferred
   - Schedule downloads at night (less network traffic)
   - Use SSD for faster installation

---

## 🎮 Popular Free Games to Look For

- Fortnite (Always Free)
- Destiny 2
- Star Wars: The Old Republic
- Warframe
- Lost Ark
- Apex Legends

Plus new free games every Thursday!

---

## 📞 Support

If you encounter issues:

1. Check **Troubleshooting** section
2. Verify prerequisites are installed
3. Ensure WhatsApp is linked correctly
4. Check internet connection
5. Restart the bot

---

## 📝 Example Workflow

```
User: .freegames

Bot: Shows 10 free games

User: 3

Bot: Game details + download link

User: Clicks link → Opens Epic Games store

User: Clicks "Get Game" → Game added to library

User: Opens Epic Games Launcher → Downloads game

User: Plays! 🎮
```

---

## 🎉 You're Ready!

Your Epic Games WhatsApp bot is ready to use!

```bash
node game-bot.js
```

**Enjoy fast and easy game downloads!** 🚀

---

*Last Updated: April 2026*
*Created with ❤️ for gaming enthusiasts*
