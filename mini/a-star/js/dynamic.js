// This implementation should not be used, as it is very dirty and demonstration-purposed

function distance(a, b) {
	var dx = b.x - a.x;
	var dy = b.y - a.y;
	return Math.sqrt(dx*dx + dy*dy); 
}

var can = document.getElementById('result');
var ctx = can.getContext('2d');

can.width = 600;
can.height = 600;

var openSet, closedSet;

var start;
var end;

var finished = false;

const cols = 25;
const rows = 25;
const paddingX = 5;
const paddingY = 5;
const w = (can.width - paddingX * 2) / cols;
const h = (can.height - paddingY * 2) / rows;

var grid, path; 

var interval;

var tick = function(){

	if(openSet.length > 0) {
		openSet.sort((a, b) => {
			return b.f - a.f;
		});
		var min = openSet.length - 1;

		var current = openSet[min];

		if(current === end) {
			console.log('Done.');
			finished = true;
		}

		openSet.splice(min, 1);
		closedSet.push(current);

		for(var i in current.neighbours) {
			var n = current.neighbours[i];

			if(!closedSet.includes(n) && !n.wall) {
				var tempG = current.g + distance(n, current);

				var newPath = false;
				if(openSet.includes(n)) {
					if(tempG < n.g) {
						n.g = tempG;
						newPath = true;
					}
				} else {
					n.g = tempG;
					openSet.push(n);
					newPath = true;
				}

				if(newPath) {
					n.f = n.g + distance(n, end);
					n.prev = current;
				}
			}
		}

	} else {
		console.log('No solution.');
		finished = true;
	}

	// render
	ctx.clearRect(0, 0, can.width, can.height);
	for(var x = 0; x < cols; x++) {
		for(var y = 0; y < rows; y++) {
			grid[x][y].draw('rgba(196, 196, 196, 0.4)');
		}
	}

	for(var i = 0; i < closedSet.length; i++) {
		closedSet[i].draw('rgba(165, 138, 206, 0.6)');
	}

	for(var i = 0; i < openSet.length; i++) {
		openSet[i].draw('rgba(196, 196, 196, 1.0)');
	}

	if(current) {
		path = [];
		var temp = current;
		path.push(temp);
		while(temp.prev) {
			path.push(temp.prev);
			temp = temp.prev;
		}
	}

	// Draw path
	ctx.beginPath();
	ctx.moveTo(path[0].x * w + w / 2 + paddingX, path[0].y * h + h / 2 + paddingY);
	for(var i = 1; i < path.length; i++) {
		var x = path[i].x * w + w / 2 + paddingX;
		var y = path[i].y * h + h / 2 + paddingY;
		ctx.lineTo(x, y);
	}
	ctx.lineWidth = w / 6;
	ctx.strokeStyle = 'rgba(165, 138, 206, 1.0)';
	ctx.stroke();

	if(finished) {
		clearInterval(interval);
	}
};

function distance(a, b) {
	var dx = b.x - a.x;
	var dy = b.y - a.y;
	return Math.sqrt(dx*dx + dy*dy); 
}

function generate() {
	grid = new Array(cols);
	for(var x = 0; x < cols; x++) {
		grid[x] = new Array(rows);
		for(var y = 0; y < rows; y++) {
			grid[x][y] = new Spot(ctx, x, y);
		if(Math.random() < 0.25)
			grid[x][y].wall = true;
		}
	}

	start = grid[0][0];
	end = grid[cols - 1][rows - 1];
	start.wall = false;
	end.wall = false;

	for(var x = 0; x < cols; x++) {
		for(var y = 0; y < rows; y++) {
			grid[x][y].addNeighbours();
		}
	}

	openSet = [];
	closedSet = [];
	openSet.push(start);

	path = [];
	finished = false;
}

function run() {
	clearInterval(interval);
	generate();
	interval = setInterval(tick, 1000 / 30);
}

document.getElementById('btn-gen').addEventListener('click', run);

run();