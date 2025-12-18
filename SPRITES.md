# SIGNAL - Sprite and Asset Specifications

This document outlines all the sprites and images needed for the game. Place your custom artwork in the specified directories.

## 📁 Directory Structure

```
assets/
├── sprites/
│   └── characters/      # Character sprite sheets
├── backgrounds/          # Background layers
├── objects/             # Environmental objects
├── ui/                  # UI elements
└── effects/             # Visual effects
```

---

## 👤 CHARACTER SPRITES

**Location:** `assets/sprites/characters/`

### Required Characters

#### 1. **Finn (Protagonist)**
- **Filename:** `finn.png`
- **Size:** 32x48 pixels (or 48x48 for sprite sheet)
- **Description:** Black hair, white patient clothing, serious expression
- **States needed:** Idle, Walking, Running, Jumping, Crouching
- **Color scheme:** Black (hair), White (clothing), gray tones

#### 2. **Fiona (Sister)**
- **Filename:** `fiona.png`
- **Size:** 32x48 pixels
- **Description:** Black hair in two ponytails, blue hoodie, red dress
- **States needed:** Portrait/cutscene only
- **Color scheme:** Black (hair), Blue (hoodie), Red (dress)

#### 3. **Sarah (Receptionist)**
- **Filename:** `sarah.png`
- **Size:** 32x48 pixels
- **Description:** Professional receptionist, neutral expression
- **States needed:** Idle, Talking
- **Color scheme:** Professional hospital attire

#### 4. **Marcus (Security Guard)**
- **Filename:** `marcus.png`
- **Size:** 32x48 pixels
- **Description:** Security guard uniform, alert posture
- **States needed:** Idle, Walking/Patrol, Alert, Chase
- **Color scheme:** Dark blue/black security uniform

#### 5. **William (Ally)**
- **Filename:** `william.png`
- **Size:** 32x48 pixels
- **Description:** Brown hair, always smiling, friendly demeanor, white hospital clothing
- **States needed:** Idle, Walking, Talking
- **Color scheme:** Brown (hair), White (clothing)

#### 6. **Dr. Alistair (Antagonist)**
- **Filename:** `dr_alistair.png`
- **Size:** 32x48 pixels
- **Description:** White hair, glasses, black gloves, evil smile
- **States needed:** Idle, Talking, Menacing
- **Color scheme:** White (hair), Black (gloves), professional attire

#### 7. **Generic Guard**
- **Filename:** `guard.png`
- **Size:** 32x48 pixels
- **Description:** Standard security personnel
- **States needed:** Idle, Patrol, Alert
- **Color scheme:** Security uniform

#### 8. **Generic Patient**
- **Filename:** `patient.png`
- **Size:** 32x48 pixels
- **Description:** Hospital patient in gown
- **States needed:** Idle, Walking
- **Color scheme:** Hospital gown colors

---

## 🖼️ BACKGROUNDS

**Location:** `assets/backgrounds/`

### Layer System (for parallax effect)

#### 1. **Reception Background**
- **Filename:** `reception_bg.png`
- **Size:** 1920x1080 or larger
- **Description:** Hospital reception main background
- **Elements:** Sterile walls, hospital signage, waiting area

#### 2. **Hospital Exterior (Background Layer)**
- **Filename:** `hospital_exterior.png`
- **Size:** 2400x400 pixels
- **Description:** Distant view through windows
- **Elements:** City skyline, other hospital buildings

#### 3. **Windows Layer**
- **Filename:** `windows_layer.png`
- **Size:** 2400x300 pixels
- **Description:** Repeating window pattern for parallax
- **Transparency:** Use alpha channel for window frames

#### 4. **Clouds (Far Background)**
- **Filename:** `clouds.png`
- **Size:** 2400x200 pixels
- **Description:** Slow-moving clouds for depth
- **Style:** Subtle, moody hospital atmosphere

---

## 🏢 ENVIRONMENTAL OBJECTS

**Location:** `assets/objects/`

All objects should have **transparent backgrounds (PNG with alpha)**

#### 1. **Reception Desk**
- **Filename:** `desk.png`
- **Size:** 200x100 pixels
- **Description:** Professional reception counter

#### 2. **Bench/Seating**
- **Filename:** `bench.png`
- **Size:** 80x30 pixels
- **Description:** Waiting area bench

#### 3. **Locker**
- **Filename:** `locker.png`
- **Size:** 50x80 pixels
- **Description:** Metal locker with handle (hiding spot)
- **States:** Closed, Open (optional)

#### 4. **Computer Terminal**
- **Filename:** `computer.png`
- **Size:** 60x40 pixels
- **Description:** Desktop computer with monitor
- **States:** Off, On (glowing screen)

#### 5. **Vending Machine**
- **Filename:** `vending_machine.png`
- **Size:** 50x100 pixels
- **Description:** Snack/drink vending machine
- **Elements:** Glass front showing products, coin slot

#### 6. **Filing Cabinet**
- **Filename:** `filing_cabinet.png`
- **Size:** 60x80 pixels
- **Description:** Office filing cabinet with drawers

#### 7. **Door**
- **Filename:** `door.png`
- **Size:** 60x150 pixels
- **Description:** Hospital door
- **States:** Closed, Locked (red indicator), Open (optional)

