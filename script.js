// On crée l'évènement onload. La fonction javascript sera exécutée quand la fenêtre s'affichera
window.onload = function() {

// on déclare les variables
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    // On crée une variable qui stockera la largeur du canvas en nombre de blocks et non en pixels
    var widthInBlocks = canvasWidth / blockSize;
    // On crée une variable qui stockera la largeur du canvas en nombre de blocks et non en pixels
    var heightInBlocks = canvasHeight / blockSize;
    var ctx;
    var delay = 100; // en milliseconde
    var snakee;
    var applee;
    var score;
    // On appelle la fonction init()
    init();
    // On crée une fonction d'initialisation 
    function init() {

        // On crée une variable qui va contenir  un élément de type canvas
        var canvas = document.createElement('canvas');
        // On crée le canvas
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // On donne du style au jeu avec le css
        canvas.style.border = '30px solid grey';
        canvas.style.margin = '50px auto';
        canvas.style.display = 'block';
        canvas.style.backgroundColor = '#ddd';
        // On rattache le canvas au body de la page html avec la fonction appendchild()
        document.body.appendChild(canvas);
        // On crée le contexte ctx en 2d
        ctx = canvas.getContext('2d');

        // On instancie l'objet snakee avec les arguments de position en commençant par la tête [6,4]
        snakee = new Snake([[6, 4], [5, 4], [4, 4], [3, 4], [2, 4]], 'right');

        // On instancie l'objet applee avec les arguments de position
        applee = new Apple([10, 10]);

        // On initialise la variable score à 0
        score = 0;
        // On appelle la fonction pour rafraichir le canvas
        refreshCanvas();
    }

    // On crée la fonction refreshCanvas
    function refreshCanvas() {
        // On appelle la fonction advance
        snakee.advance();

        // Si la tête de serpent entre en collision
        if (snakee.checkCollision()) {
            gameOver();
        } else {
            // Si le serpent à manger la pomme on va placer la pomme à un nouvel endroit
            if (snakee.isEatingApple(applee)) {

                // On incremente le score avec nombre de pommes mangées
                // On initialise la variable score à 0
                score++;
                // Le serpent a mangé une pomme
                snakee.ateApple = true;
                // On donne une nouvelle position à la pomme tant qu'elle est sur le serpent 
                do {
                    applee.setNewPosition();
                } while (applee.isOnSnake(snakee))
            }

            // On rafraichi la position du rectangle
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            /* On appelle la fonction draw.score avant snakee.draw et applee.draw 
             * pour que l'affichage du score soit en arrière plan
             */
            drawScore();

            // On appelle la méthode draw
            snakee.draw();
            // On appelle la méthode draw
            applee.draw();
            // La fonction setTimeout permet de rappeler la fonction refreshCanvas après le delay de 1s 
            setTimeout(refreshCanvas, delay);
        }
    }
    // création de la function gamOver
    function gameOver() {
        ctx.save();

        // On donne du style à la police avec le css
        ctx.font = 'bold 70px sans-serif';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        // On centre les caractères par rapport à leur milieu
        ctx.textBaseline = 'middle';
        // On utilise la fonction stokeStyle pour faire un cadre
        ctx.strokeStyle = 'white';
        ctx.lineWidth = '5';
        // On calcule le centre du canvas
        var centerX = canvasWidth / 2;
        var centerY = canvasHeight / 2;
        // On rempli le texte avec la fonction strokeText , centré horizontalement et verticalement avec un retrait de 180px
        ctx.strokeText('Game Over', centerX, centerY - 230);
        // On ecrit le texte centré horizontalement et verticalement avec un retrait de 180px
        ctx.fillText('Game Over', centerX, centerY - 230);
        ctx.font = 'bold 30px sans-serif';
        // On rempli le texte avec la fonction strokeText , centré horizontalement et verticalement avec un retrait de 120px
        ctx.strokeText('Appuyer sur la touche Espace pour rejouer', centerX, centerY - 170);
        // On ecrit le texte centré horizontalement et verticalement avec un retrait de 120px
        ctx.fillText('Appuyer sur la touche Espace pour rejouer', centerX, centerY - 170);

        ctx.restore();
    }
    // On crée la fonction restart avec un nouveau serpent
    function restart() {
        // On instancie l'objet snakee avec les arguments de position en commençant par la tête [6,4]
        snakee = new Snake([[6, 4], [5, 4], [4, 4], [3, 4], [2, 4]], 'right');

        // On instancie l'objet applee avec les arguments de position
        applee = new Apple([10, 10]);

        // On initialise la variable score à 0
        score = 0;

        // On appelle la fonction pour rafraichir le canvas
        refreshCanvas();

    }
    // On crée une fonction pour afficher le score
    function drawScore() {
        ctx.save();

        // On donne du style à la police avec le css
        ctx.font = 'bold 200px sans-serif';
        ctx.fillStyle = 'grey';
        ctx.textAlign = 'center';
        // On centre les caractères par rapport à leur milieu
        ctx.textBaseline = 'middle';

        // On calcule le centre du canvas
        var centerX = canvasWidth / 2;
        var centerY = canvasHeight / 2;
        // On ecrit le nombre du score sous format string avec la fonction toString et on centre sur le canvas
        ctx.fillText(score.toString(), centerX, centerY);

        ctx.restore();

    }

    // On crée la fonction drawBlock pour dessiner un block
    function drawBlock(ctx, position) {
        // La coordonnées x est égal à la position (nombre de block) * la taille du block
        var x = position[0] * blockSize; // horizontal:  6 * 30px = 180px (tête); 150px(milieu); 120px(queue) 
        var y = position[1] * blockSize; // Vertical: 4 * 30px = 120px (tête, milieu, queue)

        // Définition du block
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    // On crée une fonction construsteur snake
    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;
        // On rajoute une propriété pour la pomme mangée
        this.ateApple = false; // false pour éviter que le serpent grandisse tout de suite (true par défaut)
        // On crée la méthode draw pour dessiner le serpent
        this.draw = function() {
            // On sauvegarde le context avant de dessiner 
            ctx.save();
            ctx.fillStyle = '#ff0000';
            /* On crée une boucle pour dessiner le serpent.
             Tant que i < au nombre de blocks caractérisant le corps du serpent, on ajoute un block
             */
            for (var i = 0; i < this.body.length; i++) {
                // On crée une fonction qui dessine un block en gardant le context et la position du block
                drawBlock(ctx, this.body[i]);
            }

            // On utilse la fonction restore qui permet de remettre le context comme il était avant
            ctx.restore();
        };

        // On crée la méthode pour faire avancer le serpent
        this.advance = function() {
            /* Avec la fonction slice, on copie le 1er élément (tête du serpent) [6,4] qui correspond 
             * à la position 0 du tableau Snake 
             */
            var nextPosition = this.body[0].slice(); // le nextPosition c'est le [6,4]

            // On fait avancer le nextPosition 
            switch (this.direction) {
                case 'right':
                    nextPosition[0] += 1; // 0 étant la position x (exemple: [x, y]
                    break;
                case 'left':
                    nextPosition[0] -= 1;
                    break;
                case 'down':
                    nextPosition[1] += 1; // 1 étant la position y (exemple: [x, y]
                    break;
                case 'up':
                    nextPosition[1] -= 1;
                    break;
                    // sinon, la fonction throw permet d'afficher un message d'erreur 
                default :
                    throw('Invalid direction');
            }
            // On colle à la 1ère place du corps du serpent le nextPosition ce qui donne  Snake([[7,4], [6, 4], [5, 4], [4, 4]])
            this.body.unshift(nextPosition);
            // Si le serpent n'a pas mangé de pomme
            if (!this.ateApple) {
                // On supprime la dernière position du corps du serpent [4,4] avec la fonction pop 
                this.body.pop();
            } else {
                this.ateApple = false;
            }
        };

        // on crée une méthode pour les nouvelles directions permises
        this.setDirection = function(newDirection) {
            // On déclare une variable direction permise
            var allowedDirections;
            // On crée les conditions pour les directions permises
            switch (this.direction) {
                case 'left':
                case 'right':
                    allowedDirections = ['up', 'down']; // up est en position 0 (> -1) et down est en position 1 (> -1)
                    break;
                case 'down':
                case 'up':
                    allowedDirections = ['left', 'right']; // left est en position 0 (> -1) et right est en position 1 (> -1)
                    break;
                    // sinon, la fonction throw permet d'afficher un message d'erreur 
                default :
                    throw ('Invalid direction');
            }
            // Si l'index de la nouvelle direction dans la variable allowedDirection est > -1, alors elle est permise
            if (allowedDirections.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            }
        };

        // On crée une méthode control collision du serpent avec un mur (canvas) ou avec lui-même
        this.checkCollision = function() {
            // On initialise à false 
            var wallCollision = false;
            var snakeCollision = false;
            // On vérifie la collision de la tête car elle qui touche en premier
            var head = this.body[0]; // 0 étant la position du block tête ([[6,4], [5,4], ----]])

            /* La fonction slice permet de copier et de passer le 0 (avec la valeur 1)
             pour mettre le rest de corps dans la variable rest */
            var rest = this.body.slice(1);

            var snakeX = head[0]; // 0 étant la position du x du block
            var snakeY = head[1]; // 1 étant la position du y du block
            var minX = 0; // On initialise la valeur du mur de gauche à 0
            var minY = 0; // On initialise la valeur du mur du haut à 0
            var maxX = widthInBlocks - 1; // largeur du canvas - 1 block
            var maxY = heightInBlocks - 1; // hauteur du canvas -1 block
            // On vérifie que la tête du serpent n'est pas entre les mur de droite et de gauche
            var isNotBetweenHorizontalWall = snakeX < minX || snakeX > maxX;
            // On vérifie que la tête du serpent n'est pas entre les mur du haut et du bas
            var isNotBetweenVerticalWall = snakeY < minY || snakeY > maxY;

            // On vérifie si la la tête de serpent n'est pas entre les murs 
            if (isNotBetweenHorizontalWall || isNotBetweenVerticalWall) {
                // il y a une collision
                wallCollision = true;
            }

            // On vérifie que le serpent ne s'est pas passé sur le reste du corps   
            for (var i = 0; i < rest.length; i++) {
                if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
                    snakeCollision = true;
                }
            }
            // 
            return wallCollision || snakeCollision;
        };

        // On crée une methode  le serpent mang t-il une pomme?
        this.isEatingApple = function(appleToEat) {
            // On crée une variable head qui contient la position x de la tête 
            var head = this.body[0]; // 0 étant le x de la tête
            // Si la position de la tête du serpent a la même position que la pomme
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
                // Le serpent a manger la pomme
                return true;
            } else {
                return false;
            }
        };
    }

    // On crée une fonction construsteur apple
    function Apple(position) {
        this.position = position;
        // création de la méthode pour dessiner la pomme
        this.draw = function() {

            // on enregistre les anciens paramètres de canvas
            ctx.save();
            ctx.fillStyle = '#33cc33';
            ctx.beginPath();
            // Le rond va prendre la moitié d'un blockSize
            var radius = blockSize / 2;
            // On défini la position x (qui est le centre du rond)
            var x = this.position[0] * blockSize + radius;
            // On défini la position y (qui est le centre du rond)
            var y = this.position[1] * blockSize + radius;
            // On dessine le rond avec la fonction arc, 
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            // On rempli le cercle avec la fonction fill
            ctx.fill();
            // On restore les anciens apramètres de canvas
            ctx.restore();
        };

        // on crée une méthode pour donner une nouvelle position à la pomme, de façon aléatoire et avec un nombre entier
        this.setNewPosition = function() {
            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            // On donne la nouvelle position
            this.position = [newX, newY];
        };

        // on crée une méthode pour voir si la nouvelle position de la pomme est sur le serpent 
        this.isOnSnake = function(snakeToCheck) {
            // On initialise la variable isOSnake à false (pas sur le serpent)
            var isOnSnake = false;
            // on crée une boucle pour passer sur tout le corps du serpent   
            for (var i = 0; i < snakeToCheck.body.length; i++) {
                // i étant le block du serpent et 0  le x et 1 le y du block 
                if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                    // la pomme est sur le serpent
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };

    }

    // On crée l'évènement onkeydown. La fonction handleKeyDown sera éxécutée quand la touche sera appuyée
    document.onkeydown = function handleKeyDown(e) { // e est l'évènement
        var key = e.keyCode; // cela va nous donner le code que la touche va appuyer
        var newDirection;
        switch (key) {
            case 37: // Flèche gauche
                newDirection = 'left';
                break;
            case 38: // Flèche haut
                newDirection = 'up';
                break;
            case 39: // Flèche droite
                newDirection = 'right';
                break;
            case 40: // Flèche bas
                newDirection = 'down';
                break;
            case 32: // Barre Espace
                restart();
                return;
                // Sinon on ne continue pas la fonction, on arrête et on retourne 
            default :
                return;
        }

        snakee.setDirection(newDirection);
    };
};

