import Player from "./Player.js";
import Obstacle from "./Obstacle.js";
import ObstacleMobile from "./ObstacleMobile.js";
import { rectsOverlap } from "./collisions.js";
import { initListeners } from "./ecouteurs.js";

export default class Game {
    objetsGraphiques = [];

    constructor(canvas) {
        this.canvas = canvas;
        // etat du clavier
        this.inputStates = {
            mouseX: 0,
            mouseY: 0,
        };
        this.currentLevel = 1;
        this.maxLevels = 3;
        this.obstacles = []; // Initialisation du tableau d'obstacles
    }

    async init(canvas) {
        this.ctx = this.canvas.getContext("2d");

        // Création du joueur avec des dimensions plus grandes
        this.player = new Player(10, 10, 80, 80, "pink");
        this.objetsGraphiques = [this.player];

        // On initialise le premier niveau
        this.buildLevel(this.currentLevel);
        
        // Ajout des obstacles du niveau aux objets graphiques
        this.obstacles.forEach(obstacle => {
            this.objetsGraphiques.push(obstacle);
        });
        
        // Ajout de la sortie aux objets graphiques
        this.objetsGraphiques.push(this.sortie);

        // On initialise les écouteurs de touches, souris, etc.
        initListeners(this.inputStates, this.canvas);

        console.log("Game initialisé");
    }

    start() {
        console.log("Game démarré");

        // On démarre une animation à 60 images par seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    mainAnimationLoop() {
        // 1 - on efface le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 2 - on dessine les objets à animer dans le jeu
        // ici on dessine le monstre
        this.drawAllObjects();

        // 3 - On regarde l'état du clavier, manette, souris et on met à jour
        // l'état des objets du jeu en conséquence
        this.update();

        // 4 - on demande au navigateur d'appeler la fonction mainAnimationLoop
        // à nouveau dans 1/60 de seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    drawAllObjects() {
        // Dessine tous les objets du jeu
        this.objetsGraphiques.forEach(obj => {
            obj.draw(this.ctx);
        });

        // Affiche le niveau actuel
        this.ctx.save();
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.fillText(`Niveau ${this.currentLevel}`, 20, 40);
        this.ctx.restore();
    }

    update() {
        // Appelée par mainAnimationLoop
        // donc tous les 1/60 de seconde
        
        // Déplacement du joueur. 
        this.movePlayer();

        // On regarde si le joueur a atteint la sortie
        this.checkCollisionWithExit();
    }

    movePlayer() {
        let moving = false;
        
        if(this.inputStates.ArrowRight) {
            this.player.vitesseX = this.player.vitesseActuelle;
            moving = true;
        } else if(this.inputStates.ArrowLeft) {
            this.player.vitesseX = -this.player.vitesseActuelle;
            moving = true;
        } else {
            this.player.vitesseX = 0;
        }

        if(this.inputStates.ArrowUp) {
            this.player.vitesseY = -this.player.vitesseActuelle;
            moving = true;
        } else if(this.inputStates.ArrowDown) {
            this.player.vitesseY = this.player.vitesseActuelle;
            moving = true;
        } else {
            this.player.vitesseY = 0;
        }

        // Accélération si le joueur bouge
        if(moving) {
            this.player.vitesseActuelle = Math.min(
                this.player.vitesseActuelle + this.player.acceleration,
                this.player.vitesseMax
            );
        } else {
            // Réinitialisation de la vitesse si le joueur ne bouge pas
            this.player.vitesseActuelle = this.player.vitesseBase;
        }

        this.player.move();
        this.testCollisionsPlayer();
    }

    testCollisionsPlayer() {
        // Teste collision avec les bords du canvas
        this.testCollisionPlayerBordsEcran();

        // Teste collision avec les obstacles
        this.testCollisionPlayerObstacles();
       
    }

    testCollisionPlayerBordsEcran() {
        // Raoppel : le x, y du joueur est en son centre, pas dans le coin en haut à gauche!
        if(this.player.x - this.player.w/2 < 0) {
            // On stoppe le joueur
            this.player.vitesseX = 0;
            // on le remet au point de contaxct
            this.player.x = this.player.w/2;
        }
        if(this.player.x + this.player.w/2 > this.canvas.width) {
            this.player.vitesseX = 0;
            // on le remet au point de contact
            this.player.x = this.canvas.width - this.player.w/2;
        }

        if(this.player.y - this.player.h/2 < 0) {
            this.player.y = this.player.h/2;
            this.player.vitesseY = 0;

        }
       
        if(this.player.y + this.player.h/2 > this.canvas.height) {
            this.player.vitesseY = 0;
            this.player.y = this.canvas.height - this.player.h/2;
        }
    }

