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

        // Camera offset for scrolling
        this.cameraX = 0;

        // Input state
        this.keys = {};

        // UI elements
        this.loadingScreen = document.getElementById('loading-screen');
        this.mainMenu = document.getElementById('main-menu');
        this.gameContainer = document.getElementById('game-container');
        this.pauseMenu = document.getElementById('pause-menu');

        // Initialize
        this.init();
    }

    async init() {
        // Simulate loading assets
        await this.loadAssets();

        // Set up canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Set up input handlers
        this.setupInputHandlers();

        // Set up menu handlers
        this.setupMenuHandlers();

        // Transition to main menu
        this.showMainMenu();

        // Start game loop
        this.gameLoop(0);
    }

    async loadAssets() {
        // Simulate asset loading with progress bar
        const loadingProgress = document.getElementById('loading-progress');
        const loadingText = document.getElementById('loading-text');

        const steps = [
            { text: 'Loading assets...', progress: 25 },
            { text: 'Loading level data...', progress: 50 },
            { text: 'Initializing game systems...', progress: 75 },
            { text: 'Ready!', progress: 100 }
        ];

        for (const step of steps) {
            loadingText.textContent = step.text;
            loadingProgress.style.width = step.progress + '%';
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    resizeCanvas() {
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;
    }

    setupInputHandlers() {
        // Keyboard input
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            // Handle pause
            if (CONFIG.KEYS.PAUSE.includes(e.key) && this.state === GAME_STATES.PLAYING) {
                this.togglePause();
                e.preventDefault();
            }

            // Handle inventory
            if (CONFIG.KEYS.INVENTORY.includes(e.key) && this.state === GAME_STATES.PLAYING) {
                this.toggleInventory();
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    setupMenuHandlers() {
        // New Game button
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.startNewGame();
        });

        // Settings button
        document.getElementById('settings-btn').addEventListener('click', () => {
            document.getElementById('settings-modal').classList.remove('hidden');
        });

        // Credits button
        document.getElementById('credits-btn').addEventListener('click', () => {
            document.getElementById('credits-modal').classList.remove('hidden');
        });

        // Close settings
        document.getElementById('close-settings').addEventListener('click', () => {
            document.getElementById('settings-modal').classList.add('hidden');
        });

        // Close credits
        document.getElementById('close-credits').addEventListener('click', () => {
            document.getElementById('credits-modal').classList.add('hidden');
        });

        // Resume button
        document.getElementById('resume-btn').addEventListener('click', () => {
            this.togglePause();
        });

        // Inventory button from pause menu
        document.getElementById('inventory-btn').addEventListener('click', () => {
            this.toggleInventory();
        });

        // Main menu button
        document.getElementById('menu-btn').addEventListener('click', () => {
            this.returnToMainMenu();
        });

        // Close inventory
        document.getElementById('close-inventory').addEventListener('click', () => {
            this.toggleInventory();
        });
    }

    showMainMenu() {
        this.loadingScreen.classList.add('hidden');
        this.mainMenu.classList.remove('hidden');
        this.gameContainer.classList.add('hidden');
        this.state = GAME_STATES.MAIN_MENU;
    }

    startNewGame() {
        // Hide main menu, show game
        this.mainMenu.classList.add('hidden');
        this.gameContainer.classList.remove('hidden');

        // Initialize player
        this.player = new Player(200, 800);

        // Initialize NPCs (example)
        this.npcs = [
            new NPC(600, 800, [
                { x: 600, y: 800 },
                { x: 900, y: 800 }
            ])
        ];

        // Start game
        this.state = GAME_STATES.PLAYING;
    }

    togglePause() {
        if (this.state === GAME_STATES.PLAYING) {
            this.pauseMenu.classList.remove('hidden');
            this.state = GAME_STATES.PAUSED;
        } else if (this.state === GAME_STATES.PAUSED) {
            this.pauseMenu.classList.add('hidden');
            this.state = GAME_STATES.PLAYING;
        }
    }

    toggleInventory() {
        const inventoryPanel = document.getElementById('inventory-panel');
        if (inventoryPanel.classList.contains('hidden')) {
            inventoryPanel.classList.remove('hidden');
            this.state = GAME_STATES.INVENTORY;
        } else {
            inventoryPanel.classList.add('hidden');
            this.state = GAME_STATES.PLAYING;
        }
    }

    returnToMainMenu() {
        this.gameContainer.classList.add('hidden');
        this.pauseMenu.classList.add('hidden');
        this.showMainMenu();

        // Reset game state
        this.player = null;
        this.npcs = [];
    }

    update(deltaTime) {
        if (this.state !== GAME_STATES.PLAYING) return;

        // Update player
        if (this.player) {
            this.player.update(deltaTime, this.keys);

            // Update HUD
            document.getElementById('health-fill').style.width = this.player.health + '%';
            document.getElementById('stamina-fill').style.width = this.player.stamina + '%';
        }

        // Update NPCs
        this.npcs.forEach(npc => {
            npc.update(deltaTime);

            // Check detection with player
            if (this.player) {
                const detected = this.stealthSystem.checkDetection(
                    this.player,
                    npc,
                    this.player.state === PLAYER_STATES.CROUCHING
                );

                if (detected) {
                    npc.state = NPC_STATES.ALERT;
                    this.stealthSystem.increaseSuspicion(10);
                }
            }
        });

        // Update stealth system
        this.stealthSystem.update(deltaTime);
        document.getElementById('suspicion-fill').style.width =
            this.stealthSystem.suspicion + '%';

        // Check game over condition
        if (this.stealthSystem.suspicion >= CONFIG.STEALTH.DETECTION_THRESHOLD) {
            // Game over logic
            console.log('Detected! Game Over');
        }
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.state !== GAME_STATES.PLAYING) return;

        // Draw background with parallax
        this.renderer.drawBackground(this.cameraX);

        // Draw hospital floor
        this.renderer.drawHospitalFloor(0, 900, this.canvas.width, 200);

        // Draw walls/environment (example)
        this.renderer.drawWall(50, 700, 100, 200);
        this.renderer.drawWall(this.canvas.width - 150, 700, 100, 200);

        // Draw evidence items (example)
        this.renderer.drawEvidence(300, 870, false);
        this.renderer.drawEvidence(600, 870, false);

        // Save context for camera transform
        this.ctx.save();
        this.ctx.translate(-this.cameraX, 0);

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
            this.cameraX = Math.max(0, this.cameraX); // Don't go past left edge
        }
    }

    gameLoop(currentTime) {
        // Calculate delta time
        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;

        // Update and render
        this.update(deltaTime);
        this.render();

        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
