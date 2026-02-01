// src/effects.js

export function triggerExplosion(scene, position) {
    if (!position) return;
    const ps = new BABYLON.ParticleSystem("particles", 500, scene);
    ps.particleTexture = new BABYLON.Texture("https://raw.githubusercontent.com/PatrickRyanMS/BabylonJSimages/master/FF_Particle_Test/PlainCard.png", scene);
    
    // Usamos la posición que nos pasan (el .position del mesh)
    ps.emitter = position.clone(); 
    
    ps.color1 = new BABYLON.Color4(1, 0, 0.5, 1);
    ps.color2 = new BABYLON.Color3(0, 1, 1);
    ps.manualEmitCount = 300;
    ps.disposeOnStop = true;
    ps.start();

    setTimeout(() => ps.stop(), 2000);
}

export function animateCamera(scene, camera, targetZ, onComplete) {
    const animation = new BABYLON.Animation(
        "camAnim", 
        "position.z", 
        60, 
        BABYLON.Animation.ANIMATIONTYPE_FLOAT, 
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    
    const keys = [
        { frame: 0, value: camera.position.z }, 
        { frame: 60, value: targetZ }
    ];
    
    animation.setKeys(keys);
    camera.animations = [animation];
    scene.beginAnimation(camera, 0, 60, false, 1, onComplete);
}