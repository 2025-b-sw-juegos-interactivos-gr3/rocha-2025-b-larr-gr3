// src/audio.js

export class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.sounds = {};
    }

    async loadSounds() {
        try {
            console.log("Intentando cargar sonidos desde ./assets/audio/");
            
            // Carga de la música de tensión (loop)
            this.sounds.tension = new BABYLON.Sound("tension", "./assets/audio/tension_loop.mp3", this.scene, 
                () => {
                    console.log("✓ Música de tensión cargada");
                },
                {
                    loop: true,
                    autoplay: false,
                    volume: 0.7
                },
                (error) => {
                    console.error("✗ Error cargando tensión:", error);
                }
            );

            // Carga del sonido de explosión
            this.sounds.explosion = new BABYLON.Sound("explosion", "./assets/audio/explosion.wav", this.scene, 
                () => {
                    console.log("✓ Sonido de explosión cargado");
                },
                {
                    loop: false,
                    autoplay: false,
                    volume: 1.0
                },
                (error) => {
                    console.error("✗ Error cargando explosión:", error);
                }
            );

            // Carga del sonido de éxito
            this.sounds.success = new BABYLON.Sound("success", "./assets/audio/success.wav", this.scene, 
                () => {
                    console.log("✓ Sonido de éxito cargado");
                },
                {
                    loop: false,
                    autoplay: false,
                    volume: 1.0
                },
                (error) => {
                    console.error("✗ Error cargando éxito:", error);
                }
            );

            console.log("Audio Manager inicializado correctamente");
        } catch (error) {
            console.error("Error cargando sonidos:", error);
        }
    }

    playTension() { 
        console.log("Reproduciendo música de tensión");
        this.sounds.tension.play(); 
    }
    stopTension() { 
        this.sounds.tension.stop(); 
    }
    playExplosion() { 
        console.log("Reproduciendo explosión");
        this.sounds.explosion.play(); 
    }
    playSuccess() { 
        console.log("Reproduciendo éxito");
        this.sounds.success.play(); 
    }
}