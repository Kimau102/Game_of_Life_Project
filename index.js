const unitLength  = 27;
// const unitLength  = 20;
const strokeColor = 50;
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */
let currentBoard;
let nextBoard;
let fr = 10;
let boxColorSlider;
let x = 1;
let y = 0;
let moveBackward;
let moveBackwardRow;
let moveObjCheck = false; //air-plain for keypress checking if true can using keyboard
// let checkOjtStart = false;
let checkStart = false; // check if is click start button before running setinterval obj
// let checkStop = false;
let checkGenerate = false; //check generate() if it is true then run
let startPage = false;
let setIntervalSpeed = 100;

setInterval(() => {
    if (startPage == true) {
        if (checkStart == true) {
            currentBoard[moveBackward][moveBackwardRow] = 0;
            currentBoard[moveBackward][moveBackwardRow + 1] = 0;
            currentBoard[moveBackward + 1][moveBackwardRow] = 0;
            currentBoard[moveBackward + 1][moveBackwardRow + 1] = 0;
            moveBackward -= 1;
            currentBoard[moveBackward][moveBackwardRow] = 1;
            currentBoard[moveBackward][moveBackwardRow + 1] = 1;
            currentBoard[moveBackward + 1][moveBackwardRow] = 1;
            currentBoard[moveBackward + 1][moveBackwardRow +1] = 1;
            if (currentBoard[x + 12][y + 7] == 1) {
                init();
                noLoop();
                gameOver();
                setIntervalSpeed = 100;
                moveObjCheck = false;
                checkStart = false;
                checkGenerate = false; //false as hit the obstacle wont cause game over pattern change at game over page
                startPage = false;
            }
            if (moveBackward == 0) {
                currentBoard[moveBackward][moveBackwardRow] = 0;
                currentBoard[moveBackward][moveBackwardRow + 1] = 0;
                currentBoard[moveBackward + 1][moveBackwardRow] = 0;
                currentBoard[moveBackward + 1][moveBackwardRow + 1] = 0;
                moveBackward = 40;
                moveBackwardRow = Math.floor(Math.random() * 17 + 1);
                if (setIntervalSpeed > 60) {
                    setIntervalSpeed -= 50;
                }
                if (setIntervalSpeed < 60 && setIntervalSpeed >= 20) {
                    setIntervalSpeed -= 10;
                }
            }
        }
    }
}, setIntervalSpeed);

