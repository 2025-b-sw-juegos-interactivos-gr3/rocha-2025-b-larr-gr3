# Alien Barista - Icarus Station Risk Management

## Descripción del Juego

**Alien Barista** es un juego interactivo 3D desarrollado con Babylon.js donde asumes el rol de barista en la estación Icarus. Tu misión es preparar bebidas para clientes alienígenas de diferentes especies, cada uno con un nivel de riesgo único.

### Mecánica Principal

El juego gira en torno a tomar decisiones de riesgo/recompensa:
- **Opción Segura**: Baja recompensa económica (100 créditos) pero baja probabilidad de explosión
- **Opción Arriesgada**: Alta recompensa económica (250 créditos) pero mayor probabilidad de que el cliente alienígena explote

### Clientes Alienígenas

1. **Xyloth** - El cliente más peligroso
   - Diálogo: "Mi núcleo está frío. Isótopos, ahora."
   - Riesgo Base: 40%
   - Color: Rojo/Magenta

2. **Sintético-7** - El cliente más seguro
   - Diálogo: "Energía baja. Cafeína pura requerida."
   - Riesgo Base: 10%
   - Color: Verde/Cian

3. **Gorgon** - El cliente equilibrado
   - Diálogo: "He visto galaxias arder. Tu café es peor."
   - Riesgo Base: 65%
   - Color: Púrpura

### Objetivos

- Gestiona tu presupuesto inicial de créditos
- Atiende a cada cliente alienígena correctamente
- Maximiza tus ganancias sin provocar explosiones
- Obtén la mayor puntuación posible

## Cómo Ejecutar

### Requisitos
- Navegador web moderno (Chrome, Firefox, Edge)
- Conexión a Internet (para cargar las bibliotecas de Babylon.js desde CDN)

### Pasos para Ejecutar

1. **Navega a la carpeta del proyecto:**
   ```
   cd "Examen 2B\AlienBarista"
   ```

2. **Inicia un servidor local:**
   
   **Opción A - Usando Python 3:**
   ```bash
   python -m http.server 8000
   ```
   
   **Opción B - Usando Node.js (http-server):**
   ```bash
   npx http-server
   ```
   
   **Opción C - Usando VS Code (Live Server):**
   - Instala la extensión "Live Server" en VS Code
   - Click derecho en `index.html` → "Open with Live Server"

3. **Abre tu navegador:**
   - Ve a `http://localhost:8000`
   - El juego debería cargar automáticamente

### ¿Por qué necesitamos un servidor local?

Los modelos 3D y recursos del juego se cargan mediante CORS, que no funciona al abrir archivos locales directamente con `file://`. Un servidor local permite que el navegador cargue los activos correctamente.

## Estructura del Proyecto

```
AlienBarista/
├── index.html              # Página principal
├── style.css              # Estilos visuales
├── assets/                # Recursos del juego
│   ├── audio/            # Efectos de sonido
│   └── models/           # Modelos 3D (alien_principal.glb)
└── src/                   # Código fuente JavaScript
    ├── main.js           # Punto de entrada del juego
    ├── gameLogic.js      # Lógica de clientes y cálculo de riesgo
    ├── stateMachine.js   # Máquina de estados del juego
    ├── environment.js    # Configuración del entorno 3D y objetos
    ├── effects.js        # Efectos visuales (explosiones, animaciones de cámara)
    ├── ui.js             # Interfaz de usuario
    └── audio.js          # Gestor de audio
```

## Controles del Juego

- **Click en "SERVICIO SEGURO"**: Prepara una bebida segura (recompensa baja)
- **Click en "SERVICIO ARRIESGADO"**: Prepara una bebida arriesgada (recompensa alta)

El juego indicará el resultado:
- ✓ Éxito: Ganas los créditos
- ✗ Explosión: Pierdes 50 créditos y el cliente alienígena explota

## Tecnologías Utilizadas

- **Babylon.js 6**: Motor 3D basado en WebGL
- **Babylon.js GUI**: Sistema de interfaz de usuario 3D
- **WebGL**: Renderizado gráfico acelerado por hardware
- **JavaScript ES6 Modules**: Arquitectura modular del código

## Puntuación

Tu puntuación se basa en:
- **Créditos ganados**: +100 (seguro) o +250 (arriesgado) por servicio exitoso
- **Créditos perdidos**: -50 por explosión
- **Objetivo**: Llega a 1000 créditos para ganar

## Notas de Desarrollo

- Los modelos 3D se cargan desde `assets/models/` en formato glb
- Los efectos de sonido están en `assets/audio/`
- El juego utiliza un sistema de máquina de estados para gestionar el flujo del juego
- La cámara tiene animaciones suave que mejoran la experiencia visual

---

**Autor**: Estudiante de Desarrollo de Juegos Interactivos  
**Asignatura**: Examen 2B - Desarrollo de Juegos Interactivos  
**Fecha**: 2025
