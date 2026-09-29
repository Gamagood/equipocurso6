const canvas = document.getElementById("particulas");
const ctx = canvas.getContext("2d");

let particulas = [];

function ajustarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

ajustarCanvas();

window.addEventListener("resize", ajustarCanvas);


class Particula {

    constructor() {

        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.radio = Math.random() * 2 + 1;

        this.velocidadX = (Math.random() - 0.5) * 0.5;
        this.velocidadY = (Math.random() - 0.5) * 0.5;

        this.opacidad = Math.random() * 0.4 + 0.1;
    }


    actualizar() {

        this.x += this.velocidadX;
        this.y += this.velocidadY;

        if (this.x < 0 || this.x > canvas.width) {
            this.velocidadX *= -1;
        }

        if (this.y < 0 || this.y > canvas.height) {
            this.velocidadY *= -1;
        }
    }


    dibujar() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radio,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = `rgba(0, 0, 0, ${this.opacidad})`;

        ctx.fill();
    }
}


function crearParticulas() {

    particulas = [];

    for (let i = 0; i < 80; i++) {
        particulas.push(new Particula());
    }
}


function conectarParticulas() {

    for (let i = 0; i < particulas.length; i++) {

        for (let j = i + 1; j < particulas.length; j++) {

            let dx = particulas[i].x - particulas[j].x;
            let dy = particulas[i].y - particulas[j].y;

            let distancia = Math.sqrt(
                dx * dx + dy * dy
            );

            if (distancia < 110) {

                let opacidad =
                    1 - distancia / 110;

                ctx.beginPath();

                ctx.strokeStyle =
                    `rgba(0, 0, 0, ${opacidad * 0.12})`;

                ctx.lineWidth = 1;

                ctx.moveTo(
                    particulas[i].x,
                    particulas[i].y
                );

                ctx.lineTo(
                    particulas[j].x,
                    particulas[j].y
                );

                ctx.stroke();
            }
        }
    }
}


function animar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    particulas.forEach(particula => {

        particula.actualizar();
        particula.dibujar();

    });

    conectarParticulas();

    requestAnimationFrame(animar);
}


crearParticulas();
animar();


/* ============================= */
/* CALCULADORA */
/* ============================= */

const pantalla = document.getElementById("pantalla");
const operacionActual = document.getElementById("operacion-actual");
const historialElemento = document.getElementById("historial");
const teclas = document.querySelectorAll(".tecla");
const MAXIMO_DIGITOS = 10;

let valorPantalla = "0";
let valorAnterior = null;
let operador = null;
let esperandoOperando = false;
let historial = [];

function formatearNumero(valor) {
    if (Number.isNaN(valor) || !Number.isFinite(valor)) return "Error";

    const texto = String(valor);
    if (texto.length <= MAXIMO_DIGITOS) return texto;

    if (texto.includes(".")) {
        const parteEntera = texto.split(".")[0];
        const decimalesDisponibles = MAXIMO_DIGITOS - parteEntera.length - 1;

        if (decimalesDisponibles > 0) {
            return valor.toFixed(decimalesDisponibles).replace(/\.?0+$/, "");
        }
    }

    for (let precision = 5; precision >= 0; precision--) {
        const exponencial = valor.toExponential(precision);
        if (exponencial.length <= MAXIMO_DIGITOS) return exponencial;
    }

    return valor.toExponential(0);
}

function actualizarPantalla() {
    pantalla.textContent = valorPantalla;
    operacionActual.textContent = valorAnterior !== null && operador
        ? `${formatearNumero(valorAnterior)} ${operador}`
        : "";
}

function actualizarHistorial() {
    if (historial.length === 0) {
        historialElemento.innerHTML = '<span class="historial-vacio">El historial aparecerá aquí</span>';
        return;
    }

    historialElemento.replaceChildren();
    historial.slice(-4).forEach((entrada) => {
        const linea = document.createElement("div");
        linea.textContent = entrada;
        historialElemento.appendChild(linea);
    });
    historialElemento.scrollTop = historialElemento.scrollHeight;
}

function ingresarNumero(numero) {
    if (esperandoOperando || valorPantalla === "Error") {
        valorPantalla = numero === "." ? "0." : numero;
        esperandoOperando = false;
    } else if (numero === ".") {
        if (!valorPantalla.includes(".")) valorPantalla += ".";
    } else {
        const nuevoValor = valorPantalla === "0" ? numero : valorPantalla + numero;
        const cantidadDigitos = nuevoValor.replace(/[.\-]/g, "").length;
        if (cantidadDigitos <= MAXIMO_DIGITOS) valorPantalla = nuevoValor;
    }

    actualizarPantalla();
}

