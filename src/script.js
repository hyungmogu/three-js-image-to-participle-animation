import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

class ImageToParticle {
    static OPTIONS = {
        count: 1000
    }
    constructor() {
        this.gui;
        this.canvas;
        this.scene;
        this.image;
        this.init();
    }

    handleGenerateImage() {
        this.image = new Image();
        this.image.src = "./assets/images/moradcreativeLogo.png";
        this.image.onload = () => {
            const ctx = this.canvas.getContext("2d");

            this.canvas.width = this.image.width * 4;
            this.canvas.height = this.image.width * 4;

            ctx.drawImage(this.image, 0, 0);
            const data = ctx.getImageData(0, 0, this.image.width, this.image.height);
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const particles = [];
            for (let y = 0, y2 = data.height; y < y2; y++) {
                for (let x = 0, x2 = data.width; x < x2; x++) {
                    const alpha = data.data[(x * 4 + y * 4 * data.width) + 3];
                    if (alpha > 128) {
                        const particle = {
                            x: x + Math.random(),
                            y: y + Math.random()
                        };
                        particles.push(particle);
                    }
                }
            }

            ctx.fillStyle = "white";
            for (let i = 0, j = particles.length; i < j; i++) {
                const particle = particles[i];
                ctx.fillRect(particle.x * 4, particle.y * 4, 2, 2);
            }
        };
    }

    handleLoadScene() {
        this.scene = new THREE.Scene();
    }

    handleLoadCanvas() {
        this.canvas = document.getElementById('scene');
    }

    handleLoadGUI() {
        this.gui = new dat.GUI();
    }

    init() {
        this.handleLoadGUI();
        this.handleLoadCanvas();
        this.handleLoadScene();
        this.handleGenerateImage();
    }
}

new ImageToParticle();