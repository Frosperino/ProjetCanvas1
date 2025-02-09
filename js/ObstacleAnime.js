import Obstacle from "./Obstacle.js";

export default class ObstacleAnime extends Obstacle {
    constructor(x, y, w, h, couleur, vitesse) {
        super(x, y, w, h, couleur);
        this.vitesse = vitesse;
        this.departY = y;
        this.amplitude = 100; // distance de déplacement vertical
    }

    draw(ctx) {
        // Animation de l'obstacle
        this.y = this.departY + Math.sin(Date.now() * 0.003 * this.vitesse) * this.amplitude;
        super.draw(ctx);
    }
} 