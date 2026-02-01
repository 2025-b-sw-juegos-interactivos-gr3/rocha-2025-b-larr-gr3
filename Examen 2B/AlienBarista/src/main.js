import { GameManager, GameState } from './stateMachine.js';
import { CLIENTES, calculateOutcome } from './gameLogic.js';
import { setupEnvironment, createCoffeeCup } from './environment.js'; // Importamos el vaso
import { triggerExplosion, animateCamera } from './effects.js';
import { createUI } from './ui.js';
import { AudioManager } from './audio.js';

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const manager = new GameManager();
let cup; // Variable global para el vaso
let audioManager;

const createScene = async function () {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 1.7, -3), scene);
    camera.setTarget(new BABYLON.Vector3(0, 1.5, 0));

    setupEnvironment(scene);
    cup = createCoffeeCup(scene); // Creamos el vaso en la barra

    audioManager = new AudioManager(scene);
    await audioManager.loadSounds();
    // CARGA DE ALIEN
    try {
        const aRes = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/models/", "alien_principal.glb", scene);
        manager.alienMesh = aRes.meshes[0];
        manager.alienMesh.rotationQuaternion = null;
        manager.alienMesh.position = new BABYLON.Vector3(0.5, 0, 1.5);
        console.log("Alien cargado con éxito");
        manager.alienMesh.rotation.y = 0;

        if (aRes.animationGroups.length > 0) {
        // Reproducir la primera animación (normalmente el Idle/Espera)
        // El parámetro 'true' es para que se repita en bucle (loop)
        aRes.animationGroups[0].play(true);
        console.log("Animación activada: " + aRes.animationGroups[0].name);
            } else {
                console.warn("El modelo no tiene grupos de animación.");
            }

    } catch (e) { 
        console.warn("Usando alien temporal de emergencia");
        manager.alienMesh = BABYLON.MeshBuilder.CreateBox("alien", {size: 0.8}, scene);
        manager.alienMesh.position = new BABYLON.Vector3(0, 1.5, 1.5);
    }

    // UI
    const ui = createUI(scene, (risky) => handleService(scene, camera, ui, risky));
    manager.currentCustomer = CLIENTES[0];
    ui.updateText(`${manager.currentCustomer.nombre}: ${manager.currentCustomer.dialogo}`);

    return scene;
};

function handleService(scene, camera, ui, risky) {
    if (manager.state !== GameState.IDLE) return;
    manager.state = GameState.BREWING;
    console.log("Iniciando servicio... Riesgo:", risky);

    // Aparece la bebida
    cup.setEnabled(true);
    audioManager.playTension();

    animateCamera(scene, camera, -1.8, () => {
        const exploded = calculateOutcome(manager.currentCustomer.riesgoBase, risky);
        
        setTimeout(() => { // Pequeña pausa para "preparar"
            if (exploded) {
                audioManager.playExplosion();
                console.log("¡EL ALIEN EXPLOTÓ!");
                ui.updateText("¡ADVERTENCIA: FALLO METABÓLICO!");
                triggerExplosion(scene, manager.alienMesh.position);
                manager.alienMesh.setEnabled(false);
                manager.credits = Math.max(0, manager.credits - 50);
            } else {
                audioManager.playSuccess();
                const paga = risky ? 250 : 100;
                manager.credits += paga;
                ui.updateText(`ÉXITO. +${paga} CRÉDITOS RECIBIDOS.`);
                manager.alienMesh.scaling.scaleInPlace(1.1);
            }
            ui.updateCredits(manager.credits);
            cup.setEnabled(false); // Quitamos la bebida

            // 3. ESPERAR Y VOLVER (RESET)
            setTimeout(() => {
                animateCamera(scene, camera, -3, () => {
                    resetTurn(ui);
                });
            }, 2000);
        }, 1000);
    });
}

function resetTurn(ui) {
    console.log("Trayendo nuevo cliente...");
    // Elegimos uno nuevo al azar
    manager.currentCustomer = CLIENTES[Math.floor(Math.random() * CLIENTES.length)];
    manager.state = GameState.IDLE;
    
    // Lo hacemos aparecer de nuevo
    manager.alienMesh.setEnabled(true);
    
    // Actualizamos el texto
    ui.updateText(`${manager.currentCustomer.nombre}: ${manager.currentCustomer.dialogo}`);
}

createScene().then(scene => {
    engine.runRenderLoop(() => scene.render());
});