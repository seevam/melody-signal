# SIGNAL - Investigation Horror Game

A 2D first-person investigation horror/thriller game where players must uncover a hospital's dark secrets of illegal human experiments and organ trafficking within 30 in-game days.

## 🎮 Game Overview

**Genre:** 2D Investigation Horror/Thriller  
**Platform:** Web Browsers  
**Play Time:** 4-6 hours first playthrough  
**Target Audience:** Ages 16+

## 🕹️ Controls

- **WASD / Arrow Keys:** Move
- **Shift:** Sprint (uses stamina)
- **Space:** Jump
- **E:** Interact
- **Tab / I:** Inventory
- **Esc / P:** Pause

## 🎯 Objectives

- Investigate Saint Cross Hospital
- Collect evidence of illegal activities
- Avoid detection by hostile staff
- Uncover the truth about your sister's death
- Complete investigation within 30 days

## 📖 Level 1: Reception (Completed)

### Features
- **Hospital Reception Area**: Fully playable starting level with reception desk, waiting area, and hallways
- **NPCs**:
  - **Sarah (Receptionist)**: Neutral NPC who provides information about your sister
  - **Marcus (Security Guard)**: Patrols the reception area, avoid his detection cone
  - **William (Ally)**: Friendly patient who offers helpful hints and warnings
- **Evidence Collection**: Three collectible evidence items:
  - Hospital Map
  - Visitor Log
  - Hospital Pamphlet
- **Dialogue System**: Branching conversations with choice consequences
- **Stealth Mechanics**: Avoid security guard patrols and manage suspicion meter
- **Platforming**: Jump, run, and navigate the hospital environment
- **Objective Tracking**: Dynamic HUD showing current objectives

### Gameplay Tips
- Talk to NPCs to gather information about the hospital
- Collect all evidence items in the reception area
- Avoid being spotted by Marcus (the security guard)
- Press E near evidence or NPCs to interact
- Use Shift to sprint, but watch your stamina meter
- Your choices in dialogue affect the suspicion level

## 🚀 Play Online

Visit: [Your Vercel URL will be here]

## 💻 Local Development

1. Clone this repository
2. Run a local server:
```bash
python -m http.server 8000
```
3. Open `http://localhost:8000` in your browser

## 🛠️ Technologies Used

- **HTML5 Canvas**: Pixel-perfect 2D rendering
- **JavaScript (ES6+)**: Game logic and systems
- **CSS3**: Modern UI with animations
- **Pixel Art Style**: Retro aesthetic with modern effects

## 📁 Project Structure

```
melody-signal/
├── index.html              # Main HTML file
├── css/
│   ├── style.css          # Global styles
│   └── game.css           # Game-specific styles
├── js/
│   ├── main.js            # Game core and loop
│   ├── player.js          # Player controls and physics
│   ├── npc.js             # NPC AI and behavior
│   ├── stealth.js         # Stealth system
│   ├── evidence.js        # Evidence and inventory
│   ├── renderer.js        # Pixel art rendering
│   └── config.js          # Game configuration
└── assets/
    └── data/
        ├── level1.json    # Level 1 data
        └── dialogues.json # NPC dialogues
```

## 🎨 Features Implemented

- ✅ Player movement with physics (walk, run, jump)
- ✅ Stamina system for sprinting
- ✅ Health system with UI
- ✅ Day/Night cycle counter (30-day limit)
- ✅ Stealth and detection system
- ✅ NPC AI with patrol routes
- ✅ Detection cones for security
- ✅ Evidence collection system
- ✅ Inventory with tabs (Evidence, Items, Notes)
- ✅ Branching dialogue system
- ✅ Objective tracking
- ✅ Collision detection
- ✅ Camera follow system
- ✅ Pause menu
- ✅ Settings menu
- ✅ Pixel art renderer with effects

## 🔜 Coming Soon (Future Levels)

- Level 2: Mortuary
- Level 3: Record Room
- Level 4: Staff Room (Betrayal scene)
- Level 5: Escape sequence
- Level 6: Underground Laboratory
- Levels 7-9: Chase, Final confrontation, and endings