    testCollisionPlayerObstacles() {
        this.obstacles.forEach(obj => {
            if(rectsOverlap(this.player.x-this.player.w/2, this.player.y - this.player.h/2, 
                            this.player.w, this.player.h, 
                            obj.x, obj.y, obj.w, obj.h)) {
                // collision
                console.log("Collision avec obstacle");
                this.player.x = 10;
                this.player.y = 10;
                this.player.vitesseX = 0;
                this.player.vitesseY = 0;
            }
        });
    }

    buildLevel(levelNumber) {
        // Vider le niveau actuel
        this.obstacles = [];
        
        // Retirer tous les obstacles précédents des objets graphiques
        this.objetsGraphiques = this.objetsGraphiques.filter(obj => !(obj instanceof Obstacle));
        
        switch(levelNumber) {
            case 1:
                // Niveau 1 - lignes simples + 1 obstacle mobile    
                this.obstacles.push(new Obstacle(0, 100, 600, 80, 'red', 'horizontal'));
                this.obstacles.push(new Obstacle(200, 400, 600, 80, 'red', 'horizontal'));
                this.obstacles.push(new ObstacleMobile(400, 300, 80, 80, 'purple', 200, 0.001));

                break;
            case 2:
                // Niveau 2 - plus de lignes et d'obstacles mobiles
                this.obstacles.push(new Obstacle(200, 100, 600, 80, 'red', 'horizontal'));
                this.obstacles.push(new Obstacle(0, 300, 600, 80, 'red', 'horizontal'));
                this.obstacles.push(new ObstacleMobile(400, 300, 80, 80, 'purple', 300, 0.003));
                this.obstacles.push(new Obstacle(200, 500, 600, 80, 'red', 'horizontal'));
                break;
            case 3:
                // Niveau 3 - labyrinthe avec obstacles mobiles
                this.obstacles.push(new Obstacle(0, 100, 600, 80, 'red', 'horizontal'));
                this.obstacles.push(new Obstacle(150, 300, 650, 80, 'red', 'horizontal'));
                this.obstacles.push(new Obstacle(0, 500, 600, 80, 'red', 'horizontal'));

                this.obstacles.push(new ObstacleMobile(300, 200, 80, 80, 'purple', 200, 0.002));
                this.obstacles.push(new ObstacleMobile(600, 250, 80, 80, 'purple', 150, 0.003));





                break;
        }

        // La sortie est placée en bas à droite avec une couleur plus vive
        this.sortie = new Obstacle(690, 700, 100, 100, '#00FF00'); // Vert vif pour mieux voir
        
        // Ajouter les nouveaux obstacles aux objets graphiques
        this.obstacles.forEach(obstacle => {
            this.objetsGraphiques.push(obstacle);
        });
        
        // Ajouter la sortie aux objets graphiques
        this.objetsGraphiques.push(this.sortie);
    }

    nextLevel() {
        if (this.currentLevel < this.maxLevels) {
            this.currentLevel++;
            this.buildLevel(this.currentLevel);
            
            // Réinitialiser la position et les vitesses du joueur
            this.player.x = 10;
            this.player.y = 10;
            this.player.vitesseX = 0;
            this.player.vitesseY = 0;
            this.player.vitesseActuelle = this.player.vitesseBase;
            
            // S'assurer que le joueur est toujours dans objetsGraphiques
            this.objetsGraphiques = [this.player];
            
            // Rajouter les obstacles et la sortie
            this.obstacles.forEach(obstacle => {
                this.objetsGraphiques.push(obstacle);
            });
            this.objetsGraphiques.push(this.sortie);
            
        } else {
            alert("Félicitations ! Vous avez terminé tous les niveaux !");
            this.currentLevel = 1;
            this.buildLevel(this.currentLevel);
            
            // Même réinitialisation pour le retour au niveau 1
            this.player.x = 10;
            this.player.y = 10;
            this.player.vitesseX = 0;
            this.player.vitesseY = 0;
            this.player.vitesseActuelle = this.player.vitesseBase;
            
            this.objetsGraphiques = [this.player];
            this.obstacles.forEach(obstacle => {
                this.objetsGraphiques.push(obstacle);
            });
            this.objetsGraphiques.push(this.sortie);
        }
    }

    checkCollisionWithExit() {
        // On vérifie que la sortie existe
        if (this.sortie) {
            let collision = rectsOverlap(
                this.player.x - this.player.w/2, 
                this.player.y - this.player.h/2, 
                this.player.w, 
                this.player.h,
                this.sortie.x, 
                this.sortie.y, 
                this.sortie.w, 
                this.sortie.h
            );
            
            if (collision) {
                console.log("Collision avec sortie détectée");
                this.nextLevel();
            }
        }
    }
}