// Asset Manager for SIGNAL
class AssetManager {
    constructor() {
        this.images = new Map();
        this.loaded = new Map();
        this.loadProgress = 0;
        this.totalAssets = 0;

        // Define all asset paths
        this.assetPaths = {
            // Character sprites (32x48 or 48x48)
            characters: {
                finn: 'assets/sprites/characters/finn.png',
                fiona: 'assets/sprites/characters/fiona.png',
                sarah: 'assets/sprites/characters/sarah.png',
                marcus: 'assets/sprites/characters/marcus.png',
                william: 'assets/sprites/characters/william.png',
                drAlistair: 'assets/sprites/characters/dr_alistair.png',
                guard: 'assets/sprites/characters/guard.png',
                patient: 'assets/sprites/characters/patient.png'
            },

            // Background layers
            backgrounds: {
                reception: 'assets/backgrounds/reception_bg.png',
                hospital_exterior: 'assets/backgrounds/hospital_exterior.png',
                windows: 'assets/backgrounds/windows_layer.png',
                clouds: 'assets/backgrounds/clouds.png'
            },

            // Environmental objects
            objects: {
                desk: 'assets/objects/desk.png',
                bench: 'assets/objects/bench.png',
                locker: 'assets/objects/locker.png',
                computer: 'assets/objects/computer.png',
                vending_machine: 'assets/objects/vending_machine.png',
                filing_cabinet: 'assets/objects/filing_cabinet.png',
                door: 'assets/objects/door.png',
                plant: 'assets/objects/plant.png',
                kiosk: 'assets/objects/kiosk.png'
            },

            // UI elements
            ui: {
                health_bar: 'assets/ui/health_bar.png',
                evidence_icon: 'assets/ui/evidence_icon.png',
                key_icon: 'assets/ui/key_icon.png'
            },

            // Effects
            effects: {
                glow: 'assets/effects/glow.png',
                particle: 'assets/effects/particle.png',
                detection_cone: 'assets/effects/detection_cone.png'
            }
        };
    }

    // Load all assets
    async loadAll(onProgress) {
        const allPaths = this.getAllPaths();
        this.totalAssets = allPaths.length;
        let loadedCount = 0;

        const loadPromises = allPaths.map(({ key, path }) => {
            return this.loadImage(path)
                .then(img => {
                    this.images.set(key, img);
                    this.loaded.set(key, true);
                    loadedCount++;
                    this.loadProgress = (loadedCount / this.totalAssets) * 100;
                    if (onProgress) onProgress(this.loadProgress);
                })
                .catch(err => {
                    console.warn(`Failed to load ${path}, using fallback rendering`);
                    this.loaded.set(key, false);
                    loadedCount++;
                    this.loadProgress = (loadedCount / this.totalAssets) * 100;
                    if (onProgress) onProgress(this.loadProgress);
                });
        });

        await Promise.all(loadPromises);
        console.log('Asset loading complete!');
    }

    // Load single image
    loadImage(path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = path;
        });
    }

    // Get all asset paths as flat array
    getAllPaths() {
        const paths = [];

        for (const [category, items] of Object.entries(this.assetPaths)) {
            for (const [key, path] of Object.entries(items)) {
                paths.push({ key: `${category}.${key}`, path });
            }
        }

        return paths;
    }

    // Get image by key
    getImage(category, name) {
        const key = `${category}.${name}`;
        return this.images.get(key);
    }

    // Check if image is loaded
    hasImage(category, name) {
        const key = `${category}.${name}`;
        return this.loaded.get(key) === true;
    }

    // Get character sprite
    getCharacterSprite(name) {
        return this.getImage('characters', name);
    }

    // Get background
    getBackground(name) {
        return this.getImage('backgrounds', name);
    }

    // Get object sprite
    getObject(name) {
        return this.getImage('objects', name);
    }

    // Get UI element
    getUI(name) {
        return this.getImage('ui', name);
    }

    // Get effect
    getEffect(name) {
        return this.getImage('effects', name);
    }
}
