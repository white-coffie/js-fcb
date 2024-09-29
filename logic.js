// variables - storage of values (ex. board)
let board;
let score = 0;
let rows = 4;
let columns = 4;

// This variables will be used to monitor if the user already won once in the value of 2048, 4096, or 8192
// If one of these variables value became true, it means the player already won once in specific values
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;
// once these initial states became true, there's no need to congratulate the user once it happens again.


function setGame() {
	board = [
		[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
	]; 
	//this board is the representation
	//-will be used as the backend board-
	//to design and modify the tiles of the frontend board

	for(let r = 0; r<rows; r++) {
		for(let c=0; c<columns; c++) {

			// creates a div element
			let tile = document.createElement("div");

			// assign an id based on the position of the tile
			tile.id = r.toString() + "-" + c.toString();

			// retrieves the number of the tile from the backend board
			// board [0][1]
			let num = board[r][c];

			// called the function updateTile below
			updateTile(tile, num);
			document.getElementById("board").append(tile);
		}
	}
	setTwo();
	setTwo();
}

// this function is to update the colore of the tile based on
// its num value
function updateTile(tile, num) {
	tile.innerText = "";
	tile.classList.value = "";

	// <div class="tile"></div>
	tile.classList.add("tile");

	if(num > 0) {

		// <div class="tile">2</div>
		tile.innerText = num.toString();

		// 2 < 8192
		if(num < 8192) {
			// <div class="tile x2">2</div>
			// x2 , this will get the appearance from styles.css
			tile.classList.add("x" + num.toString());
		} else {
			tile.classList.add("8192");
		}
	}
}
// window.onload - when the webpage loads, the function nested is called out
window.onload = function() {
	setGame(); // we call the setGame function
}
// e = represents event or the event of pressing the key down
function handleSlide(e) {
	// e.code can also be e.key
	// outputs: e.code = KeyA , ArrowUp / e.key = a , ArrowUp
	console.log(e.code);
	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){

		if (e.code == "ArrowLeft") {
			slideLeft();
			setTwo();
		} else if (e.code == "ArrowRight") {
			slideRight();
			setTwo();
		} else if (e.code == "ArrowUp") {
			slideUp();
			setTwo();
		} else if (e.code == "ArrowDown") {
			slideDown();
			setTwo();
		}
	}

	document.getElementById("score").innerText = score;

	setTimeout(()=> {
		checkWin();
	}, 100);
	
	if(hasLost() == true) {
		setTimeout(() => {
			alert("Game over. You have lost the game. The game will restart.");
			restartGame();
			alert("Click any arrow key to restart");
		}, 100);
	}

}

document.addEventListener("keydown", handleSlide);

// slideLeft will use slide function to merge matching adjacent tiles
function slideLeft() {
	for(let r = 0; r<rows; r++) {

		let row = board[r];
		row = slide(row);
		board[r] = row;

		for(let c=0; c<columns; c++) {
			for(let c=0; c<columns; c++) {
				let tile = document.getElementById(r.toString() + "-" + c.toString());
				let num = board[r][c];
				updateTile(tile, num);
			}
		}
	}
}

// example:
// row 1: 2 0 0 2 (slide left) -> ?
// filterZero will temporarily remove the zeroes to merge the numbers
// row 1: 2 2 (slide left) -> 4
function filterZero(row) {
	return row.filter(num => num != 0);
}

function slide(tiles) {

	// [0, 2, 2, 2] -> [2, 2, 2]
	tiles = filterZero(tiles);

	for(let i=0; i < tiles.length-1; i++) {

		// if the tile i is equal to the next tile
		if (tiles[i] == tiles[i+1]) { //true
			// the tile's number will multiply to 2
			tiles[i] *= 2; // 2 -> 4, 4 -> 8, 8 -> 16, ...
			tiles[i+1] = 0; // output: [4, 2]
			score += tiles[i];

		}
	}

	tiles = filterZero(tiles);

	while(tiles.length < columns) {
		tiles.push(0);
	}
	return tiles;
}

// for merging, Slide left and right will be mainly through row values
function slideRight() {

	for(let r = 0; r<rows; r++) {

		// All tile values per row are asved in  container row
		let row = board[r];

		// 2 2 2 0 -> 0 2 2 2
		row.reverse();
		row = slide(row); // use slide function to merge the same values
		// 4 2 0 0
		row.reverse();
		// 0 0 2 4

		board[r] = row; // update the row with the merges tile/s

		// Because of this loop, we are able to update the id and color of all the tiles, from the first column of a row to its last column, and because of the upper loop, not just single row will be updates, but all rows.

		for(let c=0; c<columns; c++) {
			for(let c=0; c<columns; c++) {
				let tile = document.getElementById(r.toString() + "-" + c.toString());
				let num = board[r][c];
				updateTile(tile, num);
			}
		}
	}
}

function slideUp() {

	for(let c = 0; c<columns; c++) {

		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
		// this will get the values of the columns per row


		col = slide(col);

		for(let r=0; r<rows; r++) {
			
			board[r][c] = col[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num); // when we slide, there might be a tile that merged, therefore needs to be updated frequently to change the tile number and color.
			
		}
	}
}

function slideDown() {

	for(let c = 0; c<columns; c++) {

		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
		// this will get the values of the columns per row
		col.reverse();
		col = slide(col);
		col.reverse();

		for(let r=0; r<rows; r++) {
			
			board[r][c] = col[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num); // when we slide, there might be a tile that merged, therefore needs to be updated frequently to change the tile number and color.
			
		}
	}
}

function hasEmptyTile() {
	for(let r = 0; r<rows; r++) {
		for(let c=0; c<columns; c++) {
			if(board[r][c] == 0) {
				return true;
			}
		}
	} return false;
}

// will say that 
function setTwo() {
	if(hasEmptyTile() == false) {
		return;
	}

	// 
	let found = false;

	while(found == false) {
		// will located random coordinates/position [row, column]/[0-3, 0-3]
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		// if the coordinates [random r][random c] is equal to 0)
		if(board[r][c] == 0) {
			// if it's 0, we convert the empty tile value 0 to 2
			board[r][c] = 2;
			let tile= document.getElementById(r.toString() + "-" + c.toString());

			// <div class="x2">2</div>
			tile.innerText = "2";
			tile.classList.add("x2");

			found = true;

		}
	}
}

function checkWin() {
	for(let r = 0; r<rows; r++) {
		for(let c=0; c<columns; c++) {
			if(board[r][c] == 2048 && is2048Exist == false) {
				alert("You Win! You got the 2048!");
				is2048Exist = true;
			} else if(board[r][c] == 4096 && is4096Exist == false) {
				alert("Amazing! You reached the 4096!");
				is4096Exist = true;
			} else if(board[r][c] == 8192 && is8192Exist == false) {
				alert("Unstoppable! You have reached the top at 8192!");
				is8192Exist = true;
			}
		}
	} 
}

function hasLost(){

	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){

			if(board[r][c] == 0){
				return false;
			}

			const currentTile = board[r][c];
			
			if( 			
							    
				r > 0 && board[r-1][c] === currentTile || // to check if the current tile matches to the upper tile
				r < 3 && board[r+1][c] === currentTile || // to check if the current tile matches to the lower tile
				c > 0 && board[r][c-1] === currentTile || // to check if the current tile matches to the left tile
				c > 3 && board[r][c+1] === currentTile // to check if the current tile matches to the right tile
			){
				return false;
			}
			// No possible moves - meaning true, the user has lost.
		}
	}
	return true;
}

function restartGame() {
	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	];
	score = 0;
	setTwo();
}

 








