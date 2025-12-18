// 3D Renderer using Three.js
class Renderer3D {
    constructor(canvas) {
        this.canvas = canvas;

        // Set up Three.js scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x2d3142);
        this.scene.fog = new THREE.Fog(0x2d3142, 15, 60);

        // Set up camera (first-person perspective)
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1.6, 0); // Eye level height

        // Set up renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Raycaster for interaction detection
        this.raycaster = new THREE.Raycaster();
        this.raycaster.far = 3; // Interaction distance

        // Store scene objects
        this.interactableObjects = [];
        this.npcMeshes = [];

        // Initialize the environment
        this.initLighting();
        this.createHospitalEnvironment();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    initLighting() {
        // Ambient light (brighter for better visibility)
        const ambientLight = new THREE.AmbientLight(0x808080, 0.6);
        this.scene.add(ambientLight);

        // Main directional light (simulating overhead lights)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.left = -30;
        directionalLight.shadow.camera.right = 30;
        directionalLight.shadow.camera.top = 30;
        directionalLight.shadow.camera.bottom = -30;
        this.scene.add(directionalLight);

        // Add some point lights for atmosphere
        this.addPointLight(-5, 3, -5, 0xbb9af7, 1.2);
        this.addPointLight(5, 3, -5, 0xbb9af7, 1.2);
        this.addPointLight(0, 3, -15, 0xbb9af7, 1.0);
        this.addPointLight(-5, 3, 10, 0xbb9af7, 1.0);
        this.addPointLight(5, 3, 10, 0xbb9af7, 1.0);
    }

    addPointLight(x, y, z, color, intensity) {
        const light = new THREE.PointLight(color, intensity, 15);
        light.position.set(x, y, z);
        light.castShadow = true;
        this.scene.add(light);

        // Add visible light bulb
        const bulbGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const bulbMaterial = new THREE.MeshBasicMaterial({ color: color });
        const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
        bulb.position.set(x, y, z);
        this.scene.add(bulb);

        return light;
    }

    createHospitalEnvironment() {
        // Floor
        const floorGeometry = new THREE.PlaneGeometry(40, 40);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a5568,
            roughness: 0.8,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Add tile pattern to floor
        const tileTexture = this.createTileTexture();
        floorMaterial.map = tileTexture;
        floorMaterial.needsUpdate = true;

        // Ceiling
        const ceiling = new THREE.Mesh(floorGeometry, new THREE.MeshStandardMaterial({
            color: 0x3d405b,
            roughness: 1
        }));
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = 4;
        ceiling.receiveShadow = true;
        this.scene.add(ceiling);

        // Create walls and rooms
        this.createWalls();
        this.createReceptionDesk();
        this.createDoors();
        this.createProps();
    }

    createTileTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Base color
        ctx.fillStyle = '#2d3142';
        ctx.fillRect(0, 0, 512, 512);

        // Tile grid
        ctx.strokeStyle = '#1a1d29';
        ctx.lineWidth = 2;
        const tileSize = 64;
        for (let x = 0; x < 512; x += tileSize) {
            for (let y = 0; y < 512; y += tileSize) {
                ctx.strokeRect(x, y, tileSize, tileSize);
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
        return texture;
    }

    createWalls() {
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x3d405b,
            roughness: 0.9
        });

        // Front wall (with opening for entrance)
        this.createWallSegment(-20, 0, -20, 15, 4, 0.2, wallMaterial);
        this.createWallSegment(5, 0, -20, 15, 4, 0.2, wallMaterial);
        this.createWallSegment(-5, 3.5, -20, 10, 0.5, 0.2, wallMaterial); // Above door

        // Back wall
        this.createWallSegment(0, 0, 20, 40, 4, 0.2, wallMaterial);

        // Left wall
        this.createWallSegment(-20, 0, 0, 0.2, 4, 40, wallMaterial);

        // Right wall
        this.createWallSegment(20, 0, 0, 0.2, 4, 40, wallMaterial);

