var ctx = document.getElementById("canvas").getContext("2d");

var levelLData = null;
var position = [];
var gridstate = [];

var lastFrameTime = 0;
var timedelta = 0;
var framestep = 1000/60;
var startScreenInt = 0;

var onStartScreen = true;
var directions = {up: 1, right: 2, down: 3, left: 4};
var keys = [0,0,0,0]; //left, up, right, down

// dark grey, white, light grey, pale pink, dusty pink
var scheme1 = ["#424B54","#FFFFFF","#93A8AC","#E2B4BD","#9B6A6C","#000000"];
// white, tan, golden yellow, dusty pink, muted purple
var scheme2 = ["#FFF4EC","#E7CFBC","#F2B880","#C98686","#966B9D","#000000"];
// periwinkle, white blue, seafoam, pink, light blue
var scheme3 = ["#83BCFF","#E1EFF6","#80EAE8","#ECCBD9","#97D2FB","#FFFFFF"];

var navy = "#184E63";
var aqua = "#0EC6B9";
var tea = "#6FB181";
var gold = "#FEBF42";
var red = "#FC583F";
var white = "#FFFFFF";
var scheme4 = [navy,aqua,tea,gold,red,white];
var colors = scheme4;


var levels = {
		level1: {
		res: 15,
		start: [[8.0,8.0]],
		grid: [[5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]], 
		sol:  [[1,5,5,5,5,5,5,5,0,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
			   [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]] 
	}
}

function drawGame() {
	loadLevel("level1");	
	//draw background
	for (x = 0; x < levelData.res; x++) {
		for (y = 0; y < levelData.res; y++) {
			drawBack(x, y, levelData.res, colors[gridstate[y][x]]);
		}
	}
	//draw blocks
	drawBlock(Math.floor(position[0][0]), 
		Math.floor(position[0][1]), levelData.res);
}

function loadLevel(level) {
	levelData = levels[level];
	gridstate = levelData.grid.slice();
	position = levelData.start.slice();	
}

function drawStartScreen(index) {
	onStartScreen = true;
	for (i = 0; i < 5; i++) {
		ctx.beginPath();
		ctx.lineWidth = 3;
		//ctx.strokeStyle = ((i === (index % 5) || i === ((index + 2) % 5)) ? colors[i] : "#DCDCDC");
		ctx.strokeStyle = colors[(i + index) % 5];
        ctx.rect(70 - 11*i, 140 - 15*i, 350 + 22*i, 100 + 30*i);
		ctx.stroke();
		ctx.closePath();
	}	
	ctx.font = "60px Courier";
	ctx.textAlign="center";
	ctx.fillStyle = "#696969";
	ctx.fillText("prism", 240, 200);
	
}

function drawBack(x,y, res, color) {
	ctx.beginPath();
	ctx.rect(x*(480/res), y*(480/res), (480/res), (480/res));
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}

function drawBlock(x, y, res) {
	ctx.beginPath();
	ctx.rect((x+0.25)*(480/res), (y+0.25)*(480/res), (480/res)/2, (480/res)/2);
	ctx.fillStyle = aqua;
	ctx.fill();
	ctx.closePath();
}

function update(timestamp) {
	timedelta += timestamp - lastFrameTime;
	lastFrameTime = timestamp;

	if (timedelta < 1000 && onStartScreen) {
		window.requestAnimationFrame(update);
	} else {
		if (onStartScreen) {
			timedelta = 0;
			clear("#FFFFFF");
			drawStartScreen(startScreenInt);
			startScreenInt = (startScreenInt + 1) % 5;
		} else {
			timedelta = 0;
			clear("#FFFFFF");
			updatePositions();
			drawGame();
		}
		window.requestAnimationFrame(update);
	}
}

function updatePositions() {
	for (c = 0; c < position.length; c++) {
		var cube = position[0];	
		var x = cube[0];
		var y = cube[1];
		var currColor = gridstate[x][y];
		if (keys[0] === 1) {		// left
			if (x > 0) {
				if (gridstate[x-1][y] === currColor) {
					position[0][0] -= 1;
				}
			}
		} else if (keys[1] === 1) {	// up
			if (y > 0) {
				if (gridstate[x][y-1] === currColor) {
					position[0][1] -= 0.25;
				}
			}
		} else if (keys[2] === 1) {	// right
			if (x < levelData.res-1) {
				if (gridstate[x+1][y] === currColor) {
					position[0][0] += 1;
				}
			}
		} else if (keys[3] === 1) {	// down
			if (y < levelData.res-1) {
				if (gridstate[x][y+1] === currColor) {
					position[0][1] += 0.25;
				}
			}
		} else {
			
		}
	}	
}

function clear(color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.rect(0, 0, 480, 480);
	ctx.fill();
	ctx.closePath();
}	

function keydown(e) {
	switch(e.keyCode) {
		case 37:	//left
			keys[0] = 1;
			break;
		case 38: 	//up
			keys[1] = 1;
			break;
		case 39: 	//right
			keys[2] = 1;
			break;
		case 40:	//down
			keys[3] = 1;
			break;
		default: 
			return;
	}
	e.preventDefault();
}

function keyup(e) {
	if (onStartScreen) {
		onStartScreen = false;
	}
	switch(e.keyCode) {
		case 37:	//left
			keys[0] = 0;
			break;
		case 38: 	//up
			keys[1] = 0;
			break;
		case 39:	//right
			keys[2] = 0;
			break;
		case 40:	//down
			keys[3] = 0;
			break;
		case 82:
			//reset
			break;	//r
		default:
			return;
	}
	e.preventDefault();
}

document.addEventListener("keydown", keydown, false);
document.addEventListener("keyup", keyup, false);

drawStartScreen(startScreenInt++);
window.requestAnimationFrame(update);