function setup(){
    /* Create Slider for controlling */
    const barCanvas1 = createCanvas(windowWidth - 100, windowHeight - 220);
    barCanvas1.parent(document.querySelector('#slider-bar1'))
    const barCanvas2 = createCanvas(windowWidth - 100, windowHeight - 220);
    barCanvas2.parent(document.querySelector('#slider-bar2'))
    fr = createSlider(0, 20, 10);
    fr.position(0, 5, 'relative');
    fr.style('width', '80px')
    boxColorSlider = createSlider(0, 200, 150);
    boxColorSlider.position(0, 5, 'relative');
    fr.parent(document.querySelector('#slider-bar1'));
    boxColorSlider.parent(document.querySelector('#slider-bar2'));

	/* Set the canvas to be under the element #canvas*/
	const canvas = createCanvas(windowWidth - 100, windowHeight - 220);
	canvas.parent(document.querySelector('#canvas'));
    // canvas.mouseOver(onElement);
    // canvas.mouseOut(outElement);


	/*Calculate the number of columns and rows */
	columns = floor(width  / unitLength);
	rows    = floor(height / unitLength);
	
	/*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
	currentBoard = [];
	nextBoard = [];
	for (let i = 0; i < columns; i++) {
		currentBoard[i] = [];
		nextBoard[i] = []
    }
	// Now both currentBoard and nextBoard are array of array of undefined values.
    // console.log(columns, rows)
    init();  // Set the initial values of the currentBoard and nextBoard
    noLoop();
}


// // let someVariables = <condictions> : <when_true> : <when_false>;
// currentBoard[i][j] = random() > 0.8 ? 1 : 0; // one line if
// nextBoard[i][j] = 0;

function draw() {
    let frSpeed = fr.value();
    let colorValue = boxColorSlider.value();
    // generate();
    frameRate(frSpeed);
    // console.log(frameCount)
    if (checkGenerate == true) {
        generate();
    }
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == 1){
                fill(colorValue);  
            } else {
                fill(255);
            } 
            stroke(strokeColor);
            rect(i * unitLength, j * unitLength, unitLength, unitLength);
        }
    }
    if (keyIsPressed) {
        if (moveObjCheck == true && keyCode === 38) {
            if (y >= -5 && y <= 5) {
                y -= 1;
                moveObj();
                loop();
                // console.log('UP');
            }
            if (y == -6 || y == 6) {
                y += 1;
            }
            // y -= 1;
            // moveObj();
            // loop();
            // console.log('UP');
        } else if (moveObjCheck == true && keyCode === 40) {
            if (y >= -5 && y <= 5) {
                y += 1;
                moveObj();
                loop();
                // console.log('DOWN')
            }
            if (y == -6 || y == 6) {
                y -= 1;
            }
            // y += 1;
            // moveObj();
            // loop();
            // console.log('DOWN')
        } else if (moveObjCheck == true && keyCode === 37) {
            if (x > 0) {
                x -= 1;
                moveObj();
                loop();
            }
            // console.log('LEFT')
        } else if (moveObjCheck == true && keyCode === 39) {
            if (x < 25) {
                x += 1;
                moveObj();
                loop();
                // console.log('RIGHT');
            }
        }
    }
}


/**
* Initialize/reset the board state
*/
function init() {
	for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
			currentBoard[i][j] = 0;
			nextBoard[i][j] = 0;
		}
	}
}

function generate() {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if( i == 0 && j == 0 ){
	                    // the cell itself is not its own neighbor
	                    continue;
	                }
                    // The modulo operator is crucial for wrapping on the edge
                    neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
                }
            }
            // Rules of Life
            if (currentBoard[x][y] == 1 && neighbors < 2) {
                // Die of Loneliness
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 1 && neighbors > 3) {
                // Die of Overpopulation
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && neighbors == 3) {
                // New life due to Reproduction
                nextBoard[x][y] = 1;
            } else {
                // Stasis
                nextBoard[x][y] = currentBoard[x][y];
            }
        }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}


/**
 * When mouse is dragged
 */

// var vle = '';
function mouseDragged() {
    // noLoop();
    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    currentBoard[x][y] = 1;
    let colorValue = boxColorSlider.value();
    // console.log(x, y);
    // vle += 'currentBoard[x + ' + x + '][y + '+ y + '] = 1;<br />';
    // document.querySelector('#getElement').innerHTML = vle;
    fill(colorValue);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
}
/**
 * When mouse is pressed
 */
function mousePressed() {
    mouseDragged();
}

// /**
//  * When mouse is released
//  */
// function mouseReleased() {
//     loop();
// }




