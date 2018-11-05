const TILESIZE = 30;
const SINGLE_TILE = [[0]];

const canvas = document.getElementById("battleCanvas");
const ctx = canvas.getContext("2d");

let playground = [[0, 1, 2], [0, 1, 2, 3], [0, 2, 3], [0, 1, 2, 3]];

let tile1 = [[0, 2], [0, 1, 2], [0, 2]];
let tile2 = [[0]];


function drawElementAt(element, x, y, color) {
	ctx.fillStyle = color;
	for (let v in element) {
		for (let i in element[v]) {
			let h = element[v][i];
			ctx.fillRect(x * TILESIZE + h * TILESIZE, y * TILESIZE + v * TILESIZE, TILESIZE, TILESIZE);
		}
	}
}

//Check wether tile1 is fitting into tile2 at position x,y relative to tile2's top-left corner
function isFitting(tile1, tile2, x, y) {
	let toReturn = true;
	for (let v in tile1) {
		for (let i in tile1[v]) {
			let h = Number(tile1[v][i]);
			if (tile2[Number(v) + y] == undefined || tile2[Number(v) + y].indexOf(Number(h) + x) == -1) {
				//Does not fit at this tile
				toReturn = false;
				drawElementAt(SINGLE_TILE, Number(h) + x, Number(v) + y, "red");
			} else {
				//Tile fits at this position
				drawElementAt(SINGLE_TILE, Number(h) + x, Number(v) + y, "green");
			}
		}
	}
	return toReturn;
}

drawElementAt(playground, 0, 0, "#afafaf");
drawElementAt(tile1, 5, 0, "#7dbf30");
