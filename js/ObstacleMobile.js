import Obstacle from "./Obstacle.js";

export default class ObstacleMobile extends Obstacle {
    constructor(x, y, w, h, couleur, amplitude = 200, vitesse = 0.002) {
        super(x, y, w, h, couleur);
        this.departY = y;
        this.amplitude = amplitude; // distance de déplacement vertical
        this.vitesse = vitesse;
    }

    draw(ctx) {
        // Met à jour la position Y en fonction du temps
        this.y = this.departY + Math.sin(Date.now() * this.vitesse) * this.amplitude;
        
        // Dessine l'obstacle avec la même méthode que la classe parente
        super.draw(ctx);
    }
} 