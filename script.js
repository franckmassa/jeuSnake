// La fonction javascript va être lancée quand la fenêtre va s'afficher
window.onload = function() {

// on déclare les variables
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100; // en milliseconde
    var snakee;

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

        // On instancie l'objet snakee avec les arguments de position en commençant par la tête
        snakee = new Snake([[6, 4], [5, 4], [4, 4]]);

        // On appelle la fonction pour rafraichir le canvas
        refreshCanvas();
    }

    // On crée la fonction refreshCanvas
    function refreshCanvas() {

        // On rafraichi la position du rectangle
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // On appelle la méthode draw
        snakee.draw();
        // La fonction setTimeout permet de rappeler la fonction refreshCanvas après le delay de 1s 
        setTimeout(refreshCanvas, delay);
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
    function Snake(body) {

        this.body = body;
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
    }
};
