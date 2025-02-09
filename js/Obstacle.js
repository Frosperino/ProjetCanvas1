import ObjetGraphique from "./ObjectGraphique.js";

export default class Obstacle extends ObjetGraphique {
    constructor(x, y, w, h, couleur, orientation = 'horizontal') {
        super(x, y, w, h, couleur);
        this.orientation = orientation; // 'horizontal' ou 'vertical'
    }

    draw(ctx) {
        ctx.fillStyle = this.couleur;
        ctx.strokeStyle = this.couleur;
        ctx.lineWidth = 80; // Épaisseur de la ligne augmentée à 80 pixels
        
        if (this.orientation === 'horizontal') {
            // Ligne horizontale
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.h/2);
            ctx.lineTo(this.x + this.w, this.y + this.h/2);
            ctx.stroke();
        } else if (this.orientation === 'vertical') {
            // Ligne verticale
            ctx.beginPath();
            ctx.moveTo(this.x + this.w/2, this.y);
            ctx.lineTo(this.x + this.w/2, this.y + this.h);
            ctx.stroke();
        } else {
            // Pour la sortie (rectangle)
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }
    }
}