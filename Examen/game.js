window.onload = function() { 
    const canvas = document.getElementById("renderCanvas");
    const engine = new BABYLON.Engine(canvas, true);

    // VARIABLES
    let camera;
    let selectedColorIndex = 0;
    let ghostMesh;
    let sfxPop, sfxDelete, sfxJump;
    
    const colors = [
        new BABYLON.Color3.FromHexString("#e74c3c"), new BABYLON.Color3.FromHexString("#3498db"),
        new BABYLON.Color3.FromHexString("#2ecc71"), new BABYLON.Color3.FromHexString("#f1c40f"),
        new BABYLON.Color3.FromHexString("#9b59b6"), new BABYLON.Color3.FromHexString("#ecf0f1"),
        new BABYLON.Color3.FromHexString("#34495e")
    ];
    let blockMaterials = [];

    const createScene = () => {
        const scene = new BABYLON.Scene(engine);
        // 1. ACTIVAR GRAVEDAD Y FÍSICAS
        scene.gravity = new BABYLON.Vector3(0, -0.9, 0); // Gravedad terrestre
        scene.collisionsEnabled = true;

        // 2. CÁMARA PRIMERA PERSONA (Caminar, no volar)
        camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 2, -10), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);
        
        // Configuración de físicas del jugador
        camera.applyGravity = true; 
        camera.checkCollisions = true;
        // El elipsoide define el "cuerpo" del jugador para que no atraviese paredes
        camera.ellipsoid = new BABYLON.Vector3(0.8, 1.0, 0.8);
        camera.minZ = 0.45;
        camera.speed = 0.5;
        camera.angularSensibility = 2000;
        
        // Teclas
        camera.keysUp.push(87); camera.keysDown.push(83); 
        camera.keysLeft.push(65); camera.keysRight.push(68);

        // 3. ESCENARIO: ZONA DE CONSTRUCCIÓN
        // Cielo agradable
        const hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
        hemi.intensity = 0.9;
        
        const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
        const skyMat = new BABYLON.StandardMaterial("skyBox", scene);
        skyMat.backFaceCulling = false;
        skyMat.reflectionTexture = new BABYLON.CubeTexture("https://assets.babylonjs.com/textures/skybox", scene);
        skyMat.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyMat.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyMat;

        // SUELO SÓLIDO (Plataforma)
        const groundSize = 40;
        const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: groundSize, height: groundSize }, scene);
        const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
        // Textura de baldosas de construcción
        const tileTex = new BABYLON.Texture("https://assets.babylonjs.com/textures/floor.png", scene);
        tileTex.uScale = 10; tileTex.vScale = 10;
        groundMat.diffuseTexture = tileTex;
        ground.material = groundMat;
        ground.checkCollisions = true; // ¡IMPORTANTE! Para no caerse
        ground.metadata = { isGround: true };

        // MUROS (Para que no te caigas del mapa)
        const wallMat = new BABYLON.StandardMaterial("wallMat", scene);
        wallMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        wallMat.alpha = 0.5; // Semitransparentes
        
        const wall1 = BABYLON.MeshBuilder.CreateBox("w1", {width: groundSize, height: 4, depth: 1}, scene);
        wall1.position.z = groundSize/2; wall1.position.y = 2;
        wall1.material = wallMat; wall1.checkCollisions = true;

        const wall2 = BABYLON.MeshBuilder.CreateBox("w2", {width: groundSize, height: 4, depth: 1}, scene);
        wall2.position.z = -groundSize/2; wall2.position.y = 2;
        wall2.material = wallMat; wall2.checkCollisions = true;

        const wall3 = BABYLON.MeshBuilder.CreateBox("w3", {width: 1, height: 4, depth: groundSize}, scene);
        wall3.position.x = groundSize/2; wall3.position.y = 2;
        wall3.material = wallMat; wall3.checkCollisions = true;

        const wall4 = BABYLON.MeshBuilder.CreateBox("w4", {width: 1, height: 4, depth: groundSize}, scene);
        wall4.position.x = -groundSize/2; wall4.position.y = 2;
        wall4.material = wallMat; wall4.checkCollisions = true;


        // 4. MATERIALES BLOQUES
        colors.forEach((col, index) => {
            const mat = new BABYLON.StandardMaterial(`mat_${index}`, scene);
            mat.diffuseColor = col;
            blockMaterials.push(mat);
        });

        // 5. SONIDOS
        sfxPop = new BABYLON.Sound("pop", "https://assets.babylonjs.com/sounds/bubble.wav", scene);
        sfxDelete = new BABYLON.Sound("del", "https://assets.babylonjs.com/sounds/shot.wav", scene, null, { pitch: 2.0 });
        sfxJump = new BABYLON.Sound("jump", "https://assets.babylonjs.com/sounds/click.wav", scene);

        // 6. BLOQUE FANTASMA
        ghostMesh = BABYLON.MeshBuilder.CreateBox("ghost", {size: 1}, scene);
        const ghostMat = new BABYLON.StandardMaterial("ghostMat", scene);
        ghostMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
        ghostMat.alpha = 0.5; 
        ghostMesh.material = ghostMat;
        ghostMesh.isPickable = false; ghostMesh.isVisible = false;

        // 7. INPUTS Y LÓGICA DE JUEGO
        
        // SALTO Y CORRER
        scene.onKeyboardObservable.add((kbInfo) => {
            if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
                // Teclas Numéricas (Colores)
                if (kbInfo.event.keyCode >= 49 && kbInfo.event.keyCode <= 55) selectColorUI(kbInfo.event.keyCode - 49);
                
                // SALTAR (Espacio)
                if (kbInfo.event.keyCode === 32) {
                    // Impulso simple hacia arriba
                    camera.cameraDirection.y = 0.5;
                    sfxJump.play();
                }
                // CORRER (Shift)
                if (kbInfo.event.keyCode === 16) camera.speed = 0.8;
            }
            if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYUP) {
                if (kbInfo.event.keyCode === 16) camera.speed = 0.5; // Velocidad normal
            }
        });

        // CLICK CONSTRUIR / BORRAR
        scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    if(document.pointerLockElement !== canvas) return; 
                    if (pointerInfo.event.button === 0) placeBlock(scene);
                    if (pointerInfo.event.button === 2) removeBlock(scene);
                    break;
            }
        });

        // ACTUALIZAR FANTASMA
        scene.registerAfterRender(() => {
            // Respawn si caes por error
            if (camera.position.y < -10) camera.position = new BABYLON.Vector3(0, 2, 0);

            const ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);
            const hit = scene.pickWithRay(ray);
            
            // Solo mostramos fantasma si está cerca (para no construir lejísimos)
            if (hit.hit && hit.distance < 10 && (hit.pickedMesh.metadata?.isBlock || hit.pickedMesh.metadata?.isGround)) {
                ghostMesh.isVisible = true;
                const pickedNormal = hit.getNormal(true);
                if (hit.pickedMesh.metadata.isGround) {
                    ghostMesh.position.x = Math.round(hit.pickedPoint.x);
                    ghostMesh.position.y = 0.5;
                    ghostMesh.position.z = Math.round(hit.pickedPoint.z);
                } else {
                    ghostMesh.position = hit.pickedMesh.position.add(pickedNormal);
                }
            } else {
                ghostMesh.isVisible = false;
            }
        });

        return scene;
    };

    function placeBlock(scene) {
        if (!ghostMesh.isVisible) return;
        const newBlock = BABYLON.MeshBuilder.CreateBox("block", {size: 1}, scene);
        newBlock.position = ghostMesh.position.clone();
        newBlock.material = blockMaterials[selectedColorIndex];
        newBlock.enableEdgesRendering();    
        newBlock.edgesWidth = 2.0;
        newBlock.edgesColor = new BABYLON.Color4(0, 0, 0, 0.1);
        newBlock.metadata = { isBlock: true };
        newBlock.checkCollisions = true; // ¡IMPORTANTE! El bloque ahora es sólido
        sfxPop.play();
    }

    function removeBlock(scene) {
        const ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);
        const hit = scene.pickWithRay(ray);
        if (hit.hit && hit.distance < 10 && hit.pickedMesh.metadata?.isBlock) {
            hit.pickedMesh.dispose();
            sfxDelete.play();
        }
    }

    window.selectColor = function(index) { selectColorUI(index); }
    function selectColorUI(index) {
        selectedColorIndex = index;
        const slots = document.querySelectorAll('.color-slot');
        slots.forEach(s => s.classList.remove('active'));
        if(slots[index]) slots[index].classList.add('active');
        if(ghostMesh && ghostMesh.material) ghostMesh.material.diffuseColor = colors[index];
    }

    const scene = createScene();
    engine.runRenderLoop(() => { scene.render(); });
    window.addEventListener("resize", () => { engine.resize(); });
    
    // Captura del puntero
    document.addEventListener("click", function() {
        if (canvas.requestPointerLock) { canvas.requestPointerLock(); }
    });
};