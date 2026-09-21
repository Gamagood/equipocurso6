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