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

## 📖 Level 1: Reception (Enhanced - Version 2.0)

### Core Features
- **Expansive Hospital Reception**: Multi-level area with ground floor, elevated platforms, and mezzanine
- **6 NPCs**:
  - **Sarah (Receptionist)**: Neutral NPC at reception desk with crucial information
  - **Marcus (Security Guard)**: Patrols ground floor with advanced detection
  - **William (Ally)**: Friendly patient who offers hints and warnings
  - **Guard2**: Elite security patrolling the upper security area
  - **Patient1 & Patient2**: Background NPCs adding atmosphere
- **4 Evidence Items**:
  - Hospital Map
  - Visitor Log
  - Hospital Pamphlet
  - Hidden Crumpled Note (secret on upper level)
- **5 Interactive Objects**:
  - **Visitor Pass Printer**: Puzzle - requires talking to Sarah first
  - **Security Computer**: Hack to find access code (2845)
  - **Filing Cabinet**: Search for additional evidence
  - **Vending Machine**: Restore 25 health points
  - **Hospital Directory Kiosk**: Get helpful location information

### New Gameplay Mechanics

#### 🫥 Hiding System
- Hide in lockers and behind filing cabinets
- Reduces suspicion by 20 points instantly
- Enemies cannot detect you while hidden
- Press [E] to enter/exit hiding spots
- Player becomes semi-transparent when hiding

#### 🧩 Puzzle Systems
- **Visitor Pass Quest**: Talk to Sarah → Print pass → Access restricted areas
- **Access Code Hunt**: Hack security computer → Get code 2845 → Unlock records room
- **Evidence Chain**: Collect 3+ evidence pieces to complete objective

#### 🏃 Advanced Platforming
- Multi-level environment with platforms and stairs
- One-way platforms (jump through from below)
- Elevated security office area
- Vertical exploration with secret areas

#### ✨ Visual Feedback
- **Particle Effects**: Collect items and complete objectives with visual celebrations
- **Notifications**: Real-time feedback for all actions and discoveries
- **Camera Shake**: Dynamic camera effects (expandable for chase scenes)
- **Hiding Indicator**: "HIDING" text appears when concealed

#### 🎮 Enhanced Interactions
- Glow effects on all interactive objects
- Different object types (computers, printers, vending machines, kiosks)
- Health restoration from vending machine (one-time use)
- Cabinet searching with evidence rewards

### Level Layout
```
Upper Level (Platforms)
├── Security Office
├── Lockers (hiding spots)
├── Security Computer (hackable)
└── Secret Evidence Location

Ground Floor
├── Reception Desk
├── Waiting Area (benches, coffee table)
├── Filing Cabinets (hiding + searching)
├── Vending Machines
├── Hospital Directory Kiosk
└── Multiple Patrol Routes
```

### 6 Objectives
1. Explore the hospital reception area
2. Speak with receptionist about Fiona
3. Obtain visitor pass from printer
4. Find security access code
5. Collect at least 3 pieces of evidence
6. Explore the elevated security area

### Advanced Gameplay Tips
- **Stealth**: Use filing cabinets and lockers to hide from guards
- **Timing**: Wait for guard patrol patterns before moving
- **Exploration**: Climb to the upper area for secrets and better vantage
- **Puzzles**: Talk to Sarah before trying the visitor pass printer
- **Resources**: Use the vending machine strategically for health
- **Evidence**: Check the directory kiosk for hints on locations
- **Objectives**: Complete all 6 objectives for full level completion

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

### Core Mechanics
- ✅ Player movement with physics (walk, run, jump)
- ✅ Stamina system for sprinting
- ✅ Health system with UI
- ✅ Day/Night cycle counter (30-day limit)
- ✅ Advanced collision detection (platforms, walls, furniture)
- ✅ One-way platform physics
- ✅ Camera follow with smooth interpolation
- ✅ Camera shake system

### Stealth & AI
- ✅ Stealth and detection system
- ✅ **NEW**: Hiding mechanics (lockers, cabinets)
- ✅ NPC AI with complex patrol routes
- ✅ Detection cones with visual feedback
- ✅ Chase behavior when detected
- ✅ Hidden player immunity from detection

### Interaction & Puzzles
- ✅ Evidence collection system
- ✅ **NEW**: 5 types of interactive objects
- ✅ **NEW**: Visitor pass puzzle system
- ✅ **NEW**: Computer hacking mechanic
- ✅ **NEW**: Searchable containers
- ✅ **NEW**: Health restoration items
- ✅ Inventory with tabs (Evidence, Items, Notes)
- ✅ Branching dialogue system
- ✅ Objective tracking (6 objectives)

### Visual & Audio
- ✅ Pixel art renderer with effects
- ✅ **NEW**: Particle effect system
- ✅ **NEW**: Real-time notifications
- ✅ **NEW**: Glow effects on interactables
- ✅ **NEW**: Hiding transparency effect
- ✅ Enhanced parallax backgrounds
- ✅ Multi-type object rendering

### UI & Menus
- ✅ Pause menu
- ✅ Settings menu
- ✅ Inventory system
- ✅ **NEW**: Notification toast system
- ✅ HUD with all stats
- ✅ Interaction prompts

## 🔜 Coming Soon (Future Levels)

- Level 2: Mortuary
- Level 3: Record Room
- Level 4: Staff Room (Betrayal scene)
- Level 5: Escape sequence
- Level 6: Underground Laboratory
- Levels 7-9: Chase, Final confrontation, and endings



