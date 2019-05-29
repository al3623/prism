var ctx = document.getElementById("canvas").getContext("2d");

var levelData = null;
var grid = [];
var gridstate = false;
var startScreenInt = 0;

var lastFrameTime = 0;
var timedelta = 0;
var speed = 0.009;
var epsilon = 0.009;
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
	travelled: 0,
}

var levels = {
		level1: {
		res: 15,
		startX: 8.0,
		startY: 8.0,
		levelgrid: [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
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
	me.travelled = 0;
	drawGrid();
}

function drawGrid() {
	for (i = 0; i < levelData.res; i++) {
		for (j = 0; j < levelData.res; j++) {
			// wall	
			if (grid[i][j] === 1) {
				ctx.beginPath();
				ctx.rect(i*(480/levelData.res),j*(480/levelData.res), 
						(480/levelData.res), (480/levelData.res));
				ctx.fillStyle = grey;
				ctx.fill();
				ctx.closePath();
			} else {
				ctx.beginPath();
				ctx.rect(i*(480/levelData.res),j*(480/levelData.res), 
						(480/levelData.res), (480/levelData.res));
				if ((i + j) % 2 === 0) {
					ctx.fillStyle = tea;
				} else {
					ctx.fillStyle = red;
				}
				ctx.fill();
				ctx.closePath();
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
		dist = me.currY - me.currY;
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
				|| (drift && driftDir === 0)) && x > 0)  {		// left
			driftDist -= delta * speed;
			me.currX -= delta * speed;
		} else if ((keys[1] === 1 
				|| (drift && driftDir === 1)) && y > 0)  {	// up
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

		if (drift && driftDist <= epsilon) {
			me.currX = Math.round(me.currX);
			me.currY = Math.round(me.currY);
			drift = false;
			driftDist = 0;
			driftDir = -1;
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
