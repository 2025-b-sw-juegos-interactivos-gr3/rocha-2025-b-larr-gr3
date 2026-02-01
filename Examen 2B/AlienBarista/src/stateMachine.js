export const GameState = {
    IDLE: "ESPERANDO",
    BREWING: "SIRVIENDO",
    RESULT: "RESULTADO"
};


export class GameManager {
    constructor() {
        this.state = GameState.IDLE;
        this.riskLevel = 0;
        this.credits = 0; // <--- Iniciamos en cero créditos
        this.alienMesh = null;
        this.currentCustomer = null;
    }
}