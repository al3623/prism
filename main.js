var ctx = document.getElementById("canvas").getContext("2d");

var levelLData = null;
var position = [];
var gridstate = [];
var walls = [];
var lasers = [];

var lastFrameTime = 0;
var timedelta = 0;
var framestep = 1000/10;
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
var egg = "#FDF2E1";
var grey = "#808080";
var scheme4 = [navy,aqua,tea,gold,red,white,egg,grey];
var colors = scheme4;


var levels = {
		level1: {
		res: 15,
		start: [[8.0,8.0]],
		laser: [[8.0,0.0,3]],
		wall: [[8,5]],
		target: [[8.0,14.0,white]],
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
			}
}

function drawSplitLasers() {

}

function drawLasers(x,y,dir) {
	ctx.beginPath();
	ctx.fillStyle = red;
	ctx.arc((x + 0.5)*(480/levelData.res), (y + 0.5)*(480/levelData.res),
		5,0,2 * Math.PI);
	ctx.fill();
	ctx.closePath();
	
	ctx.beginPath();
	ctx.strokeStyle = red;
	ctx.lineWidth = 2;
	ctx.moveTo((x + 0.5)*(480/levelData.res),(y + 0.5)*(480/levelData.res));
	
	final_x = undefined;
	final_y = undefined;
	in_y = false;
	in_x = false;
	x_dev = 0.5;
	y_dev = 0.5;
		
	if (dir === 1) {		// up
		final_x = x;
		final_y = 0;
	} else if (dir === 2) {	// right
		final_x = 14;
		final_y = y;
	} else if (dir === 3) {	// down
		final_x = x;
		final_y = 14;
	} else {				// left
		final_x = 0;
		final_y = y;
	}
	// check for walls
	for (i = 0; i < walls.length; i++) {
		wall = walls[i];
		if (final_x > x) {
			if (wall[0] >= x && wall[0] <= final_x) {
				in_x = true;
			}
		} else {
			if (wall[0] <= x && wall[0] >= final_x) {
				in_x = true;
			}
		}
		if (final_y > y) {
			if (wall[1] >= y && wall[1] <= final_y) {
				in_y = true;
			}
		} else {
			if (wall[1] <= y && wall[1] >= final_y) {
				in_y = true;
			}
		}
		if (in_x && in_y) {
			final_x = wall[0];
			final_y = wall[1];
			blocking_obj = 0;
			if (dir === 1 || dir === 3) {
				y_dev = 0;
			}
			if (dir === 2 || dir === 4) {
				x_dev = 0;
			}
		}
		in_y = false;
		in_x = false;
	}

	// check for block
	block = position[0];
	if (final_x > x) {
		if (block[0] >= x && block[0] <= final_x) {
			in_x = true;
		}
	} else {
		if (block[0] <= x && block[0] >= final_x) {
			in_x = true;
		}
	}
	if (final_y > y) {
		if (block[1] >= y && block[1] <= final_y) {
			in_y = true;
		}
	} else {
		if (block[1] <= y && block[1] >= final_y) {
			in_y = true;
		}
	}
	if (in_x && in_y) {
		final_x = block[0];
		final_y = block[1];
		if (dir === 1 || dir === 3) {
			y_dev = 0.25;
		}
		if (dir === 2 || dir === 4) {
			x_dev = 0.25;
		}
	}
	in_y = false;
	in_x = false;



	// check for lasers
	
	ctx.lineTo((final_x + x_dev)*(480/levelData.res),
		(final_y + y_dev)*(480/levelData.res));

	ctx.stroke();
	ctx.closePath();

}

function drawGame() {
	loadLevel("level1");	
	// draw walls
	for (i = 0; i < walls.length; i++) {
		cell = walls[i];
		drawBack(cell[0],cell[1],levelData.res,grey);
	}

	//draw block
	drawBlock(Math.floor(position[0][0]), 
		Math.floor(position[0][1]), levelData.res);

	// draw lasers
	for (i = 0; i < lasers.length; i++) {
		drawLasers(lasers[i][0],lasers[i][1],
			lasers[i][2]);
	}
}

function loadLevel(level) {
	levelData = levels[level];
	gridstate = levelData.grid.slice();
	position = levelData.start.slice();
	walls = levelData.wall.slice();
	lasers = levelData.laser.slice();
}

function drawStartScreen(index) {
	onStartScreen = true;
	for (i = 0; i < 5; i++) {
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = colors[(i + index) % 5];
        ctx.rect(70 - 11*i, 140 - 15*i, 350 + 22*i, 100 + 30*i);
		ctx.stroke();
		ctx.closePath();
	}	
	ctx.font = "60px Courier";
	ctx.textAlign="center";
	ctx.fillStyle = navy;
	ctx.fillText("prism", 240, 200);
	
}

function drawBack(x,y, res, color) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.rect(x*(480/res), y*(480/res), (480/res), (480/res));
	ctx.fill();
	ctx.closePath();
}

function drawBlock(x, y, res) {
	ctx.beginPath();
	ctx.rect((x+0.25)*(480/res), (y+0.25)*(480/res), (480/res)/2, (480/res)/2);
	ctx.fillStyle = grey;
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
		if (keys[0] === 1 && x > 0)  {		// left
			position[0][0] -= 1;
		} else if (keys[1] === 1 && y > 0)  {	// up
			position[0][1] -= 0.25;
		} else if (keys[2] === 1 && x < levelData.res-1)  {	// right
			position[0][0] += 1;
		} else if (keys[3] === 1 && y < levelData.res-1) {	// down
			position[0][1] += 0.25;
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
