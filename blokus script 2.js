function printMessage(message){
    console.log(message)
}

function createEmptyBoard(width, height) {
    let board = Array(width * height)
    board.fill(0)
}

function canPlacePiece(piece, board) {

}

// Fonction pour faire pivoter une pièce de 90 degrés dans le sens des aiguilles d'une montre
function rotatePiece(piece) {
    const rotated = [];
    for (let x = 0; x < piece[0].length; x++) {
        const newRow = [];
        for (let y = piece.length - 1; y >= 0; y--) {
            newRow.push(piece[y][x]);
        }
        rotated.push(newRow);
    }
    return rotated;
}


document.addEventListener('DOMContentLoaded', () => {
    const mainGrid = document.getElementById('main-grid');
    const playerInfo = document.getElementById('player-info');
    const piecePreview = document.getElementById('piece-preview');
    const pieceList = document.getElementById('piece-list');
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    document.body.appendChild(errorMessage);
    
    // Définition des positions des joueurs et couleurs
    const startPositions = [0, 19, 380, 399]; // Coins de départ
    const playerColors = ['red', 'blue', 'yellow', 'green'];
    const players = {
        1: "red",
        2: "blue",
        3: "yellow",
        4: "green",
    }

    const WIDTH = 20;
    const HEIGHT = 20;

    let currentPlayer = null; // Indique le joueur actuel (0: Rouge, 1: Bleu, 2: Jaune, 3: Vert)
    let currentPiece = null; // Pièce sélectionnée
    let rotatedPiece = null; // Pièce après rotation
    let isFirstMove = [true, true, true, true]; // Suivi du premier mouvement de chaque joueur

    const gridMap = Array(400);
    gridMap.fill(0)


    // Créer la grille principale 20x20
    for (let i = 0; i < WIDTH * HEIGHT; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.dataset.index = i;
        mainGrid.appendChild(cell);
    }

    // Marquer les coins sans pièces avec une couleur plus claire
    startPositions.forEach((pos, index) => {
        const startCell = mainGrid.children[pos];
        startCell.classList.add('start-cell');
        startCell.classList.add(playerColors[index]);
    });

    // Mettre à jour l'affichage des informations du joueur actuel
    function updatePlayerInfo() {
        playerInfo.textContent = `Joueur : ${playerColors[currentPlayer]}`;
    }

    // Définir les pièces disponibles (21 pièces du jeu Blokus)
    const pieces = [
        [[1, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Monomino
        [[1, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Domino
        [[1, 1, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Tromino I
        [[1, 1, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Tromino L
        [[1, 1, 1, 1, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Tetromino I
        [[1, 1, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Tetromino L
        [[1, 1, 1, 0, 0], [0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Tetromino T
        [[1, 1, 0, 0, 0], [0, 1,1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Tetromino Z
        [[1, 1, 0, 0, 0],[1, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Tetromino O
        [[1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Pentomino I
        [[1, 1, 1, 1, 0], [1, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Pentomino L
        [[1, 1, 1, 1, 0], [0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Pentomino T
        [[1, 1, 1, 0, 0], [0, 0, 1, 1, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Pentomino Z
        [[1, 1, 1, 0, 0], [1, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Pentomino U
        [[1, 1, 1, 1, 0], [0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Pentomino F
        [[1, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Pentomino P
        [[0, 0, 1, 0, 0], [ 0, 1, 1, 0, 0], [1, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Pentomino W
        [[0, 1, 0, 0, 0], [1, 1, 1, 0, 0], [0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Pentomino X
        [[1, 0, 0, 0, 0], [1, 1, 1, 0, 0], [0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Pentomino Y
        [[1, 1, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], // Pentomino V
        [[1, 0, 0, 0, 0], [1, 1, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]] // Pentomino Z
    ];

    // Mettre à jour la liste des pièces disponibles pour le joueur
    function updatePieceList() {
        pieceList.innerHTML = '';
        pieces.forEach(piece => {
            const pieceElement = document.createElement('div');
            pieceElement.classList.add('piece');
            pieceElement.style.display = 'grid';
            pieceElement.style.gridTemplateColumns = 'repeat(' + piece[0].length + ', 10px)';
            pieceElement.style.gridTemplateRows = 'repeat(' + piece.length + ', 10px)';

            piece.forEach(row => {
                row.forEach(cell => {
                    const cellDiv = document.createElement('div');
                    cellDiv.style.width = '10px';
                    cellDiv.style.height = '10px';
                    cellDiv.style.backgroundColor = cell ? playerColors[currentPlayer] : 'transparent';
                    pieceElement.appendChild(cellDiv);
                });
            });

            pieceList.appendChild(pieceElement);

            // Ajouter l'événement pour sélectionner la pièce
            pieceElement.addEventListener('click', () => {
                currentPiece = piece;
                rotatedPiece = piece; // Par défaut, la pièce n'est pas modifiée
                renderPiece(rotatedPiece, piecePreview);
                errorMessage.innerHTML = ''; // Réinitialiser le message d'erreur
            });
        });
    }

    updatePieceList(); // Initial update of the piece list
    updatePlayerInfo(); // Mettre à jour les informations du joueur

    // Fonction pour afficher la pièce dans la zone de prévisualisation
    function renderPiece(piece, container) {
        container.innerHTML = ''; // Vider la zone avant de redessiner
        piece.forEach(row => {
            row.forEach(cell => {
                const cellDiv = document.createElement('div');
                cellDiv.style.width = '10px';
                cellDiv.style.height = '10px';
                cellDiv.style.backgroundColor = cell ? playerColors[currentPlayer] : 'transparent';
                container.appendChild(cellDiv);
            });
        });
    }

    // Fonction pour retourner une pièce (en miroir horizontal)
    function flipPiece(piece) {
        return piece.map(row => row.reverse());
    }

    // Vérifier si une pièce peut être placée sur la grille
    function canPlacePiece(piece, startIndex) {
        const startX = startIndex % WIDTH;
        const startY = Math.floor(startIndex / HEIGHT);
        
        for (let y = 0; y < piece.length; y++) {
            for (let x = 0; x < piece[0].length; x++) {
                if (piece[y][x]) {
                    const targetIndex = (startY + y) * 20 + (startX + x);
                    if (targetIndex < 0 || targetIndex >= 400 || mainGrid.children[targetIndex].style.backgroundColor !== 'transparent') {
                        return false; // L'emplacement est invalide
                    }
                }
            }
        }
        return true; // L'emplacement est valide
    }

    // Fonction pour vérifier si le coin de la pièce touche un autre coin de la même couleur
    function isValidPlacementForPlayer(piece, startIndex) {
        const startX = startIndex % 20;
        const startY = Math.floor(startIndex / 20);
        
        if (isFirstMove[currentPlayer]) {
            // Vérifier si la pièce touche le coin de départ du joueur
            return piece[0][0] && mainGrid.children[startIndex].classList.contains(playerColors[currentPlayer]);
        } else {
            // Vérifier si un coin de la pièce touche un autre coin de la même couleur
            return true; // Conditions de placement plus avancées ici
        }
    }

    // Gérer le placement des pièces sur la grille
    mainGrid.addEventListener('click', (event) => {
        if (currentPiece) {
            const cellIndex = event.target.dataset.index;
            if (cellIndex !== undefined) {
                const canPlace = canPlacePiece(rotatedPiece, parseInt(cellIndex)) && isValidPlacementForPlayer(rotatedPiece, parseInt(cellIndex));
                if (canPlace) {
                    // Placer la pièce sur la grille
                    for (let y = 0; y < rotatedPiece.length; y++) {
                        for (let x = 0; x < rotatedPiece[0].length; x++) {
                            if (rotatedPiece[y][x]) {
                                const targetIndex = (Math.floor(cellIndex / 20) + y) * 20 + (parseInt(cellIndex) % 20 + x);
                                mainGrid.children[targetIndex].style.backgroundColor = playerColors[currentPlayer];
                            }
                        }
                    }
                    isFirstMove[currentPlayer] = false; // Le joueur n'est plus au premier tour
                    currentPlayer = (currentPlayer + 1) % 4; // Passer au joueur suivant
                    updatePlayerInfo();
                    errorMessage.innerHTML = ''; // Réinitialiser le message d'erreur
                } else {
                    alert("Placement incorrect"); // Message d'erreur
                }
            }
        }
    });

    // Gérer la rotation et le retournement avec les flèches du clavier
    document.addEventListener('keydown', (event) => {
        if (currentPiece) {
            if (event.key === 'ArrowRight') {
                rotatedPiece = rotatePiece(rotatedPiece); // Rotation à droite
                renderPiece(rotatedPiece, piecePreview);
            }
            if (event.key === 'ArrowLeft') {
                rotatedPiece = rotatePiece(rotatedPiece); // Rotation à gauche
                renderPiece(rotatedPiece, piecePreview);
            }
            if (event.key === 'ArrowDown') {
                rotatedPiece = flipPiece(rotatedPiece); // Retournement de la pièce
                renderPiece(rotatedPiece, piecePreview);
            }
        }
    });
}); 