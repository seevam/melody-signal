// Level System for SIGNAL
class Level {
    constructor(levelData) {
        this.data = levelData || this.createDefaultLevel();
        this.width = this.data.width;
        this.height = this.data.height;
        this.rooms = this.data.rooms;
        this.walls = this.data.walls;
        this.doors = this.data.doors;
        this.furniture = this.data.furniture;
        this.evidence = this.data.evidence;
        this.npcs = this.data.npcs;
        this.spawnPoint = this.data.spawnPoint;
    }

    createDefaultLevel() {
        // Saint Cross Hospital - Main Floor
        return {
            name: "Saint Cross Hospital - Entrance",
            width: 3000,
            height: 1080,
            spawnPoint: { x: 200, y: 800 },

            // Floor areas (for visual reference)
            floors: [
                { x: 0, y: 900, width: 3000, height: 180 }
            ],

            // Walls define collision boundaries and visual walls
            walls: [
                // Entrance hallway walls
                { x: 0, y: 600, width: 50, height: 300 },
                { x: 0, y: 600, width: 800, height: 50 },

                // Reception area
                { x: 750, y: 600, width: 50, height: 150 },
                { x: 750, y: 850, width: 50, height: 50 },

                // Corridor walls
                { x: 1200, y: 600, width: 50, height: 300 },
                { x: 1600, y: 600, width: 50, height: 300 },
                { x: 2000, y: 600, width: 50, height: 300 },

                // Back wall
                { x: 0, y: 600, width: 3000, height: 50 },

                // Room dividers
                { x: 400, y: 600, width: 20, height: 200 },
                { x: 1800, y: 600, width: 20, height: 200 },

                // End wall
                { x: 2950, y: 600, width: 50, height: 300 },
            ],

            // Doors
            doors: [
                { x: 400, y: 820, width: 80, height: 80, locked: false, target: 'office1' },
                { x: 900, y: 820, width: 80, height: 80, locked: true, target: 'morgue' },
                { x: 1300, y: 820, width: 80, height: 80, locked: false, target: 'patientRoom1' },
                { x: 1700, y: 820, width: 80, height: 80, locked: true, target: 'lab' },
                { x: 2200, y: 820, width: 80, height: 80, locked: false, target: 'storage' },
            ],

            // Furniture and obstacles
            furniture: [
                // Reception desk
                { x: 150, y: 750, width: 200, height: 80, type: 'desk' },

                // Waiting room chairs
                { x: 500, y: 750, width: 60, height: 60, type: 'chair' },
                { x: 580, y: 750, width: 60, height: 60, type: 'chair' },
                { x: 500, y: 830, width: 60, height: 60, type: 'chair' },
                { x: 580, y: 830, width: 60, height: 60, type: 'chair' },

                // Hospital beds
                { x: 1050, y: 750, width: 100, height: 60, type: 'bed' },
                { x: 1450, y: 750, width: 100, height: 60, type: 'bed' },

                // Medical carts
                { x: 1050, y: 850, width: 60, height: 40, type: 'cart' },
                { x: 1850, y: 780, width: 60, height: 40, type: 'cart' },

                // Cabinets
                { x: 2400, y: 680, width: 80, height: 100, type: 'cabinet' },
                { x: 2500, y: 680, width: 80, height: 100, type: 'cabinet' },

                // Tables
                { x: 2700, y: 800, width: 120, height: 60, type: 'table' },
            ],

            // Evidence locations
            evidence: [
                { x: 320, y: 870, width: 20, height: 20, collected: false, type: 'document', id: 'patient_file_1' },
                { x: 750, y: 870, width: 20, height: 20, collected: false, type: 'photo', id: 'incident_photo_1' },
                { x: 1200, y: 870, width: 20, height: 20, collected: false, type: 'keycard', id: 'blue_keycard' },
                { x: 1900, y: 870, width: 20, height: 20, collected: false, type: 'note', id: 'doctors_note_1' },
                { x: 2600, y: 870, width: 20, height: 20, collected: false, type: 'document', id: 'medical_record' },
            ],

            // NPC spawn points and patrol routes
            npcs: [
                {
                    x: 800,
                    y: 800,
                    type: 'guard',
                    patrolRoute: [
                        { x: 800, y: 800 },
                        { x: 1100, y: 800 },
                        { x: 1100, y: 800 },
                        { x: 800, y: 800 }
                    ]
                },
                {
                    x: 1500,
                    y: 800,
                    type: 'nurse',
                    patrolRoute: [
                        { x: 1500, y: 800 },
                        { x: 1900, y: 800 },
                        { x: 1900, y: 800 },
                        { x: 1500, y: 800 }
                    ]
                },
                {
                    x: 2400,
                    y: 800,
                    type: 'doctor',
                    patrolRoute: [
                        { x: 2400, y: 800 },
                        { x: 2700, y: 800 },
                        { x: 2700, y: 800 },
                        { x: 2400, y: 800 }
                    ]
                }
            ],

            // Decorative elements
            decorations: [
                // Wall signs
                { x: 100, y: 650, type: 'sign', text: 'RECEPTION' },
                { x: 900, y: 650, type: 'sign', text: 'MORGUE' },
                { x: 1300, y: 650, type: 'sign', text: 'PATIENT ROOMS' },
                { x: 1700, y: 650, type: 'sign', text: 'LABORATORY' },
                { x: 2200, y: 650, type: 'sign', text: 'STORAGE' },

                // Blood stains (horror atmosphere)
                { x: 950, y: 880, type: 'bloodstain' },
                { x: 1650, y: 870, type: 'bloodstain' },

                // Flickering lights
                { x: 600, y: 620, type: 'light' },
                { x: 1000, y: 620, type: 'light' },
                { x: 1400, y: 620, type: 'light' },
                { x: 1800, y: 620, type: 'light' },
                { x: 2200, y: 620, type: 'light' },
                { x: 2600, y: 620, type: 'light' },
            ]
        };
    }

