class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = GAME_STATES.LOADING;
        this.lastTime = 0;

        // Initialize asset manager
        this.assetManager = new AssetManager();

        // Initialize pixel renderer (will be updated with assets after loading)
        this.renderer = new PixelRenderer(this.ctx);

        // Game systems
        this.player = null;
        this.npcs = [];
        this.stealthSystem = new StealthSystem();
        this.evidenceSystem = new EvidenceSystem();

        // Level data
        this.levelData = null;
        this.levelObjects = [];
        this.evidenceItems = [];
        this.objectives = [];
        this.interactiveObjects = [];
        this.particles = [];

        // Interaction
        this.nearbyInteractable = null;

        // Player states
        this.playerHiding = false;
        this.currentHidingSpot = null;

        // Puzzle state
        this.visitorPassObtained = false;
        this.accessCodeFound = false;
        this.accessCode = '2845';

        // Camera offset for scrolling
        this.cameraX = 0;
        this.cameraY = 0;
        this.cameraShake = 0;

        // Dialogue
        this.dialogues = null;
        this.currentDialogue = null;

        // Tutorial
        this.tutorialShown = false;

        // Initialize
        this.init();
    }

    async init() {
        // Set canvas size
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;

        // Show loading screen
        this.showLoading();

        // Load game data
        await this.loadGameData();

        // Setup event listeners
        this.setupEventListeners();

        // Hide loading, show main menu
        this.hideLoading();
        this.showMainMenu();
    }

    async loadGameData() {
        try {
            // Update loading text
            this.updateLoadingText('Loading assets...');

            // Load assets with progress tracking
            await this.assetManager.loadAll((progress) => {
                this.updateLoadingProgress(progress * 60); // Assets take 60% of loading
            });

            // Update renderer with asset manager
            this.renderer = new PixelRenderer(this.ctx, this.assetManager);

            this.updateLoadingText('Loading level data...');
            this.updateLoadingProgress(70);

            // Load level data
            const levelResponse = await fetch('assets/data/level1.json');
            this.levelData = await levelResponse.json();

            this.updateLoadingProgress(85);

            // Load dialogues
            const dialogueResponse = await fetch('assets/data/dialogues.json');
            this.dialogues = await dialogueResponse.json();

            this.updateLoadingProgress(100);
            this.updateLoadingText('Ready!');

            console.log('Game data loaded successfully');
            console.log('Assets loaded:', this.assetManager.images.size);
        } catch (error) {
            console.error('Error loading game data:', error);
        }
    }

    setupEventListeners() {
        // Keyboard input
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // Menu buttons
        document.getElementById('new-game-btn').addEventListener('click', () => this.startNewGame());
        document.getElementById('continue-btn').addEventListener('click', () => this.continueGame());
        document.getElementById('settings-btn').addEventListener('click', () => this.showSettings());
        document.getElementById('credits-btn').addEventListener('click', () => this.showCredits());

        // Pause menu
        document.getElementById('resume-btn').addEventListener('click', () => this.resumeGame());
        document.getElementById('inventory-btn').addEventListener('click', () => this.toggleInventory());
        document.getElementById('pause-settings-btn').addEventListener('click', () => this.showSettings());
        document.getElementById('menu-btn').addEventListener('click', () => this.returnToMenu());

        // Inventory
        document.getElementById('close-inventory').addEventListener('click', () => this.evidenceSystem.hideInventory());
        const tabs = document.querySelectorAll('.inventory-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.evidenceSystem.currentTab = tab.dataset.tab;
                this.evidenceSystem.renderInventoryContent();
            });
        });

        // Settings
        document.getElementById('close-settings').addEventListener('click', () => this.hideSettings());
        document.getElementById('close-credits').addEventListener('click', () => this.hideCredits());
    }

    handleKeyDown(e) {
        if (this.state === GAME_STATES.PLAYING && this.player) {
            this.player.keysPressed[e.key] = true;

            // Jump
            if (CONFIG.KEYS.JUMP.includes(e.key)) {
                this.player.jump();
            }

            // Sprint
            if (CONFIG.KEYS.SPRINT.includes(e.key)) {
                this.player.isSprinting = true;
            }

            // Crouch
            if (CONFIG.KEYS.CROUCH.includes(e.key)) {
                this.player.isCrouching = true;
            }

            // Interact
            if (CONFIG.KEYS.INTERACT.includes(e.key)) {
                this.handleInteraction();
            }

            // Inventory
            if (CONFIG.KEYS.INVENTORY.includes(e.key)) {
                e.preventDefault();
                this.toggleInventory();
            }
        }

        // Pause (works in any state)
        if (CONFIG.KEYS.PAUSE.includes(e.key)) {
            e.preventDefault();
            this.togglePause();
        }
    }

    handleKeyUp(e) {
        if (this.player) {
            this.player.keysPressed[e.key] = false;

            // Sprint
            if (CONFIG.KEYS.SPRINT.includes(e.key)) {
                this.player.isSprinting = false;
            }

            // Crouch
            if (CONFIG.KEYS.CROUCH.includes(e.key)) {
                this.player.isCrouching = false;
            }
        }
    }

    handleInteraction() {
        if (this.nearbyInteractable) {
            if (this.nearbyInteractable.type === 'evidence') {
                this.collectEvidence(this.nearbyInteractable);
            } else if (this.nearbyInteractable.type === 'npc') {
                this.startDialogue(this.nearbyInteractable);
            } else if (this.nearbyInteractable.type === 'hiding') {
                this.toggleHiding(this.nearbyInteractable);
            } else if (this.nearbyInteractable.interactable && this.nearbyInteractable.action) {
                this.nearbyInteractable.action();
            }
        }
    }

    // Interactive object methods
    attemptPrintPass() {
        if (this.visitorPassObtained) {
            this.showNotification('You already have a visitor pass.');
            return;
        }

        // Check if player talked to receptionist
        const talkedToSarah = this.objectives.find(obj => obj.id === 'talk_to_receptionist' && obj.completed);

        if (talkedToSarah) {
            this.visitorPassObtained = true;
            this.evidenceSystem.addItem({
                name: 'Visitor Pass',
                description: 'Official Saint Cross Hospital visitor pass. Grants access to restricted areas.'
            });
            this.showNotification('Visitor pass obtained! You can now access staff areas.');
            this.createParticles(650, 765, '#9ece6a', 10);

            // Mark objective complete
            const passObjective = this.objectives.find(obj => obj.id === 'get_visitor_pass');
            if (passObjective) {
                passObjective.completed = true;
                this.updateObjectiveUI();
            }
        } else {
            this.showNotification('Access denied. You need receptionist authorization first.');
        }
    }

    hackComputer() {
        if (this.accessCodeFound) {
            this.showNotification('You already hacked this computer.');
            return;
        }

        this.showNotification('Hacking computer... Access code found: 2845');
        this.accessCodeFound = true;
        this.evidenceSystem.addNote({
            title: 'Security Code',
            content: 'Access code for records room: 2845'
        });
        this.createParticles(1400, 620, '#7aa2f7', 15);

        // Mark objective complete
        const codeObjective = this.objectives.find(obj => obj.id === 'find_access_code');
        if (codeObjective) {
            codeObjective.completed = true;
            this.updateObjectiveUI();
        }
    }

    searchCabinet() {
        const cabinet = this.interactiveObjects.find(obj => obj.type === 'cabinet');
        if (cabinet && !cabinet.searched) {
            cabinet.searched = true;
            this.evidenceSystem.collectEvidence({
                name: 'Patient Transfer Records',
                description: 'Records showing unusual patient transfers to the basement level during night shifts.'
            });
            this.showNotification('Found evidence in filing cabinet!');
            this.createParticles(860, 810, '#bb9af7', 12);
        } else {
            this.showNotification('The cabinet is empty.');
        }
    }

    useVendingMachine() {
        const vending = this.interactiveObjects.find(obj => obj.type === 'vending');
        if (vending && !vending.used) {
            vending.used = true;
            this.player.heal(25);
            this.showNotification('+25 Health! The snack helps you recover.');
            this.createParticles(410, 760, '#9ece6a', 8);
        } else {
            this.showNotification('Out of order.');
        }
    }

    readKiosk() {
        this.showNotification('Hospital Directory: Reception (Ground), Records (2F), Mortuary (B1), Staff Room (2F), Lab (B2)');
    }

    toggleHiding(hidingSpot) {
        if (this.playerHiding) {
            // Exit hiding
            this.playerHiding = false;
            this.currentHidingSpot = null;
            this.player.hidden = false;
            this.showNotification('You leave your hiding spot.');
        } else {
            // Enter hiding
            this.playerHiding = true;
            this.currentHidingSpot = hidingSpot;
            this.player.hidden = true;
            this.showNotification('You are now hiding. Press [E] to leave.');
            // Reduce suspicion while hiding
            this.stealthSystem.suspicionLevel = Math.max(0, this.stealthSystem.suspicionLevel - 20);
            this.stealthSystem.updateSuspicionUI();
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'game-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    createParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                velocityX: (Math.random() - 0.5) * 100,
                velocityY: (Math.random() - 0.5) * 100 - 50,
                life: 1.0,
                color: color,
                size: Math.random() * 4 + 2
            });
        }
    }

    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.velocityX * deltaTime;
            particle.y += particle.velocityY * deltaTime;
            particle.velocityY += 200 * deltaTime; // Gravity
            particle.life -= deltaTime * 0.8;

            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    collectEvidence(evidence) {
        this.evidenceSystem.collectEvidence(evidence);
        evidence.collected = true;
        this.nearbyInteractable = null;
        this.hideInteractionPrompt();

        // Check objectives
        this.checkObjectives();
    }

    startDialogue(npc) {
        this.state = GAME_STATES.DIALOGUE;
        const dialogueKey = npc.name.toLowerCase() + '_greeting';
        this.showDialogue(dialogueKey);
    }

    showDialogue(dialogueKey) {
        if (!this.dialogues || !this.dialogues[dialogueKey]) {
            console.error('Dialogue not found:', dialogueKey);
            return;
        }

        this.currentDialogue = this.dialogues[dialogueKey];
        const dialogueBox = document.getElementById('dialogue-box');
        const speaker = document.getElementById('dialogue-speaker');
        const text = document.getElementById('dialogue-text');
        const choices = document.getElementById('dialogue-choices');

        speaker.textContent = this.currentDialogue.speaker;
        text.textContent = this.currentDialogue.text;

        // Clear and add choices
        choices.innerHTML = '';
        if (this.currentDialogue.choices) {
            this.currentDialogue.choices.forEach((choice, index) => {
                const button = document.createElement('button');
                button.className = 'dialogue-choice-btn';
                button.textContent = choice.text;
                button.addEventListener('click', () => this.selectDialogueChoice(choice));
                choices.appendChild(button);
            });
        } else {
            const button = document.createElement('button');
            button.className = 'dialogue-choice-btn';
            button.textContent = 'Continue';
            button.addEventListener('click', () => this.closeDialogue());
            choices.appendChild(button);
        }

        dialogueBox.classList.remove('hidden');
    }

    selectDialogueChoice(choice) {
        if (choice.suspicionIncrease) {
            this.stealthSystem.increaseSuspicion(choice.suspicionIncrease);
        }

        if (choice.nextDialogue) {
            this.showDialogue(choice.nextDialogue);
        } else {
            this.closeDialogue();
        }
    }

    closeDialogue() {
        document.getElementById('dialogue-box').classList.add('hidden');
        this.currentDialogue = null;
        this.state = GAME_STATES.PLAYING;
    }

    checkObjectives() {
        this.objectives.forEach(obj => {
            if (!obj.completed) {
                // Check various objective conditions
                if (obj.id === 'collect_evidence' && this.evidenceSystem.evidence.length >= 3) {
                    obj.completed = true;
                    this.showNotification('Objective complete: Evidence collected!');
                    this.createParticles(this.player.x, this.player.y - 30, '#9ece6a', 20);
                } else if (obj.id === 'talk_to_receptionist') {
                    // This is completed when specific dialogue is finished
                    // Can be set from dialogue system
                } else if (obj.id === 'explore_upper_area') {
                    // Check if player reached upper platform
                    if (this.player.y < 650) {
                        obj.completed = true;
                        this.showNotification('Upper area explored!');
                    }
                }
            }
        });

        this.updateObjectiveUI();
    }

    updateObjectiveUI() {
        const currentObjective = this.objectives.find(obj => !obj.completed);
        if (currentObjective) {
            document.getElementById('objective-text').textContent = currentObjective.description;
        } else {
            document.getElementById('objective-text').textContent = 'Level Complete!';
        }
    }

    showInteractionPrompt() {
        document.getElementById('interaction-prompt').classList.remove('hidden');
    }

    hideInteractionPrompt() {
        document.getElementById('interaction-prompt').classList.add('hidden');
    }

    startNewGame() {
        this.hideMainMenu();
        this.loadLevel();
        this.state = GAME_STATES.PLAYING;
        document.getElementById('game-container').classList.remove('hidden');
        this.startGameLoop();
    }

    continueGame() {
        // TODO: Load saved game
        console.log('Continue game not yet implemented');
    }

    loadLevel() {
        if (!this.levelData) return;

        // Create player
        const startPos = this.levelData.startPosition;
        this.player = new Player(startPos.x, startPos.y);

        // Create NPCs
        this.npcs = [];
        this.levelData.npcs.forEach(npcData => {
            const npc = new NPC(
                npcData.type,
                npcData.position.x,
                npcData.position.y,
                npcData.patrolPoints
            );
            npc.name = npcData.name;
            this.npcs.push(npc);
        });

        // Setup evidence items
        this.evidenceItems = this.levelData.evidence.map(evidence => ({
            ...evidence,
            x: evidence.position.x,
            y: evidence.position.y,
            collected: false,
            type: 'evidence'
        }));

        // Setup objectives
        this.objectives = [...this.levelData.objectives];
        this.updateObjectiveUI();

        // Create level geometry
        this.createLevelGeometry();
    }

    createLevelGeometry() {
        this.levelObjects = [
            // Left boundary wall
            { x: 0, y: 500, width: 50, height: 400, type: 'wall' },

            // Reception desk (large, multi-part)
            { x: 500, y: 750, width: 250, height: 100, type: 'furniture', name: 'reception_desk' },

            // Waiting area benches
            { x: 150, y: 820, width: 80, height: 30, type: 'furniture' },
            { x: 260, y: 820, width: 80, height: 30, type: 'furniture' },
            { x: 150, y: 760, width: 80, height: 30, type: 'furniture' },

            // Coffee table in waiting area
            { x: 190, y: 785, width: 60, height: 40, type: 'furniture' },

            // Filing cabinets (can hide behind)
            { x: 850, y: 800, width: 60, height: 80, type: 'hiding', name: 'filing_cabinet' },
            { x: 950, y: 800, width: 60, height: 80, type: 'hiding', name: 'filing_cabinet' },

            // Elevated platform area (balcony/mezzanine)
            { x: 1100, y: 650, width: 400, height: 30, type: 'platform' },
            { x: 1100, y: 550, width: 200, height: 30, type: 'platform' },

            // Stairs to elevated area
            { x: 1000, y: 750, width: 100, height: 20, type: 'platform' },
            { x: 1000, y: 720, width: 100, height: 20, type: 'platform' },
            { x: 1000, y: 690, width: 100, height: 20, type: 'platform' },

            // Lockers (hiding spots)
            { x: 1200, y: 600, width: 50, height: 80, type: 'hiding', name: 'locker' },
            { x: 1260, y: 600, width: 50, height: 80, type: 'hiding', name: 'locker' },
            { x: 1320, y: 600, width: 50, height: 80, type: 'hiding', name: 'locker' },

            // Computer desk
            { x: 1400, y: 600, width: 80, height: 50, type: 'interactive', name: 'computer', action: 'hack' },

            // Vending machines
            { x: 400, y: 750, width: 50, height: 100, type: 'interactive', name: 'vending_machine', action: 'use' },
            { x: 460, y: 750, width: 50, height: 100, type: 'interactive', name: 'vending_machine', action: 'use' },

            // Info kiosk
            { x: 800, y: 750, width: 60, height: 100, type: 'interactive', name: 'kiosk', action: 'read' },

            // Security office (elevated)
            { x: 1550, y: 600, width: 150, height: 80, type: 'furniture', name: 'security_desk' },

            // Doors
            { x: 1050, y: 750, width: 60, height: 100, type: 'door', locked: false, name: 'main_hall' },
            { x: 1700, y: 600, width: 60, height: 80, type: 'door', locked: true, name: 'staff_only', requiresPass: true },
            { x: 1800, y: 820, width: 60, height: 80, type: 'door', locked: true, name: 'records_entrance', requiresCode: true },

            // Decorative plants (small obstacles)
            { x: 380, y: 820, width: 30, height: 50, type: 'decoration' },
            { x: 780, y: 820, width: 30, height: 50, type: 'decoration' },

            // Right boundary wall
            { x: 1900, y: 500, width: 50, height: 400, type: 'wall' }
        ];

        // Create interactive objects
        this.createInteractiveObjects();
    }

    createInteractiveObjects() {
        this.interactiveObjects = [
            // Visitor pass printer (puzzle item)
            {
                x: 650,
                y: 765,
                width: 40,
                height: 30,
                type: 'printer',
                name: 'Visitor Pass Printer',
                description: 'A printer for creating visitor passes. Requires proper authorization.',
                action: () => this.attemptPrintPass(),
                interactable: true
            },
            // Computer with access code
            {
                x: 1400,
                y: 620,
                width: 60,
                height: 40,
                type: 'computer',
                name: 'Security Computer',
                description: 'A computer terminal. It might contain useful information.',
                action: () => this.hackComputer(),
                interactable: true
            },
            // File cabinet with evidence
            {
                x: 860,
                y: 810,
                width: 40,
                height: 60,
                type: 'cabinet',
                name: 'Filing Cabinet',
                description: 'A locked filing cabinet. Maybe there\'s something inside.',
                action: () => this.searchCabinet(),
                interactable: true,
                searched: false
            },
            // Vending machine (healing item)
            {
                x: 410,
                y: 760,
                width: 30,
                height: 80,
                type: 'vending',
                name: 'Vending Machine',
                description: 'Snacks and drinks. Might restore some health.',
                action: () => this.useVendingMachine(),
                interactable: true,
                used: false
            },
            // Info kiosk (hints)
            {
                x: 815,
                y: 760,
                width: 30,
                height: 80,
                type: 'kiosk',
                name: 'Hospital Directory',
                description: 'An interactive directory showing hospital locations.',
                action: () => this.readKiosk(),
                interactable: true
            }
        ];
    }

    toggleInventory() {
        const panel = document.getElementById('inventory-panel');
        if (panel.classList.contains('hidden')) {
            this.evidenceSystem.showInventory();
            this.state = GAME_STATES.INVENTORY;
        } else {
            this.evidenceSystem.hideInventory();
            this.state = GAME_STATES.PLAYING;
        }
    }

    togglePause() {
        if (this.state === GAME_STATES.PLAYING) {
            this.pauseGame();
        } else if (this.state === GAME_STATES.PAUSED) {
            this.resumeGame();
        }
    }

    pauseGame() {
        this.state = GAME_STATES.PAUSED;
        document.getElementById('pause-menu').classList.remove('hidden');
    }

    resumeGame() {
        this.state = GAME_STATES.PLAYING;
        document.getElementById('pause-menu').classList.add('hidden');
    }

    showSettings() {
        document.getElementById('settings-modal').classList.remove('hidden');
    }

    hideSettings() {
        document.getElementById('settings-modal').classList.add('hidden');
    }

    showCredits() {
        document.getElementById('credits-modal').classList.remove('hidden');
    }

    hideCredits() {
        document.getElementById('credits-modal').classList.add('hidden');
    }

    returnToMenu() {
        this.state = GAME_STATES.MAIN_MENU;
        document.getElementById('pause-menu').classList.add('hidden');
        document.getElementById('game-container').classList.add('hidden');
        this.showMainMenu();
    }

    showLoading() {
        document.getElementById('loading-screen').classList.remove('hidden');
        this.updateLoadingProgress(0);
    }

    hideLoading() {
        document.getElementById('loading-screen').classList.add('hidden');
    }

    updateLoadingProgress(percent) {
        document.getElementById('loading-progress').style.width = percent + '%';
        document.getElementById('loading-text').textContent =
            percent < 100 ? `Loading... ${percent}%` : 'Complete!';
    }

    showMainMenu() {
        document.getElementById('main-menu').classList.remove('hidden');
    }

    hideMainMenu() {
        document.getElementById('main-menu').classList.add('hidden');
    }

    startGameLoop() {
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    gameLoop(timestamp) {
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        if (this.state === GAME_STATES.PLAYING) {
            this.update(deltaTime);
            this.render();
        }

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    update(deltaTime) {
        // Cap delta time to prevent large jumps
        deltaTime = Math.min(deltaTime, 0.1);

        // Update particles
        this.updateParticles(deltaTime);

        // Update player (don't update position if hiding)
        if (this.player) {
            if (!this.playerHiding) {
                this.player.update(deltaTime);
                this.checkCollisions();
            } else {
                // Still update HUD while hiding
                this.player.updateHUD();
            }
        }

        // Update NPCs (they can't see hidden player)
        this.npcs.forEach(npc => {
            // If player is hiding, don't detect them
            const targetPlayer = this.playerHiding ? null : this.player;
            npc.update(deltaTime, targetPlayer, this.stealthSystem);
        });

        // Update stealth system
        if (!this.playerHiding) {
            this.stealthSystem.update(deltaTime, this.player, this.npcs);
        }

        // Check for nearby interactables
        if (!this.playerHiding) {
            this.checkInteractables();
        }

        // Camera shake
        if (this.cameraShake > 0) {
            this.cameraShake -= deltaTime * 5;
            if (this.cameraShake < 0) this.cameraShake = 0;
        }
    }

    checkCollisions() {
        // Reset ground state
        let onPlatform = false;

        // Simple ground collision
        const groundY = 852;
        if (this.player.y + this.player.height >= groundY) {
            this.player.y = groundY - this.player.height;
            this.player.velocityY = 0;
            this.player.onGround = true;
            onPlatform = true;
        }

        // Check collisions with level objects
        this.levelObjects.forEach(obj => {
            if (obj.type === 'wall' || obj.type === 'furniture' || obj.type === 'hiding') {
                this.resolveCollision(this.player, obj);
            } else if (obj.type === 'platform') {
                // One-way platform collision (can jump through from below)
                if (this.player.velocityY >= 0 && // Falling or stationary
                    this.player.y + this.player.height <= obj.y + 5 && // Above platform
                    this.player.x + this.player.width > obj.x &&
                    this.player.x < obj.x + obj.width) {

                    // Check if player is about to land on platform
                    const nextY = this.player.y + this.player.velocityY * 0.016;
                    if (nextY + this.player.height >= obj.y) {
                        this.player.y = obj.y - this.player.height;
                        this.player.velocityY = 0;
                        this.player.onGround = true;
                        onPlatform = true;
                    }
                }
            }
        });

        // If not on ground or platform, player is in air
        if (!onPlatform && this.player.y + this.player.height < groundY) {
            this.player.onGround = false;
        }
    }

    resolveCollision(player, obj) {
        // Simple AABB collision
        if (player.x < obj.x + obj.width &&
            player.x + player.width > obj.x &&
            player.y < obj.y + obj.height &&
            player.y + player.height > obj.y) {

            // Push player out
            const overlapLeft = (player.x + player.width) - obj.x;
            const overlapRight = (obj.x + obj.width) - player.x;
            const overlapTop = (player.y + player.height) - obj.y;
            const overlapBottom = (obj.y + obj.height) - player.y;

            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

            if (minOverlap === overlapLeft) {
                player.x = obj.x - player.width;
            } else if (minOverlap === overlapRight) {
                player.x = obj.x + obj.width;
            } else if (minOverlap === overlapTop) {
                player.y = obj.y - player.height;
                player.velocityY = 0;
                player.onGround = true;
            } else if (minOverlap === overlapBottom) {
                player.y = obj.y + obj.height;
                player.velocityY = 0;
            }
        }
    }

    checkInteractables() {
        this.nearbyInteractable = null;

        // Check evidence items
        this.evidenceItems.forEach(evidence => {
            if (!evidence.collected) {
                const distance = Math.hypot(
                    this.player.x + this.player.width/2 - evidence.x,
                    this.player.y + this.player.height/2 - evidence.y
                );

                if (distance < 50) {
                    this.nearbyInteractable = evidence;
                }
            }
        });

        // Check interactive objects
        this.interactiveObjects.forEach(obj => {
            const distance = Math.hypot(
                this.player.x + this.player.width/2 - (obj.x + obj.width/2),
                this.player.y + this.player.height/2 - (obj.y + obj.height/2)
            );

            if (distance < 60 && !this.nearbyInteractable) {
                this.nearbyInteractable = obj;
            }
        });

        // Check hiding spots
        this.levelObjects.forEach(obj => {
            if (obj.type === 'hiding') {
                const distance = Math.hypot(
                    this.player.x + this.player.width/2 - (obj.x + obj.width/2),
                    this.player.y + this.player.height/2 - (obj.y + obj.height/2)
                );

                if (distance < 60 && !this.nearbyInteractable) {
                    obj.type = 'hiding'; // Ensure type is set
                    obj.interactable = true;
                    this.nearbyInteractable = obj;
                }
            }
        });

        // Check NPCs
        this.npcs.forEach(npc => {
            const distance = Math.hypot(
                this.player.x - npc.x,
                this.player.y - npc.y
            );

            if (distance < 70 && npc.state !== NPC_STATES.CHASE) {
                if (!this.nearbyInteractable) {
                    npc.type = 'npc';
                    this.nearbyInteractable = npc;
                }
            }
        });

        // Show/hide interaction prompt
        if (this.nearbyInteractable) {
            this.showInteractionPrompt();
        } else {
            this.hideInteractionPrompt();
        }
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background with parallax
        this.renderer.drawBackground(this.cameraX);

        // Draw hospital floor
        this.renderer.drawHospitalFloor(0, 900, this.canvas.width * 2, 180);

        // Save context for camera transform
        this.ctx.save();

        // Apply camera shake
        const shakeX = this.cameraShake > 0 ? (Math.random() - 0.5) * this.cameraShake * 10 : 0;
        const shakeY = this.cameraShake > 0 ? (Math.random() - 0.5) * this.cameraShake * 10 : 0;
        this.ctx.translate(-this.cameraX + shakeX, shakeY);

        // Draw level objects
        this.levelObjects.forEach(obj => {
            if (obj.type === 'wall') {
                this.renderer.drawWall(obj.x, obj.y, obj.width, obj.height);
            } else if (obj.type === 'furniture') {
                this.renderer.drawFurniture(obj.x, obj.y, obj.width, obj.height, 'desk');
            } else if (obj.type === 'platform') {
                this.renderer.drawPlatform(obj.x, obj.y, obj.width, obj.height);
            } else if (obj.type === 'hiding') {
                this.renderer.drawHidingSpot(obj.x, obj.y, obj.width, obj.height, obj.name);
            } else if (obj.type === 'door') {
                this.renderer.drawDoor(obj.x, obj.y, obj.width, obj.height, obj.locked);
            } else if (obj.type === 'decoration') {
                this.renderer.drawDecoration(obj.x, obj.y, obj.width, obj.height);
            }
        });

        // Draw interactive objects
        this.interactiveObjects.forEach(obj => {
            this.renderer.drawInteractive(obj.x, obj.y, obj.width, obj.height, obj.type);
        });

        // Draw evidence items
        this.evidenceItems.forEach(evidence => {
            this.renderer.drawEvidence(evidence.x, evidence.y, evidence.collected);
        });

        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(
                particle.x - particle.size / 2,
                particle.y - particle.size / 2,
                particle.size,
                particle.size
            );
            this.ctx.restore();
        });

        // Draw NPCs
        this.npcs.forEach(npc => {
            npc.draw(this.renderer);
        });

        // Draw player (with transparency if hiding)
        if (this.player) {
            if (this.playerHiding) {
                this.ctx.save();
                this.ctx.globalAlpha = 0.3; // Semi-transparent when hiding
                this.player.draw(this.renderer);
                this.ctx.restore();

                // Draw "HIDING" text above player
                this.ctx.font = '12px Monaco';
                this.ctx.fillStyle = '#9ece6a';
                this.ctx.fillText('HIDING', this.player.x, this.player.y - 10);
            } else {
                this.player.draw(this.renderer);
            }
        }

        // Restore context
        this.ctx.restore();

        // Update camera to follow player
        if (this.player) {
            const targetCameraX = this.player.x - this.canvas.width / 2;
            this.cameraX += (targetCameraX - this.cameraX) * 0.1; // Smooth camera
            // Expand camera bounds for larger level
            this.cameraX = Math.max(0, Math.min(this.cameraX, 1950 - this.canvas.width));
        }
    }
}

// Start the game when page loads
window.addEventListener('load', () => {
    new Game();
});