#### 8. **Plant/Decoration**
- **Filename:** `plant.png`
- **Size:** 30x50 pixels
- **Description:** Decorative potted plant

#### 9. **Info Kiosk**
- **Filename:** `kiosk.png`
- **Size:** 60x100 pixels
- **Description:** Interactive hospital directory terminal

---

## 🎨 UI ELEMENTS

**Location:** `assets/ui/`

#### 1. **Health Bar Graphics**
- **Filename:** `health_bar.png`
- **Size:** 180x12 pixels
- **Description:** Health bar container and fill

#### 2. **Evidence Icon**
- **Filename:** `evidence_icon.png`
- **Size:** 24x24 pixels
- **Description:** Icon for collected evidence

#### 3. **Key/Item Icon**
- **Filename:** `key_icon.png`
- **Size:** 24x24 pixels
- **Description:** Icon for keys and items

---

## ✨ EFFECTS

**Location:** `assets/effects/`

#### 1. **Glow Effect**
- **Filename:** `glow.png`
- **Size:** 64x64 pixels
- **Description:** Radial glow for interactive objects
- **Format:** PNG with alpha, soft gradient

#### 2. **Particle**
- **Filename:** `particle.png`
- **Size:** 8x8 pixels
- **Description:** Small particle for effects
- **Colors:** Multiple color variations possible

#### 3. **Detection Cone**
- **Filename:** `detection_cone.png`
- **Size:** 400x400 pixels (radial)
- **Description:** Semi-transparent cone for enemy vision
- **Format:** PNG with alpha gradient

---

## 📋 SPRITE SHEET FORMAT (Optional)

If you want to create sprite sheets for animations:

### Character Sprite Sheet
```
[Idle 1] [Idle 2] [Idle 3] [Idle 4]
[Walk 1] [Walk 2] [Walk 3] [Walk 4] [Walk 5] [Walk 6]
[Run 1]  [Run 2]  [Run 3]  [Run 4]  [Run 5]  [Run 6]  [Run 7]  [Run 8]
[Jump 1] [Jump 2] [Jump 3] [Jump 4]
[Crouch 1] [Crouch 2]
```

**Format:** Horizontal strip, each frame 32x48 or 48x48 pixels

---

## 🎨 ART STYLE GUIDELINES

### Color Palette
Based on the game's design document:

**Player (Finn):**
- Primary: `#bb9af7` (purple-blue)
- Outline: `#7aa2f7` (blue)

**Allies:**
- William: `#9ece6a` (green)

**Enemies:**
- Guards: `#f7768e` (red)

**Neutral:**
- NPCs: `#e0af68` (orange)

**Environment:**
- Walls: `#414868` (dark gray-blue)
- Floor: `#2d3250` (darker gray)
- Background: `#1a1d29` to `#24283b` (dark gradient)
- Accent: `#7aa2f7` (blue)

### Style Notes
- Pixel art style (retro aesthetic)
- Clean, readable sprites
- High contrast for visibility
- Use transparency for smooth edges
- Hospital theme: sterile, clinical, slightly ominous

---

## 🚀 IMPLEMENTATION

### How Images Are Used

1. **Fallback System:** The game has pixel art fallbacks if images aren't available
2. **Loading:** Images are preloaded during the loading screen
3. **Rendering:** If an image exists, it's used; otherwise, pixel art renders
4. **Performance:** Images are cached after first load

### Adding Your Sprites

1. Create your sprite/image according to specifications above
2. Save as **PNG format** with **transparent background** (where applicable)
3. Place in the correct directory (e.g., `assets/sprites/characters/finn.png`)
4. The game will automatically detect and use your custom artwork!

### Testing Your Sprites

1. Place your PNG file in the correct location
2. Refresh the game in browser
3. The loading screen will show progress
4. Your sprite should appear in-game immediately

---

## 📊 PRIORITY LIST

If you're creating sprites gradually, here's the recommended order:

### High Priority
1. ✅ Finn (protagonist)
2. ✅ Marcus (security guard) - most visible enemy
3. ✅ Sarah (receptionist)
4. ✅ Reception background

### Medium Priority
5. ✅ William (ally)
6. ✅ Computer, Locker, Filing Cabinet (interactive objects)
7. ✅ Vending Machine
8. ✅ Background layers (windows, exterior)

### Low Priority (Can use pixel art fallbacks)
9. Dr. Alistair (appears later)
10. Generic guards and patients
11. UI elements (current UI looks good)
12. Effect sprites (current effects work well)

---

## 💡 TIPS

- **Resolution:** Higher is better, but keep file sizes reasonable (<500KB per sprite)
- **Transparency:** Always use PNG with alpha channel for sprites
- **Consistency:** Match the pixel art style even if hand-drawn
- **Testing:** Test each sprite immediately after adding
- **Naming:** Use exact filenames as specified (case-sensitive on some systems)
- **Backup:** Keep source files (PSD, Aseprite, etc.) separate from exported PNGs

---

## 🎮 Current Status

Game works perfectly with pixel art fallbacks. Adding sprites is **optional but recommended** for visual polish!

**Without custom sprites:** Fully functional pixel art game ✅
**With custom sprites:** Professional, polished look 🎨✨