    // Check collision with walls and furniture
    checkCollision(x, y, width, height) {
        // Check walls
        for (const wall of this.walls) {
            if (this.rectIntersect(x, y, width, height, wall.x, wall.y, wall.width, wall.height)) {
                return true;
            }
        }

        // Check furniture
        for (const furniture of this.furniture) {
            if (this.rectIntersect(x, y, width, height, furniture.x, furniture.y, furniture.width, furniture.height)) {
                return true;
            }
        }

        return false;
    }

    rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 &&
               x1 + w1 > x2 &&
               y1 < y2 + h2 &&
               y1 + h1 > y2;
    }

    // Check if player is near evidence
    getNearbyEvidence(x, y, radius = 50) {
        for (const evidence of this.evidence) {
            if (!evidence.collected) {
                const dx = evidence.x - x;
                const dy = evidence.y - y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < radius) {
                    return evidence;
                }
            }
        }
        return null;
    }

    // Check if player is near door
    getNearbyDoor(x, y, radius = 60) {
        for (const door of this.doors) {
            const doorCenterX = door.x + door.width / 2;
            const doorCenterY = door.y + door.height / 2;

            const dx = doorCenterX - x;
            const dy = doorCenterY - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < radius) {
                return door;
            }
        }
        return null;
    }

    // Collect evidence
    collectEvidence(evidence) {
        evidence.collected = true;
    }

    // Draw the level
    draw(renderer, cameraX) {
        const ctx = renderer.ctx;

        // Draw floor
        renderer.drawHospitalFloor(0, 900, this.width, 180);

        // Draw decorations first (behind everything)
        this.drawDecorations(renderer, cameraX);

        // Draw walls
        this.walls.forEach(wall => {
            renderer.drawWall(wall.x, wall.y, wall.width, wall.height);
        });

        // Draw furniture
        this.furniture.forEach(item => {
            this.drawFurniture(renderer, item);
        });

        // Draw doors
        this.doors.forEach(door => {
            renderer.drawDoor(door.x, door.y, door.width, door.height, door.locked);
        });

        // Draw evidence
        this.evidence.forEach(evidence => {
            renderer.drawEvidence(evidence.x, evidence.y, evidence.collected);
        });
    }

    drawDecorations(renderer, cameraX) {
        const ctx = renderer.ctx;

        this.data.decorations.forEach(deco => {
            switch(deco.type) {
                case 'sign':
                    this.drawSign(ctx, deco.x, deco.y, deco.text);
                    break;
                case 'bloodstain':
                    this.drawBloodstain(ctx, deco.x, deco.y);
                    break;
                case 'light':
                    this.drawLight(ctx, deco.x, deco.y);
                    break;
            }
        });
    }

    drawSign(ctx, x, y, text) {
        // Sign background
        ctx.fillStyle = '#2d3250';
        ctx.fillRect(x, y, 150, 40);

        // Border
        ctx.strokeStyle = '#7aa2f7';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, 150, 40);

        // Text
        ctx.fillStyle = '#bb9af7';
        ctx.font = '12px Monaco, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(text, x + 75, y + 25);
    }

    drawBloodstain(ctx, x, y) {
        // Dark red bloodstain
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
        gradient.addColorStop(0, 'rgba(139, 0, 0, 0.6)');
        gradient.addColorStop(1, 'rgba(139, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();
    }

    drawLight(ctx, x, y) {
        // Ceiling light fixture
        ctx.fillStyle = '#414868';
        ctx.fillRect(x - 15, y, 30, 10);

        // Light glow
        const gradient = ctx.createRadialGradient(x, y + 10, 0, x, y + 10, 80);
        gradient.addColorStop(0, 'rgba(187, 154, 247, 0.15)');
        gradient.addColorStop(1, 'rgba(187, 154, 247, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y + 10, 80, 0, Math.PI * 2);
        ctx.fill();
    }

    drawFurniture(renderer, item) {
        const ctx = renderer.ctx;

        switch(item.type) {
            case 'desk':
                ctx.fillStyle = '#414868';
                ctx.fillRect(item.x, item.y, item.width, item.height);
                ctx.strokeStyle = '#7aa2f7';
                ctx.lineWidth = 2;
                ctx.strokeRect(item.x, item.y, item.width, item.height);
                // Desk surface
                ctx.fillStyle = '#2d3250';
                ctx.fillRect(item.x + 4, item.y + 4, item.width - 8, 20);
                break;

            case 'chair':
                ctx.fillStyle = '#9ece6a';
                ctx.fillRect(item.x + 10, item.y + 10, item.width - 20, item.height - 10);
                // Chair back
                ctx.fillRect(item.x + 10, item.y, item.width - 20, 15);
                ctx.strokeStyle = '#7aa2f7';
                ctx.lineWidth = 1;
                ctx.strokeRect(item.x + 10, item.y, item.width - 20, item.height);
                break;

            case 'bed':
                ctx.fillStyle = '#9ece6a';
                ctx.fillRect(item.x, item.y, item.width, item.height);
                // Pillow
                ctx.fillStyle = '#7aa2f7';
                ctx.fillRect(item.x + 5, item.y + 5, 25, 20);
                // Blanket
                ctx.fillStyle = '#414868';
                ctx.fillRect(item.x + 35, item.y + 10, item.width - 45, item.height - 20);
                ctx.strokeStyle = '#7aa2f7';
                ctx.lineWidth = 2;
                ctx.strokeRect(item.x, item.y, item.width, item.height);
                break;

            case 'cart':
                ctx.fillStyle = '#e0af68';
                ctx.fillRect(item.x, item.y, item.width, item.height);
                // Wheels
                ctx.fillStyle = '#1a1d29';
                ctx.fillRect(item.x + 5, item.y + item.height - 5, 8, 5);
                ctx.fillRect(item.x + item.width - 13, item.y + item.height - 5, 8, 5);
                ctx.strokeStyle = '#7aa2f7';
                ctx.lineWidth = 1;
                ctx.strokeRect(item.x, item.y, item.width, item.height);
                break;

            case 'cabinet':
                ctx.fillStyle = '#414868';
                ctx.fillRect(item.x, item.y, item.width, item.height);
                // Cabinet doors
                ctx.strokeStyle = '#7aa2f7';
                ctx.lineWidth = 2;
                ctx.strokeRect(item.x, item.y, item.width / 2, item.height);
                ctx.strokeRect(item.x + item.width / 2, item.y, item.width / 2, item.height);
                // Handles
                ctx.fillStyle = '#bb9af7';
                ctx.fillRect(item.x + item.width / 4 - 2, item.y + item.height / 2 - 3, 4, 6);
                ctx.fillRect(item.x + 3 * item.width / 4 - 2, item.y + item.height / 2 - 3, 4, 6);
                break;

            case 'table':
                ctx.fillStyle = '#414868';
                ctx.fillRect(item.x, item.y, item.width, item.height);
                // Table top detail
                ctx.fillStyle = '#2d3250';
                ctx.fillRect(item.x + 4, item.y + 4, item.width - 8, 12);
                ctx.strokeStyle = '#7aa2f7';
                ctx.lineWidth = 2;
                ctx.strokeRect(item.x, item.y, item.width, item.height);
                break;

            default:
                renderer.drawFurniture(item.x, item.y, item.width, item.height, item.type);
        }
    }
}