function calcular(primerValor, segundoValor, operacion) {
    switch (operacion) {
        case "+": return primerValor + segundoValor;
        case "-": return primerValor - segundoValor;
        case "×": return primerValor * segundoValor;
        case "÷": return segundoValor === 0 ? NaN : primerValor / segundoValor;
        default: return segundoValor;
    }
}

function guardarEnHistorial(primerValor, segundoValor, operacion, resultado) {
    const resultadoVisible = formatearNumero(resultado);
    historial.push(`${formatearNumero(primerValor)} ${operacion} ${formatearNumero(segundoValor)} = ${resultadoVisible}`);
    historial = historial.slice(-5);
    actualizarHistorial();
}

function ingresarOperacion(nuevoOperador) {
    const valorIngresado = Number.parseFloat(valorPantalla);
    if (Number.isNaN(valorIngresado)) return;

    if (valorAnterior === null) {
        valorAnterior = valorIngresado;
    } else if (operador && !esperandoOperando) {
        const resultado = calcular(valorAnterior, valorIngresado, operador);
        guardarEnHistorial(valorAnterior, valorIngresado, operador, resultado);
        valorPantalla = formatearNumero(resultado);
        valorAnterior = Number.isFinite(resultado) ? resultado : null;
    }

    operador = valorAnterior === null ? null : nuevoOperador;
    esperandoOperando = true;
    actualizarPantalla();
}

function obtenerResultado() {
    if (valorAnterior === null || !operador || esperandoOperando) return;

    const valorIngresado = Number.parseFloat(valorPantalla);
    const resultado = calcular(valorAnterior, valorIngresado, operador);
    guardarEnHistorial(valorAnterior, valorIngresado, operador, resultado);
    valorPantalla = formatearNumero(resultado);
    valorAnterior = null;
    operador = null;
    esperandoOperando = true;
    actualizarPantalla();
}

function limpiarCalculadora() {
    valorPantalla = "0";
    valorAnterior = null;
    operador = null;
    esperandoOperando = false;
    actualizarPantalla();
}

function borrarUltimo() {
    if (esperandoOperando || valorPantalla === "Error") return;
    valorPantalla = valorPantalla.length > 1 ? valorPantalla.slice(0, -1) : "0";
    if (valorPantalla === "-") valorPantalla = "0";
    actualizarPantalla();
}

function procesarEntrada(valor) {
    if (/^\d$/.test(valor) || valor === ".") {
        ingresarNumero(valor);
    } else if (["+", "-", "×", "÷"].includes(valor)) {
        ingresarOperacion(valor);
    } else if (valor === "=") {
        obtenerResultado();
    } else if (valor === "C") {
        limpiarCalculadora();
    } else if (valor === "±") {
        const numero = Number.parseFloat(valorPantalla);
        if (!Number.isNaN(numero) && numero !== 0) valorPantalla = formatearNumero(numero * -1);
        actualizarPantalla();
    } else if (valor === "%") {
        const numero = Number.parseFloat(valorPantalla);
        if (!Number.isNaN(numero)) valorPantalla = formatearNumero(numero / 100);
        actualizarPantalla();
    }
}

teclas.forEach((tecla) => {
    tecla.addEventListener("click", () => procesarEntrada(tecla.dataset.valor));
});

document.getElementById("borrar-ultimo").addEventListener("click", borrarUltimo);
document.getElementById("limpiar-historial").addEventListener("click", () => {
    historial = [];
    actualizarHistorial();
});

document.addEventListener("keydown", (evento) => {
    const equivalencias = {
        Enter: "=",
        "=": "=",
        Escape: "C",
        "*": "×",
        "/": "÷",
        ",": "."
    };
    const valor = equivalencias[evento.key] || evento.key;

    if (evento.key === "Backspace") {
        evento.preventDefault();
        borrarUltimo();
        return;
    }

    if (/^\d$/.test(valor) || [".", "+", "-", "×", "÷", "=", "C"].includes(valor)) {
        evento.preventDefault();
        procesarEntrada(valor);

        const tecla = document.querySelector(`.tecla[data-valor="${CSS.escape(valor)}"]`);
        if (tecla) {
            tecla.classList.add("activa");
            setTimeout(() => tecla.classList.remove("activa"), 120);
        }
    }
});
