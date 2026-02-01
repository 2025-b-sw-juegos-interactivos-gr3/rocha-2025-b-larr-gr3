export const CLIENTES = [
    { nombre: "Xyloth", dialogo: "Mi núcleo está frío. Isótopos, ahora.", riesgoBase: 40, color: new BABYLON.Color3(1, 0, 0.4) },
    { nombre: "Sintético-7", dialogo: "Energía baja. Cafeína pura requerida.", riesgoBase: 10, color: new BABYLON.Color3(0, 1, 0.5) },
    { nombre: "Gorgon", dialogo: "He visto galaxias arder. Tu café es peor.", riesgoBase: 65, color: new BABYLON.Color3(0.5, 0, 1) }
];

export function calculateOutcome(baseRisk, isRisky) {
    const totalRisk = (baseRisk + (isRisky ? 40 : 0)) / 100;
    return Math.random() < totalRisk; // Devuelve true si explota
}