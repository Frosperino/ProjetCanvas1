import ObjectGraphique from "./ObjectGraphique.js";
import { drawCircleImmediat } from "./utils.js";   

export default class Player extends ObjectGraphique {
    constructor(x, y, l, h, couleur) {
        super(x, y, l, h, couleur);
        this.vitesseX = 0;
        this.vitesseY = 0;
        this.vitesseBase = 3;     // Vitesse de base
        this.acceleration = 0.1;   // Facteur d'accélération
        this.vitesseMax = 20;      // Vitesse maximale
        this.vitesseActuelle = this.vitesseBase; // Vitesse courante
        this.angle = 0;
    }

    draw(ctx) {
        // Ici on dessine un monstre
        ctx.save();

        // on déplace le systeme de coordonnées pour placer
        // le monstre en x, y.Tous les ordres de dessin
        // dans cette fonction seront par rapport à ce repère
        // translaté
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // on recentre le monstre
        ctx.translate(-this.w / 2, -this.h / 2);

        // tete du monstre
        ctx.fillStyle = this.couleur;
        ctx.fillRect(0, 0, this.w, this.h);
        // yeux
        drawCircleImmediat(ctx, 20, 20, 10, "red");
        drawCircleImmediat(ctx, 60, 20, 10, "red");

        // restore
        ctx.restore();
    }

    move() {
        this.x += this.vitesseX;
        this.y += this.vitesseY;
    }
}