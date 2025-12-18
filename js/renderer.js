// Pixel Art Renderer for SIGNAL
class PixelRenderer {
    constructor(ctx, assetManager = null) {
        this.ctx = ctx;
        this.assetManager = assetManager;
        this.colors = {
            player: '#bb9af7',
            playerOutline: '#7aa2f7',
            npcFriendly: '#9ece6a',
            npcHostile: '#f7768e',
            npcNeutral: '#e0af68',
            floor: '#2d3250',
            wall: '#414868',
            background: '#1a1d29',
            accent: '#7aa2f7'
        };
    }

    // Set asset manager (called after assets load)
    setAssetManager(assetManager) {
        this.assetManager = assetManager;
    }

    // Draw pixel-perfect character (with image support)
    drawCharacter(x, y, width, height, color, facing = 'right', characterName = null) {
        const ctx = this.ctx;

        // Try to use image if available
        if (this.assetManager && characterName) {
            const sprite = this.assetManager.getCharacterSprite(characterName);
            if (sprite) {
                ctx.save();
                if (facing === 'left') {
                    ctx.scale(-1, 1);
                    ctx.drawImage(sprite, -x - width, y, width, height);
                } else {
                    ctx.drawImage(sprite, x, y, width, height);
                }
                ctx.restore();
                return;
            }
        }

        // Fallback to pixel art
        // Body
        ctx.fillStyle = color;
        ctx.fillRect(x + 8, y + 16, width - 16, height - 16);

        // Head
        ctx.fillRect(x + 10, y + 4, width - 20, 14);

        // Eyes
        ctx.fillStyle = '#1a1d29';
        if (facing === 'right') {
            ctx.fillRect(x + width - 14, y + 8, 3, 3);
        } else {
            ctx.fillRect(x + 11, y + 8, 3, 3);
        }

        // Legs
        ctx.fillStyle = color;
        ctx.fillRect(x + 10, y + height - 12, 5, 12);
        ctx.fillRect(x + width - 15, y + height - 12, 5, 12);

        // Arms
        ctx.fillRect(x + 6, y + 20, 4, 12);
        ctx.fillRect(x + width - 10, y + 20, 4, 12);

        // Outline
        ctx.strokeStyle = this.colors.playerOutline;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 8, y + 4, width - 16, height - 4);
    }
    
    // Draw detection cone
    drawDetectionCone(x, y, range, angle, facing, detected = false) {
        const ctx = this.ctx;
        
        ctx.save();
        ctx.strokeStyle = detected ? 
            'rgba(247, 118, 142, 0.5)' : 
            'rgba(122, 162, 247, 0.2)';
        ctx.fillStyle = detected ? 
            'rgba(247, 118, 142, 0.1)' : 
            'rgba(122, 162, 247, 0.05)';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        const facingAngle = facing === 'right' ? 0 : 180;
        const startAngle = (facingAngle - angle/2) * Math.PI / 180;
        const endAngle = (facingAngle + angle/2) * Math.PI / 180;
        
        ctx.arc(x, y, range, startAngle, endAngle);
        ctx.lineTo(x, y);
        ctx.closePath();
        
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    
    // Draw hospital environment
    drawHospitalFloor(x, y, width, height) {
        const ctx = this.ctx;
        const tileSize = 32;
        
        // Floor tiles with pattern
        ctx.fillStyle = this.colors.floor;
        ctx.fillRect(x, y, width, height);
        
        // Tile pattern
        ctx.strokeStyle = 'rgba(122, 162, 247, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = x; i < x + width; i += tileSize) {
            for (let j = y; j < y + height; j += tileSize) {
                ctx.strokeRect(i, j, tileSize, tileSize);
            }
        }
    }
    
    // Draw hospital walls
    drawWall(x, y, width, height) {
        const ctx = this.ctx;
        
        // Main wall
        ctx.fillStyle = this.colors.wall;
        ctx.fillRect(x, y, width, height);
        
        // Border
        ctx.strokeStyle = 'rgba(122, 162, 247, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        
        // Details
        ctx.fillStyle = 'rgba(122, 162, 247, 0.1)';
        ctx.fillRect(x + 4, y + 4, width - 8, height - 8);
    }
    
    // Draw door
    drawDoor(x, y, width, height, locked = false) {
        const ctx = this.ctx;
        
        // Door frame
        ctx.fillStyle = this.colors.wall;
        ctx.fillRect(x, y, width, height);
        
        // Door panel
        ctx.fillStyle = locked ? '#414868' : '#9ece6a';
        ctx.fillRect(x + 4, y + 4, width - 8, height - 8);
        
        // Door handle
        ctx.fillStyle = '#7aa2f7';
        ctx.fillRect(x + width - 12, y + height/2 - 2, 6, 4);
        
        // Lock indicator
        if (locked) {
            ctx.fillStyle = '#f7768e';
            ctx.fillRect(x + 8, y + 8, 4, 6);
        }
    }
    
    // Draw furniture (generic) with image support
    drawFurniture(x, y, width, height, type = 'desk') {
        const ctx = this.ctx;

        // Try to use object sprite
        const sprite = this.assetManager?.getObject(type);
        if (sprite) {
            ctx.drawImage(sprite, x, y, width, height);
            return;
        }

        // Fallback to enhanced pixel art
        ctx.fillStyle = this.colors.wall;
        ctx.fillRect(x, y, width, height);

        ctx.strokeStyle = this.colors.accent;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Enhanced details based on type
        if (type === 'desk') {
            // Desktop surface
            ctx.fillStyle = 'rgba(122, 162, 247, 0.2)';
            ctx.fillRect(x + 4, y + 4, width - 8, height/2 - 4);
            // Drawer handles
            ctx.fillStyle = this.colors.accent;
            ctx.fillRect(x + width/2 - 8, y + height * 0.7, 16, 4);
        } else if (type === 'bench') {
            // Seat surface
            ctx.fillStyle = 'rgba(158, 206, 106, 0.2)';
            ctx.fillRect(x + 2, y + 2, width - 4, 10);
            // Legs
            ctx.fillStyle = this.colors.wall;
            ctx.fillRect(x + 5, y + 12, 4, height - 14);
            ctx.fillRect(x + width - 9, y + 12, 4, height - 14);
        }
    }
    
    // Draw evidence item with glow
    drawEvidence(x, y, collected = false) {
        const ctx = this.ctx;
        
        if (collected) return;
        
        // Glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
        gradient.addColorStop(0, 'rgba(187, 154, 247, 0.4)');
        gradient.addColorStop(1, 'rgba(187, 154, 247, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x - 20, y - 20, 40, 40);
        
        // Evidence icon
        ctx.fillStyle = '#bb9af7';
        ctx.fillRect(x - 6, y - 8, 12, 16);
        
        ctx.strokeStyle = '#7aa2f7';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 6, y - 8, 12, 16);
        
        // Shine effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(x - 4, y - 6, 4, 8);
    }
    
    // Draw enhanced background layers (parallax effect with images)
    drawBackground(offsetX = 0) {
        const ctx = this.ctx;
        const canvas = ctx.canvas;

        // Sky/Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1a1d29');
        gradient.addColorStop(0.5, '#1f2335');
        gradient.addColorStop(1, '#24283b');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Far background clouds (slowest parallax)
        const cloudsBg = this.assetManager?.getBackground('clouds');
        if (cloudsBg) {
            const cloudOffset = (offsetX * 0.1) % canvas.width;
            ctx.globalAlpha = 0.3;
            ctx.drawImage(cloudsBg, -cloudOffset, 20, canvas.width, 150);
            ctx.drawImage(cloudsBg, canvas.width - cloudOffset, 20, canvas.width, 150);
            ctx.globalAlpha = 1.0;
        } else {
            // Fallback clouds
            ctx.fillStyle = 'rgba(122, 162, 247, 0.05)';
            for (let i = 0; i < 8; i++) {
                const x = (i * 300 - offsetX * 0.1) % (canvas.width + 300);
                ctx.beginPath();
                ctx.ellipse(x, 60 + i * 20, 60, 25, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // City skyline / hospital exterior (medium parallax)
        const exterior = this.assetManager?.getBackground('hospital_exterior');
        if (exterior) {
            const extOffset = (offsetX * 0.2) % (canvas.width * 1.5);
            ctx.globalAlpha = 0.6;
            ctx.drawImage(exterior, -extOffset, canvas.height - 600, canvas.width * 1.5, 400);
            ctx.globalAlpha = 1.0;
        } else {
            // Fallback building silhouettes
            ctx.fillStyle = 'rgba(65, 72, 104, 0.3)';
            for (let i = 0; i < 6; i++) {
                const x = (i * 250 - offsetX * 0.2) % (canvas.width + 250);
                const height = 200 + Math.random() * 150;
                ctx.fillRect(x, canvas.height - height - 400, 150, height);
            }
        }

        // Hospital windows (faster parallax)
        const windows = this.assetManager?.getBackground('windows');
        if (windows) {
            const winOffset = (offsetX * 0.4) % (canvas.width + 400);
            ctx.globalAlpha = 0.15;
            ctx.drawImage(windows, -winOffset, 80, canvas.width + 400, 300);
            ctx.globalAlpha = 1.0;
        } else {
            // Fallback windows with detail
            ctx.fillStyle = 'rgba(122, 162, 247, 0.08)';
            ctx.strokeStyle = 'rgba(122, 162, 247, 0.2)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 12; i++) {
                const x = (i * 180 - offsetX * 0.4) % (canvas.width + 180);
                // Window frame
                ctx.fillRect(x, 100, 100, 140);
                ctx.strokeRect(x, 100, 100, 140);
                // Window panes
                ctx.strokeRect(x + 10, 110, 80, 60);
                ctx.strokeRect(x + 10, 180, 80, 50);
                // Window reflection
                ctx.fillStyle = 'rgba(187, 154, 247, 0.05)';
                ctx.fillRect(x + 15, 115, 30, 45);
                ctx.fillStyle = 'rgba(122, 162, 247, 0.08)';
            }
        }

        // Foreground atmospheric effects
        this.drawAtmosphericEffects(ctx, canvas, offsetX);
    }

    // Draw atmospheric effects (dust particles, light rays)
    drawAtmosphericEffects(ctx, canvas, offsetX) {
        // Floating dust particles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        for (let i = 0; i < 20; i++) {
            const x = (i * 100 + Math.sin(Date.now() / 1000 + i) * 20 - offsetX * 0.5) % canvas.width;
            const y = (i * 50 + Math.cos(Date.now() / 800 + i) * 30) % canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, 1 + Math.random(), 0, Math.PI * 2);
            ctx.fill();
        }

        // Subtle vignette effect
        const vignette = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, canvas.width * 0.3,
            canvas.width / 2, canvas.height / 2, canvas.width * 0.7
        );
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw platform
    drawPlatform(x, y, width, height) {
        const ctx = this.ctx;

        // Platform surface
        ctx.fillStyle = this.colors.wall;
        ctx.fillRect(x, y, width, height);

        // Platform edge highlight
        ctx.strokeStyle = this.colors.accent;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, 4);

        // Pattern
        ctx.fillStyle = 'rgba(122, 162, 247, 0.1)';
        for (let i = 0; i < width; i += 10) {
            ctx.fillRect(x + i, y + 2, 2, height - 4);
        }
    }

    // Draw hiding spot
    drawHidingSpot(x, y, width, height, name) {
        const ctx = this.ctx;

        if (name === 'locker') {
            // Locker
            ctx.fillStyle = this.colors.wall;
            ctx.fillRect(x, y, width, height);

            ctx.strokeStyle = this.colors.accent;
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);

            // Locker door
            ctx.strokeRect(x + 2, y + 2, width - 4, height - 4);

            // Handle
            ctx.fillStyle = '#7aa2f7';
            ctx.fillRect(x + width - 8, y + height/2 - 3, 4, 6);
        } else {
            // Generic hiding spot
            ctx.fillStyle = this.colors.wall;
            ctx.fillRect(x, y, width, height);

            ctx.strokeStyle = '#9ece6a';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
        }
    }

    // Draw interactive object
    drawInteractive(x, y, width, height, type) {
        const ctx = this.ctx;

        // Glow effect
        const gradient = ctx.createRadialGradient(
            x + width/2, y + height/2, 0,
            x + width/2, y + height/2, Math.max(width, height)
        );
        gradient.addColorStop(0, 'rgba(122, 162, 247, 0.3)');
        gradient.addColorStop(1, 'rgba(122, 162, 247, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x - 10, y - 10, width + 20, height + 20);

        // Main object
        ctx.fillStyle = this.colors.wall;
        ctx.fillRect(x, y, width, height);

        ctx.strokeStyle = this.colors.accent;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Type-specific details
        if (type === 'computer') {
            // Screen
            ctx.fillStyle = '#7aa2f7';
            ctx.fillRect(x + 4, y + 4, width - 8, height - 12);

            // Keyboard
            ctx.fillStyle = '#414868';
            ctx.fillRect(x + 4, y + height - 6, width - 8, 4);
        } else if (type === 'vending') {
            // Items inside
            ctx.fillStyle = '#f7768e';
            ctx.fillRect(x + 4, y + 8, 6, 6);
            ctx.fillStyle = '#9ece6a';
            ctx.fillRect(x + 12, y + 8, 6, 6);
            ctx.fillStyle = '#e0af68';
            ctx.fillRect(x + 20, y + 8, 6, 6);
        } else if (type === 'printer') {
            // Paper tray
            ctx.fillStyle = '#e0e0e0';
            ctx.fillRect(x + 4, y + height/2, width - 8, 4);
        } else if (type === 'cabinet') {
            // Drawers
            for (let i = 0; i < 3; i++) {
                ctx.strokeRect(x + 2, y + 2 + i * (height/3), width - 4, height/3 - 2);
            }
        } else if (type === 'kiosk') {
            // Screen
            ctx.fillStyle = '#7aa2f7';
            ctx.fillRect(x + 6, y + 6, width - 12, height - 12);
        }
    }

    // Draw decoration
    drawDecoration(x, y, width, height) {
        const ctx = this.ctx;

        // Plant pot
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(x, y + height * 0.6, width, height * 0.4);

        // Plant
        ctx.fillStyle = '#9ece6a';
        ctx.fillRect(x + width * 0.2, y, width * 0.2, height * 0.7);
        ctx.fillRect(x + width * 0.5, y, width * 0.2, height * 0.7);
    }
}