function teckyMovement() {
    init();
    loop();
    document.querySelector('.hiddenContent').innerHTML = "<span> Press START button to auto generate!!</span>";
    moveObjCheck = false;
    checkStart = false;
    checkGenerate = false; //false as hit the obstacle wont cause game over pattern change at game over page
    startPage = false;
    let x = 10;
    let y = -8; //202301161549
    currentBoard[x + 2][y + 21] = 1;//202301161549
    currentBoard[x + 2][y + 22] = 1;//202301161549
    currentBoard[x + 3][y + 21] = 1;//202301161549
    currentBoard[x + 3][y + 22] = 1;//202301161549
    currentBoard[x + 3][y + 11] = 1;//202301161549
    currentBoard[x + 3][y + 12] = 1;//202301161549
    currentBoard[x + 4][y + 11] = 1;//202301161549
    currentBoard[x + 4][y + 12] = 1;//202301161549
    currentBoard[x + 9][y + 17] = 1;
    currentBoard[x + 9][y + 16] = 1
    currentBoard[x + 9][y + 15] = 1;
    currentBoard[x + 10][y + 16] = 1;
    currentBoard[x + 10][y + 17] = 1;
    currentBoard[x + 10][y + 18] = 1;
    currentBoard[x + 10][y + 14] = 1;
    currentBoard[x + 11][y + 18] = 1;
    currentBoard[x + 12][y + 17] = 1;
    currentBoard[x + 13][y + 17] = 1;
    currentBoard[x + 12][y + 13] = 1;
    currentBoard[x + 12][y + 12] = 1;
    currentBoard[x + 13][y + 12] = 1;
    currentBoard[x + 13][y + 11] = 1;
    currentBoard[x + 14][y + 12] = 1;
    currentBoard[x + 13][y + 14] = 1;
    currentBoard[x + 13][y + 15] = 1;
    currentBoard[x + 14][y + 15] = 1;
    currentBoard[x + 14][y + 16] = 1;
    currentBoard[x + 15][y + 14] = 1;
    currentBoard[x + 15][y + 13] = 1;
    currentBoard[x + 14][y + 19] = 1;
    currentBoard[x + 15][y + 19] = 1;
    currentBoard[x + 15][y + 18] = 1;
    currentBoard[x + 16][y + 17] = 1;
    currentBoard[x + 17][y + 16] = 1;
    currentBoard[x + 17][y + 17] = 1;
    currentBoard[x + 17][y + 18] = 1;
    currentBoard[x + 18][y + 17] = 1;
    currentBoard[x + 19][y + 18] = 1;
    currentBoard[x + 20][y + 18] = 1;
    currentBoard[x + 21][y + 18] = 1;
    currentBoard[x + 20][y + 17] = 1;
    currentBoard[x + 15][y + 20] = 1;
    currentBoard[x + 16][y + 20] = 1;
    currentBoard[x + 16][y + 21] = 1;
    currentBoard[x + 17][y + 23] = 1;
    currentBoard[x + 18][y + 21] = 1;
    currentBoard[x + 18][y + 24] = 1;
    currentBoard[x + 19][y + 24] = 1;
    currentBoard[x + 20][y + 24] = 1;
    currentBoard[x + 20][y + 23] = 1;
    currentBoard[x + 21][y + 23] = 1;
    currentBoard[x + 21][y + 22] = 1;
    currentBoard[x + 22][y + 22] = 1;
    currentBoard[x + 20][y + 14] = 1;
    currentBoard[x + 20][y + 13] = 1;
    currentBoard[x + 21][y + 13] = 1;
    currentBoard[x + 22][y + 12] = 1;
    currentBoard[x + 22][y + 11] = 1;
    currentBoard[x + 24][y + 10] = 1;
    currentBoard[x + 24][y + 9] = 1;
    currentBoard[x + 24][y + 9] = 1;
    currentBoard[x + 24][y + 8] = 1;
    currentBoard[x + 25][y + 9] = 1;
    currentBoard[x + 25][y + 10] = 1;
    currentBoard[x + 26][y + 9] = 1;
    currentBoard[x + 26][y + 11] = 1;
    currentBoard[x + 27][y + 10] = 1;
    currentBoard[x + 28][y + 10] = 1;
    currentBoard[x + 28][y + 11] = 1;
    currentBoard[x + 27][y + 11] = 1;
    currentBoard[x + 27][y + 12] = 1;
    currentBoard[x + 23][y + 15] = 1;
    noLoop();
    moveObjCheck = false;
};



document.querySelector('#teckyMovement').addEventListener('click', teckyMovement);

document.querySelector('#stop-game').addEventListener('click', function() {
    // noLoop();
    // moveObjCheck = false;
    // checkGenerate = false;
    // // checkStop = false;
    loop();
    noLoop();
    checkGenerate = false;
    moveObjCheck = true;
    checkStart = false;
})

document.querySelector('#start-game').addEventListener('click', function() {
    loop();
    checkGenerate = true;
    checkStart = true;
})

