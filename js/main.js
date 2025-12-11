class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = GAME_STATES.LOADING;
        this.lastTime = 0;

        // Initialize pixel renderer
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

        // Interaction
        this.nearbyInteractable = null;

        // Camera offset for scrolling
        this.cameraX = 0;
        this.cameraY = 0;

        // Dialogue
        this.dialogues = null;
        this.currentDialogue = null;

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
            // Load level data
            const levelResponse = await fetch('assets/data/level1.json');
            this.levelData = await levelResponse.json();

            // Load dialogues
            const dialogueResponse = await fetch('assets/data/dialogues.json');
            this.dialogues = await dialogueResponse.json();

            console.log('Game data loaded successfully');
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
                if (obj.id === 'find_map' && this.evidenceSystem.hasItem('Hospital Map')) {
                    obj.completed = true;
                    console.log('Objective completed:', obj.description);
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
            // Reception desk
            { x: 550, y: 750, width: 200, height: 100, type: 'furniture' },
            // Waiting area benches
            { x: 200, y: 800, width: 80, height: 40, type: 'furniture' },
            { x: 350, y: 800, width: 80, height: 40, type: 'furniture' },
            // Walls
            { x: 0, y: 700, width: 50, height: 200, type: 'wall' },
            { x: this.canvas.width - 50, y: 700, width: 50, height: 200, type: 'wall' },
            // Doors
            { x: 900, y: 700, width: 60, height: 150, type: 'door', locked: false },
            { x: 1200, y: 700, width: 60, height: 150, type: 'door', locked: true }
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

        // Update player
        if (this.player) {
            this.player.update(deltaTime);
            this.checkCollisions();
        }

        // Update NPCs
        this.npcs.forEach(npc => {
            npc.update(deltaTime, this.player, this.stealthSystem);
        });

        // Update stealth system
        this.stealthSystem.update(deltaTime, this.player, this.npcs);

        // Check for nearby interactables
        this.checkInteractables();
    }

    checkCollisions() {
        // Simple ground collision
        const groundY = 852;
        if (this.player.y + this.player.height >= groundY) {
            this.player.y = groundY - this.player.height;
            this.player.velocityY = 0;
            this.player.onGround = true;
        }

        // Check collisions with level objects
        this.levelObjects.forEach(obj => {
            if (obj.type === 'wall' || obj.type === 'furniture') {
                this.resolveCollision(this.player, obj);
            }
        });
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
                    this.player.x - evidence.x,
                    this.player.y - evidence.y
                );

                if (distance < 50) {
                    this.nearbyInteractable = evidence;
                    this.showInteractionPrompt();
                }
            }
        });

        // Check NPCs
        this.npcs.forEach(npc => {
            const distance = Math.hypot(
                this.player.x - npc.x,
                this.player.y - npc.y
            );

            if (distance < 60 && npc.state !== NPC_STATES.CHASE) {
                if (!this.nearbyInteractable) {
                    npc.type = 'npc';
                    this.nearbyInteractable = npc;
                    this.showInteractionPrompt();
                }
            }
        });

        if (!this.nearbyInteractable) {
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
        this.ctx.translate(-this.cameraX, 0);

        // Draw level objects
        this.levelObjects.forEach(obj => {
            if (obj.type === 'wall') {
                this.renderer.drawWall(obj.x, obj.y, obj.width, obj.height);
            } else if (obj.type === 'furniture') {
                this.renderer.drawFurniture(obj.x, obj.y, obj.width, obj.height, 'desk');
            } else if (obj.type === 'door') {
                this.renderer.drawDoor(obj.x, obj.y, obj.width, obj.height, obj.locked);
            }
        });

        // Draw evidence items
        this.evidenceItems.forEach(evidence => {
            this.renderer.drawEvidence(evidence.x, evidence.y, evidence.collected);
        });

        // Draw NPCs
        this.npcs.forEach(npc => {
            npc.draw(this.renderer);
        });

        // Draw player
        if (this.player) {
            this.player.draw(this.renderer);
        }

        // Restore context
        this.ctx.restore();

        // Update camera to follow player
        if (this.player) {
            const targetCameraX = this.player.x - this.canvas.width / 2;
            this.cameraX += (targetCameraX - this.cameraX) * 0.1; // Smooth camera
            this.cameraX = Math.max(0, Math.min(this.cameraX, this.canvas.width)); // Clamp camera
        }
    }
}

// Start the game when page loads
window.addEventListener('load', () => {
    new Game();
});


