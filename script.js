// On crée l'évènement onload. La fonction javascript sera exécutée quand la fenêtre s'affichera
window.onload = function() {

// on déclare les variables
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    // On crée une variable qui stockera la largeur du canvas en nombre de blocks et non en pixels
    var widthInBlocks = canvasWidth/blockSize;
    // On crée une variable qui stockera la largeur du canvas en nombre de blocks et non en pixels
    var heightInBlocks = canvasHeight/blockSize;
    var ctx;
    var delay = 300; // en milliseconde
    var snakee;
    var applee;
    // On appelle la fonction init()
    init();
    // On crée une fonction d'initialisation
    function init() {

        // On crée une variable qui va contenir  un élément de type canvas
        var canvas = document.createElement('canvas');
        // On crée le canvas
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = '1px solid';
        // On rattache le canvas au body de la page html avec la fonction appendchild()
        document.body.appendChild(canvas);
        // On crée le contexte ctx en 2d
        ctx = canvas.getContext('2d');

        // On instancie l'objet snakee avec les arguments de position en commençant par la tête [6,4]
        snakee = new Snake([[6, 4], [5, 4], [4, 4]], 'right');

        // On instancie l'objet applee avec les arguments de position
        applee = new Apple([10, 10]);


        // On appelle la fonction pour rafraichir le canvas
        refreshCanvas();
    }

    // On crée la fonction refreshCanvas
    function refreshCanvas() {
        // On appelle la fonction advance
        snakee.advance();
        
        // Si la tête de serpent entre en collision
        if (snakee.checkCollision()){
            
            // Game over
            
        } else {
            
        // On rafraichi la position du rectangle
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        // On appelle la méthode draw
        snakee.draw();
        // On appelle la méthode draw
        applee.draw();

        // La fonction setTimeout permet de rappeler la fonction refreshCanvas après le delay de 1s 
        setTimeout(refreshCanvas, delay);           
        }
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
            // On supprime la dernière position du corps du serpent [4,4] avec la fonction pop 
            this.body.pop();
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
        this.checkCollision = function(){
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
            var maxX = widthInBlocks -1; // largeur du canvas - 1 block
            var maxY = heightInBlocks -1; // hauteur du canvas -1 block
            // On vérifie que la tête du serpent n'est pas entre les mur de droite et de gauche
            var isNotBetweenHorizontalWall = snakeX < minX || snakeX > maxX;
            // On vérifie que la tête du serpent n'est pas entre les mur du haut et du bas
            var isNotBetweenVerticalWall = snakeY < minY || snakeY > maxY;
            
            // On vérifie si la la tête de serpent n'est pas entre les murs 
            if(isNotBetweenHorizontalWall || isNotBetweenVerticalWall){
                // il y a une collision
                wallCollision = true;
            }
            
            // On vérifie que le serpent ne s'est pas passé sur le reste du corps   
            for (var i = 0; i < rest.length; i++){
                if (snakeX === rest[i][0] && snakeY === rest[i][1]){
                    snakeCollision = true;
                }
            }
            // 
            return wallCollision || snakeCollision;
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
            var x = position[0] * blockSize + radius;
            // On défini la position y (qui est le centre du rond)
            var y = position[1] * blockSize + radius;
            // On dessine le rond avec la fonction arc, 
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            // On rempli le cercle avec la fonction fill
            ctx.fill();
            // On restore les anciens apramètres de canvas
            ctx.restore();
        };
    }

// On crée l'évènement onkeydown. La fonction handleKeyDown sera éxécutée quand la touche sera appuyée
    document.onkeydown = function handleKeyDown(e) { // e est l'évènement
        var key = e.keyCode; // cela va nous donner le code que la touche va appuyer
        var newDirection;
        switch (key) {
            case 37:
                newDirection = 'left';
                break;
            case 38:
                newDirection = 'up';
                break;
            case 39:
                newDirection = 'right';
                break;
            case 40:
                newDirection = 'down';
                break;
                // Sinon on ne continue pas la fonction, on arrête et on retourne 
            default :
                return;
        }

        snakee.setDirection(newDirection);
    }
}

