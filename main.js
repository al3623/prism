var ctx = document.getElementById("canvas").getContext("2d");

var levelData = null;
var grid = [];
var gridstate = false;
var startScreenInt = 0;

var lastFrameTime = 0;
var timedelta = 0;
var speed = 0.006;
var epsilon = 0.006;
var drift = false;
var driftDist = 0;
var driftDir = -1;

var onStartScreen = false;
var keys = [0,0,0,0]; //left, up, right, down

var navy = "#184E63";
var aqua = "#0EC6B9";
var tea = "#6FB181";
var gold = "#FEBF42";
var red = "#FC583F";
var white = "#FFFFFF";
var egg = "#FDF2E1";
var grey = "#808080";
var black = "#000000";
var scheme = [navy,aqua,tea,gold,red,white,egg,grey];
var colors = scheme;

var me = {
	currX: undefined,
	currY: undefined,
}

var levels = {
		level1: {
		res: 15,
		startX: 8.0,
		startY: 8.0,
		// 0 is aigu, 1 is grave
		levelmirrors: [[3.0,3.0,0]],
		levelprisms: [[10.0,10.0]],
		// 0 -> space
		// 1 -> wall
		// 2 -> up laser
		// 3 -> right laser
		// 4 -> down laser
		// 5 -> left laser
		levelgrid: [[0,0,0,0,0,0,0,0,4,0,0,0,0,0,0],
					[0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
		}
}

function drawGame() {
	drawGrid();
	drawMe(me.currX, me.currY, levelData.res);
}

function loadLevel(level) {
	levelData = levels[level];
	grid = levelData.levelgrid;
	me.currX = levelData.startX;
	me.currY = levelData.startY;
	drawGrid();
}

function drawLaserPath(x,y,dir,color) {
	goalX = x;
	goalY = y;
	if (dir === 0) {			// left
		goalX = 0;
	} else if (dir === 1) {		// up
		goalY = 0;
	} else if (dir === 2) {		// right
		goalX = levelData.res-1;
	} else {					// down
		goalY = levelData.res-1;
	}
	// walls
	// lasers
	// me
	// mirrors
	// prisms
}

function drawGrid() {
	for (i = 0; i < levelData.res; i++) {
		for (j = 0; j < levelData.res; j++) {
			if (grid[i][j] === 1) {	// walls
				ctx.beginPath();
				ctx.rect(j*(480/levelData.res),i*(480/levelData.res), 
						(480/levelData.res), (480/levelData.res));
				ctx.fillStyle = grey;
				ctx.fill();
				ctx.closePath();
			} else if (grid[i][j] >= 2 && grid[i][j] <= 5) { // laser starts
				ctx.beginPath();
				ctx.arc((j+0.5)*(480/levelData.res),(i+0.5)*(480/levelData.res),
					5,0, 2*Math.PI);
				ctx.fillStyle = red;
				ctx.fill();
				ctx.closePath();
				dir = grid[i][j] - 2;
			}
		}
	}
	
}

function drawMe(x, y, res) {
	ctx.beginPath();
	ctx.rect((x+0.25)*(480/res), (y+0.25)*(480/res), (480/res)/2, (480/res)/2);
	ctx.fillStyle = grey;
	ctx.fill();
	ctx.closePath();
}

function update(timestamp) {
	timedelta += timestamp - lastFrameTime;
	lastFrameTime = timestamp;

	if (timedelta < 600 && onStartScreen) {
		window.requestAnimationFrame(update);
	} else {
		clear("#FFFFFF");
		updatePositions(timedelta);
		timedelta = 0;
		drawGame();
	}
	window.requestAnimationFrame(update);
}

function centerMe(dir) {
	dist = 0;
	if (dir === 0) {			// left
		goalX = Math.floor(me.currX);
		dist = me.currX - goalX;
	} else if (dir === 1) {		// up
		goalY = Math.floor(me.currY);
		dist = me.currY - goalY;
	} else if (dir === 2) {		// right
		goalX = Math.ceil(me.currX);
		dist = goalX - me.currX;
	} else {					// down
		goalY = Math.ceil(me.currY);
		dist = goalY - me.currY;
	}
	if (dist > 0) {
		drift = true;
		driftDist = dist;
		driftDir = dir;
	}
}

function updatePositions(delta) {
		x = me.currX;
		y = me.currY;
		if ((keys[0] === 1 
				|| (drift && driftDir === 0)) 
				&& x > 0)  {		// left
			driftDist -= delta * speed;
			me.currX -= delta * speed;
		} else if ((keys[1] === 1 
				|| (drift && driftDir === 1)) 
				&& y > 0)  {	// up
			driftDist -= delta * speed;
			me.currY -= delta * speed;
		} else if ((keys[2] === 1 
				|| (drift && driftDir === 2)) 
				&& x < levelData.res-1)  {	// right
			driftDist -= delta * speed;
			me.currX += delta * speed;
		} else if ((keys[3] === 1
				|| (drift && driftDir === 3)) 
				&& y < levelData.res-1) {	// down
			driftDist -= delta * speed;
			me.currY += delta * speed;
		} else {
			// wat
		}

		me.currX = me.currX < 0 ? 0 : me.currX;
		me.currY = me.currY < 0 ? 0 : me.currY;
		me.currX = me.currX > levelData.res-1 ? levelData.res-1 : me.currX;
		me.currY = me.currY > levelData.res-1 ? levelData.res-1 : me.currY;

		if (drift && driftDist <= epsilon) {
			me.currX = Math.round(me.currX);
			me.currY = Math.round(me.currY);
			drift = false;
			driftDist = 0;
			driftDir = -1;
		}

		if (
		(keys[0] === 1 || keys[1] === 1 || driftDir === 0 || driftDir === 1)
				&& grid[Math.floor(me.currY)][Math.floor(me.currX)]!== 0) {
			me.currX = x;
			me.currY = y;
		}
		if (
		(keys[2] === 1 || keys[3] === 1 || driftDir === 2 || driftDir === 3)
				&& grid[Math.ceil(me.currY)][Math.ceil(me.currX)]!== 0) {
			me.currX = x;
			me.currY = y;
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
	switch(e.keyCode) {
		case 37:	//left
			keys[0] = 0;
			centerMe(0);
			break;
		case 38: 	//up
			keys[1] = 0;
			centerMe(1);
			break;
		case 39:	//right
			keys[2] = 0;
			centerMe(2);
			break;
		case 40:	//down
			keys[3] = 0;
			centerMe(3);
			break;
		case 82:
			//reset
			break;	//r
		default:
			return;
	}
	e.preventDefault();
}

loadLevel("level1");
document.addEventListener("keydown", keydown, false);
document.addEventListener("keyup", keyup, false);

window.requestAnimationFrame(update);
