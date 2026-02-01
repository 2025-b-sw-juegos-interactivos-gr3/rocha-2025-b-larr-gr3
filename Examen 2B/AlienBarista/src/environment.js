// src/environment.js

/**
 * Configura la atmósfera, luces y escenario de la Estación Ícaro.
 */
export function setupEnvironment(scene) {
    // 1. ILUMINACIÓN NEÓN CONTRASTADA
    const ambientLight = new BABYLON.HemisphericLight("ambient", new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.intensity = 0.1;

    const cyanLight = new BABYLON.PointLight("cyanLight", new BABYLON.Vector3(-2, 2, -1), scene);
    cyanLight.diffuse = new BABYLON.Color3(0, 1, 1);
    cyanLight.intensity = 0.8;

    const magentaLight = new BABYLON.PointLight("magentaLight", new BABYLON.Vector3(2, 3, 2), scene);
    magentaLight.diffuse = new BABYLON.Color3(1, 0, 1);
    magentaLight.intensity = 1.2;

    // 2. EFECTO DE GLOW (Brillo de neón)
    const gl = new BABYLON.GlowLayer("glow", scene);
    gl.intensity = 0.6;

    // 3. LA BARRA (Diseño Voxel/Minimalista)
    const bar = BABYLON.MeshBuilder.CreateBox("bar", { width: 5, height: 1.1, depth: 1.5 }, scene);
    bar.position.y = 0.55;
    
    const barMat = new BABYLON.StandardMaterial("barMat", scene);
    barMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1); 
    barMat.emissiveColor = new BABYLON.Color3(0, 0.2, 0.2); 
    bar.material = barMat;

    // 4. EFECTOS ATMOSFÉRICOS
    createAmbientDust(scene);
    createStarfield(scene);

    return { bar, gl };
}

/**
 * Crea el recipiente para la bebida radioactiva.
 */
export function createCoffeeCup(scene) {
    const cup = BABYLON.MeshBuilder.CreateCylinder("cup", { height: 0.3, diameter: 0.2 }, scene);
    cup.position = new BABYLON.Vector3(0, 1.25, 0); 
    
    const cupMat = new BABYLON.StandardMaterial("cupMat", scene);
    cupMat.emissiveColor = new BABYLON.Color3(1, 1, 0); // Amarillo Neón
    cup.material = cupMat;
    
    cup.setEnabled(false); // Oculto hasta que se sirve
    return cup;
}

// --- FUNCIONES INTERNAS (Sin exportar para mantener el orden) ---

function createAmbientDust(scene) {
    const dust = new BABYLON.ParticleSystem("dust", 100, scene);
    dust.particleTexture = new BABYLON.Texture("https://raw.githubusercontent.com/PatrickRyanMS/BabylonJSimages/master/FF_Particle_Test/PlainCard.png", scene);
    dust.emitter = new BABYLON.Vector3(0, 1, 0);
    dust.minEmitBox = new BABYLON.Vector3(-3, 0, -2);
    dust.maxEmitBox = new BABYLON.Vector3(3, 2, 2);
    dust.color1 = new BABYLON.Color4(1, 1, 1, 0.1);
    dust.colorDead = new BABYLON.Color4(0, 0, 0, 0);
    dust.minSize = 0.01;
    dust.maxSize = 0.03;
    dust.emitRate = 10;
    dust.minLifeTime = 2;
    dust.maxLifeTime = 5;
    dust.gravity = new BABYLON.Vector3(0, -0.05, 0);
    dust.start();
}

function createStarfield(scene) {
    const stars = new BABYLON.ParticleSystem("stars", 500, scene);
    stars.particleTexture = new BABYLON.Texture("https://raw.githubusercontent.com/PatrickRyanMS/BabylonJSimages/master/FF_Particle_Test/PlainCard.png", scene);
    stars.emitter = new BABYLON.Vector3(0, 0, 15);
    stars.minEmitBox = new BABYLON.Vector3(-20, -15, 0);
    stars.maxEmitBox = new BABYLON.Vector3(20, 15, 5);
    stars.emitRate = 500;
    stars.manualEmitCount = 500;
    stars.minSize = 0.05;
    stars.maxSize = 0.15;
    stars.minLifeTime = 9999;
    stars.start();
}