document.querySelector('#my-action').addEventListener('click', function() {
    loop();
    noLoop();
    moveObj();
    obstacle();
    checkGenerate = false; // false as hit the obstacle wont cause game over pattern change at game over page
    moveObjCheck = true;
    startPage = true;
    checkStart = false; // when start click here, screen obstacle not move but actually move
    document.querySelector('.hiddenContent').innerHTML = "<span> Press START button to play dodge obstacle!!</span>";
});

document.querySelector('#reset-game').addEventListener('click', function() {
    init();
    loop();
    noLoop();
    // checkGenerate = false;
    // moveObjCheck = false;
    // checkStart = false;
    moveObjCheck = false;
    checkStart = false;
    checkGenerate = false; //false as hit the obstacle wont cause game over pattern change at game over page
    startPage = false;
    document.querySelector('.hiddenContent').innerHTML = "";
});

document.querySelector('#randomGenerate').addEventListener('click', function() {
    init();
    loop();
    noLoop();
    moveObjCheck =false;
    checkGenerate = false; // false as hit the obstacle wont cause game over pattern change at game over page
    checkStart = false; // when start click here, screen obstacle not move but actually move
    startPage = false;
    randomGenerate();
    document.querySelector('.hiddenContent').innerHTML = "";
})

// document.querySelector('#testing').addEventListener('click', function() {
//     obstacle();
// });

function moveObj() {
    init();
    // loop();
    currentBoard[x + 5][y + 4] = 1;
    currentBoard[x + 5][y + 5] = 1;
    currentBoard[x + 5][y + 6] = 1;
    currentBoard[x + 5][y + 8] = 1;
    currentBoard[x + 5][y + 9] = 1;
    currentBoard[x + 5][y + 10] = 1;
    currentBoard[x + 8][y + 7] = 1;
    currentBoard[x + 9][y + 6] = 1;
    currentBoard[x + 10][y + 6] = 1;
    currentBoard[x + 9][y + 8] = 1;
    currentBoard[x + 10][y + 8] = 1;
    currentBoard[x + 11][y + 7] = 1;
}

function obstacle() {
    moveBackward = 43;
    moveBackwardRow = Math.floor(Math.random() * 12 + 1);
    // loop();
    currentBoard[moveBackward][moveBackwardRow] = 1;
    currentBoard[moveBackward][moveBackwardRow +1] = 1;
    currentBoard[moveBackward + 1][moveBackwardRow] = 1;
    currentBoard[moveBackward + 1][moveBackwardRow + 1] = 1;
}

function onElement() {
    // noLoop();
};

function outElement() {
    // loop();
};