        // Inner walls (corridor)
        this.createWallSegment(0, 0, 5, 20, 4, 0.2, wallMaterial);
        this.createWallSegment(-10, 0, 10, 0.2, 4, 10, wallMaterial);
        this.createWallSegment(10, 0, 10, 0.2, 4, 10, wallMaterial);
    }

    createWallSegment(x, y, z, width, height, depth, material) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const wall = new THREE.Mesh(geometry, material);
        wall.position.set(x, y + height / 2, z);
        wall.castShadow = true;
        wall.receiveShadow = true;
        this.scene.add(wall);
        return wall;
    }

    createReceptionDesk() {
        const deskMaterial = new THREE.MeshStandardMaterial({
            color: 0x5a4a78,
            roughness: 0.6
        });

        // Main desk counter
        const deskGeometry = new THREE.BoxGeometry(6, 1.2, 2);
        const desk = new THREE.Mesh(deskGeometry, deskMaterial);
        desk.position.set(0, 0.6, -10);
        desk.castShadow = true;
        this.scene.add(desk);

        // Computer on desk
        const computerGeometry = new THREE.BoxGeometry(0.5, 0.4, 0.3);
        const computerMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1d29 });
        const computer = new THREE.Mesh(computerGeometry, computerMaterial);
        computer.position.set(-1.5, 1.4, -10);
        computer.castShadow = true;
        this.scene.add(computer);
    }

    createDoors() {
        const doorMaterial = new THREE.MeshStandardMaterial({
            color: 0x7d4e57,
            roughness: 0.7
        });

        // Main entrance door
        const doorGeometry = new THREE.BoxGeometry(2.5, 3, 0.1);
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 1.5, -19.9);
        door.castShadow = true;
        this.scene.add(door);

        // Door handle
        const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
        const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0xc0c0c0,
            metalness: 0.9,
            roughness: 0.3
        });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.rotation.z = Math.PI / 2;
        handle.position.set(0.8, 1, -19.8);
        this.scene.add(handle);

        // Side room doors
        this.createSideRoomDoor(-10, 15);
        this.createSideRoomDoor(10, 15);
    }

    createSideRoomDoor(x, z) {
        const doorMaterial = new THREE.MeshStandardMaterial({
            color: 0x7d4e57,
            roughness: 0.7
        });
        const doorGeometry = new THREE.BoxGeometry(0.1, 3, 2);
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(x, 1.5, z);
        door.castShadow = true;
        this.scene.add(door);
    }

    createProps() {
        // Waiting chairs
        this.createChair(-8, -5);
        this.createChair(-6, -5);
        this.createChair(-4, -5);

        // Plants
        this.createPlant(-15, -15);
        this.createPlant(15, -15);

        // Evidence item - hospital map on desk
        this.createEvidenceItem(-2, 1.3, -10, 'hospital_map');

        // Exit sign
        this.createExitSign(0, -18);
    }

    createChair(x, z) {
        const chairMaterial = new THREE.MeshStandardMaterial({
            color: 0x5a4a78,
            roughness: 0.7
        });

        // Seat
        const seatGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.8);
        const seat = new THREE.Mesh(seatGeometry, chairMaterial);
        seat.position.set(x, 0.5, z);
        seat.castShadow = true;
        this.scene.add(seat);

        // Back
        const backGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.1);
        const back = new THREE.Mesh(backGeometry, chairMaterial);
        back.position.set(x, 0.9, z - 0.35);
        back.castShadow = true;
        this.scene.add(back);

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
        const positions = [
            [x - 0.3, 0.25, z - 0.3],
            [x + 0.3, 0.25, z - 0.3],
            [x - 0.3, 0.25, z + 0.3],
            [x + 0.3, 0.25, z + 0.3]
        ];
        positions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, chairMaterial);
            leg.position.set(...pos);
            leg.castShadow = true;
            this.scene.add(leg);
        });
    }

    createPlant(x, z) {
        // Pot
        const potGeometry = new THREE.CylinderGeometry(0.3, 0.25, 0.5, 8);
        const potMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a4a4a,
            roughness: 0.8
        });
        const pot = new THREE.Mesh(potGeometry, potMaterial);
        pot.position.set(x, 0.25, z);
        pot.castShadow = true;
        this.scene.add(pot);

        // Plant leaves
        const leafMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d5016,
            roughness: 0.9
        });
        for (let i = 0; i < 5; i++) {
            const leafGeometry = new THREE.SphereGeometry(0.2, 8, 8);
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            const angle = (i / 5) * Math.PI * 2;
            leaf.position.set(
                x + Math.cos(angle) * 0.2,
                0.6 + Math.random() * 0.3,
                z + Math.sin(angle) * 0.2
            );
            leaf.castShadow = true;
            this.scene.add(leaf);
        }
    }

    createEvidenceItem(x, y, z, id) {
        // Evidence document/folder
        const evidenceGeometry = new THREE.BoxGeometry(0.3, 0.05, 0.4);
        const evidenceMaterial = new THREE.MeshStandardMaterial({
            color: 0xf4d35e,
            roughness: 0.6,
            emissive: 0xf4d35e,
            emissiveIntensity: 0.2
        });
        const evidence = new THREE.Mesh(evidenceGeometry, evidenceMaterial);
        evidence.position.set(x, y, z);
        evidence.rotation.y = Math.PI / 6;
        evidence.castShadow = true;
        evidence.userData = { type: 'evidence', id: id };
        this.scene.add(evidence);
        this.interactableObjects.push(evidence);

        // Add glow effect
        const glowGeometry = new THREE.PlaneGeometry(0.5, 0.5);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xf4d35e,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(x, y + 0.5, z);
        this.scene.add(glow);

        return evidence;
    }

    createExitSign(x, z) {
        const signGeometry = new THREE.BoxGeometry(1.5, 0.4, 0.1);
        const signMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 0.5
        });
        const sign = new THREE.Mesh(signGeometry, signMaterial);
        sign.position.set(x, 3.5, z);
        this.scene.add(sign);
    }

    createNPC(x, y, z, name, type) {
        // NPC body (using CylinderGeometry instead of CapsuleGeometry for r128 compatibility)
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: type === 'security' ? 0x4a7ba7 : 0x9da5b4,
            roughness: 0.6,
            emissive: type === 'security' ? 0x2d4a7c : 0x5a6270,
            emissiveIntensity: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(x, y, z);
        body.castShadow = true;
        body.userData = { type: 'npc', name: name, npcType: type };
        this.scene.add(body);
        this.npcMeshes.push(body);

        // NPC head (brighter and more visible)
        const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xfcc89b,
            roughness: 0.7,
            emissive: 0xfaa687,
            emissiveIntensity: 0.1
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(x, y + 1, z);
        head.castShadow = true;
        this.scene.add(head);

        // Vision cone (more visible for debugging)
        const coneGeometry = new THREE.ConeGeometry(2, 4, 8);
        const coneMaterial = new THREE.MeshBasicMaterial({
            color: type === 'security' ? 0xff3333 : 0xffaa33,
            transparent: true,
            opacity: 0.15,
            wireframe: false
        });
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.rotation.x = Math.PI / 2;
        cone.position.set(x, y + 0.8, z - 2);
        this.scene.add(cone);

        // Add a name tag above NPC
        const nameTagGeometry = new THREE.PlaneGeometry(1, 0.3);
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(45, 49, 91, 0.8)';
        ctx.fillRect(0, 0, 256, 64);
        ctx.fillStyle = '#bb9af7';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(name, 128, 32);

        const nameTexture = new THREE.CanvasTexture(canvas);
        const nameTagMaterial = new THREE.MeshBasicMaterial({
            map: nameTexture,
            transparent: true,
            side: THREE.DoubleSide
        });
        const nameTag = new THREE.Mesh(nameTagGeometry, nameTagMaterial);
        nameTag.position.set(x, y + 1.8, z);
        this.scene.add(nameTag);

        return { body, head, visionCone: cone, nameTag };
    }

    updateNPCPosition(npcMesh, x, y, z, rotation) {
        if (npcMesh && npcMesh.body) {
            npcMesh.body.position.set(x, y, z);
            npcMesh.body.rotation.y = rotation;

            if (npcMesh.head) {
                npcMesh.head.position.set(x, y + 1, z);
            }

            if (npcMesh.visionCone) {
                npcMesh.visionCone.position.set(
                    x + Math.sin(rotation) * 2,
                    y + 0.8,
                    z - Math.cos(rotation) * 2
                );
                npcMesh.visionCone.rotation.y = rotation;
            }

            if (npcMesh.nameTag) {
                npcMesh.nameTag.position.set(x, y + 1.8, z);
                // Make name tag always face camera
                npcMesh.nameTag.lookAt(this.camera.position);
            }
        }
    }

    checkInteraction() {
        // Raycast forward from camera
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactableObjects);

        if (intersects.length > 0) {
            return intersects[0].object.userData;
        }
        return null;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    getCamera() {
        return this.camera;
    }

    getScene() {
        return this.scene;
    }
}
