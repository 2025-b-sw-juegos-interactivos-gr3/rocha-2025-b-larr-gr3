// --- MÓDULO DE INTERFAZ DE USUARIO (GUI) ---

export function createUI(scene, onAction) {
    // Crear la textura principal de la interfaz
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // 1. Contenedor del Diálogo
    const rect = new BABYLON.GUI.Rectangle();
    rect.width = "70%";
    rect.height = "120px";
    rect.cornerRadius = 5;
    rect.color = "#00ffff"; // Borde neón
    rect.thickness = 2;
    rect.background = "rgba(0, 0, 0, 0.85)"; // Fondo semi-transparente
    rect.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    rect.top = "-50px";
    advancedTexture.addControl(rect);

    // --- CONTADOR DE CRÉDITOS ---
    const scoreText = new BABYLON.GUI.TextBlock();
    scoreText.text = "CRÉDITOS: 0000";
    scoreText.color = "#00ffff";
    scoreText.fontSize = 24;
    scoreText.fontFamily = "Courier New";
    scoreText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    scoreText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    scoreText.top = "20px";
    scoreText.left = "-20px";
    advancedTexture.addControl(scoreText);

    // 2. Bloque de Texto
    const textBlock = new BABYLON.GUI.TextBlock();
    textBlock.color = "white";
    textBlock.fontSize = 20;
    textBlock.fontFamily = "Courier New, monospace"; // Estilo retro-terminal
    textBlock.textWrapping = true;
    textBlock.text = ""; // Empieza vacío para el efecto typewriter
    rect.addControl(textBlock);

    // 3. Botones de Acción
    const btnContainer = new BABYLON.GUI.StackPanel();
    btnContainer.isVertical = false;
    btnContainer.height = "50px";
    btnContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    btnContainer.top = "-5px";
    advancedTexture.addControl(btnContainer);

    // Botón Opción A (Riesgo)
    const btnRisk = createStyledButton("btnRisk", "SENSACIÓN EXTREMA", "#ff0066");
    btnRisk.onPointerUpObservable.add(() => onAction(true));
    btnContainer.addControl(btnRisk);

    // Botón Opción B (Seguro)
    const btnSafe = createStyledButton("btnSafe", "DOSIS SEGURA", "#0099ff");
    btnSafe.onPointerUpObservable.add(() => onAction(false));
    btnContainer.addControl(btnSafe);

    return {
        updateText: (newText) => {typeWriterEffect(textBlock, newText),
        advancedTexture} ,
        updateCredits: (amount) => {
            // Formateamos para que siempre tenga 4 dígitos (ej: 0050)
            scoreText.text = "CRÉDITOS: " + amount.toString().padStart(4, '0');
        },
        textBlock //
    };
}

// Función auxiliar para botones con estilo Cyber
function createStyledButton(name, label, color) {
    const btn = BABYLON.GUI.Button.CreateSimpleButton(name, label);
    btn.width = "220px";
    btn.height = "40px";
    btn.color = "white";
    btn.background = color;
    btn.thickness = 2;
    btn.paddingLeft = "10px";
    btn.paddingRight = "10px";
    return btn;
}

// EFECTO MÁQUINA DE ESCRIBIR
function typeWriterEffect(textBlock, fullText) {
    textBlock.text = "";
    let i = 0;
    const speed = 40; // milisegundos por letra

    const interval = setInterval(() => {
        textBlock.text += fullText.charAt(i);
        i++;
        if (i >= fullText.length) clearInterval(interval);
    }, speed);
}