function gameOver() {
    currentBoard[5 + 2][5 + 0] = 1;
    currentBoard[5 + 1][5 + 0] = 1;
    currentBoard[5 + 1][5 + 0] = 1;
    currentBoard[5 + 0][5 + 1] = 1;
    currentBoard[5 + 0][5 + 2] = 1;
    currentBoard[5 + 1][5 + 3] = 1;
    currentBoard[5 + 2][5 + 3] = 1;
    currentBoard[5 + 2][5 + 3] = 1;
    currentBoard[5 + 2][5 + 3] = 1;
    currentBoard[5 + 2][5 + 2] = 1;
    currentBoard[5 + 4][5 + 1] = 1;
    currentBoard[5 + 4][5 + 2] = 1;
    currentBoard[5 + 4][5 + 2] = 1;
    currentBoard[5 + 4][5 + 3] = 1;
    currentBoard[5 + 5][5 + 3] = 1;
    currentBoard[5 + 5][5 + 3] = 1;
    currentBoard[5 + 5][5 + 1] = 1;
    currentBoard[5 + 6][5 + 1] = 1;
    currentBoard[5 + 6][5 + 2] = 1;
    currentBoard[5 + 6][5 + 3] = 1;
    currentBoard[5 + 7][5 + 3] = 1;
    currentBoard[5 + 9][5 + 1] = 1;
    currentBoard[5 + 9][5 + 2] = 1;
    currentBoard[5 + 9][5 + 3] = 1;
    currentBoard[5 + 10][5 + 1] = 1;
    currentBoard[5 + 10][5 + 1] = 1;
    currentBoard[5 + 11][5 + 1] = 1;
    currentBoard[5 + 11][5 + 2] = 1;
    currentBoard[5 + 11][5 + 3] = 1;
    currentBoard[5 + 11][5 + 3] = 1;
    currentBoard[5 + 12][5 + 1] = 1;
    currentBoard[5 + 13][5 + 1] = 1;
    currentBoard[5 + 13][5 + 2] = 1;
    currentBoard[5 + 13][5 + 2] = 1;
    currentBoard[5 + 13][5 + 3] = 1;
    currentBoard[5 + 15][5 + 1] = 1;
    currentBoard[5 + 15][5 + 1] = 1;
    currentBoard[5 + 16][5 + 0] = 1;
    currentBoard[5 + 16][5 + 0] = 1;
    currentBoard[5 + 17][5 + 0] = 1;
    currentBoard[5 + 18][5 + 1] = 1;
    currentBoard[5 + 18][5 + 1] = 1;
    currentBoard[5 + 18][5 + 1] = 1;
    currentBoard[5 + 17][5 + 1] = 1;
    currentBoard[5 + 16][5 + 1] = 1;
    currentBoard[5 + 15][5 + 2] = 1;
    currentBoard[5 + 15][5 + 2] = 1;
    currentBoard[5 + 15][5 + 2] = 1;
    currentBoard[5 + 16][5 + 3] = 1;
    currentBoard[5 + 17][5 + 3] = 1;
    currentBoard[5 + 18][5 + 3] = 1;
    currentBoard[5 + 21][5 + 1] = 1;
    currentBoard[5 + 21][5 + 2] = 1;
    currentBoard[5 + 22][5 + 3] = 1;
    currentBoard[5 + 23][5 + 3] = 1;
    currentBoard[5 + 24][5 + 2] = 1;
    currentBoard[5 + 24][5 + 2] = 1;
    currentBoard[5 + 24][5 + 2] = 1;
    currentBoard[5 + 24][5 + 1] = 1;
    currentBoard[5 + 24][5 + 0] = 1;
    currentBoard[5 + 23][5 + 0] = 1;
    currentBoard[5 + 22][5 + 0] = 1;
    currentBoard[5 + 24][5 + 0] = 1;
    currentBoard[5 + 24][5 + 0] = 1;
    currentBoard[5 + 24][5 + 0] = 1;
    currentBoard[5 + 26][5 + 0] = 1;
    currentBoard[5 + 26][5 + 1] = 1;
    currentBoard[5 + 26][5 + 2] = 1;
    currentBoard[5 + 27][5 + 3] = 1;
    currentBoard[5 + 28][5 + 2] = 1;
    currentBoard[5 + 28][5 + 1] = 1;
    currentBoard[5 + 28][5 + 0] = 1;
    currentBoard[5 + 30][5 + 1] = 1;
    currentBoard[5 + 31][5 + 0] = 1;
    currentBoard[5 + 32][5 + 0] = 1;
    currentBoard[5 + 33][5 + 1] = 1;
    currentBoard[5 + 32][5 + 1] = 1;
    currentBoard[5 + 30][5 + 2] = 1;
    currentBoard[5 + 31][5 + 3] = 1;
    currentBoard[5 + 32][5 + 3] = 1;
    currentBoard[5 + 31][5 + 1] = 1;
    currentBoard[5 + 33][5 + 3] = 1;
    currentBoard[5 + 35][5 + 0] = 1;
    currentBoard[5 + 35][5 + 1] = 1;
    currentBoard[5 + 35][5 + 2] = 1;
    currentBoard[5 + 35][5 + 3] = 1;
    currentBoard[5 + 36][5 + 1] = 1;
    currentBoard[5 + 36][5 + 1] = 1;
    currentBoard[5 + 37][5 + 0] = 1;
}


function randomGenerate() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = random() > 0.8 ? 1 : 0; // one line if
            nextBoard[i][j] = 0;
        }
    }
}