import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { gsap, Elastic } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

class ImageToParticle {
    static OPTIONS = {
        count: 1000
    }
    constructor() {
        this.gui;
        this.canvas;
        this.scene;
        this.image;
        this.ctx;
        this.particles;
        this.init();
    }

    handleGenerateImage() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let i = 0, j = this.particles.length; i < j; i++) {
                const particle = this.particles[i];
                this.ctx.fillRect(particle.x1 * 4, particle.y1 * 4, 2, 2);
            }
        }

        this.image = new Image();
        this.image.src = "./assets/images/moradcreativeLogo.png";
        // this.image.src = "./assets/images/murad.png";
        this.image.onload = () => {
            this.ctx = this.canvas.getContext("2d");

            this.canvas.width = this.image.width * 4;
            this.canvas.height = this.image.width * 4;

            this.ctx.drawImage(this.image, 0, 0);
            const data = this.ctx.getImageData(0, 0, this.image.width, this.image.height);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = "white";

            this.particles = [];
            for (let y = 0, y2 = data.height; y < y2; y++) {
                for (let x = 0, x2 = data.width; x < x2; x++) {
                    const alpha = data.data[(x * 4 + y * 4 * data.width) + 3];
                    if (alpha > 200) {
                        const particle = {
                            x0: x + Math.random(),
                            y0: y + Math.random(),
                            x1: x,
                            y1: -1,
                            speed: Math.random() * 4 + 2
                        };
                        gsap.to(particle, {
                            duration: particle.speed,
                            x1: particle.x0,
                            y1: particle.y0,
                            delay: y / 30,
                            ease: Elastic.linear
                        });
                        this.particles.push(particle);
                    }
                }
            }

            animate();
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