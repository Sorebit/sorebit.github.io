const can = document.getElementById('result');
const ctx = can.getContext('2d');

document.getElementById('btn-gen').addEventListener('click', run);

can.width = 600;
can.height = 600;

var openSet, closedSet;
var start, end;
var grid, path;

const cols = 25;
const rows = 25;
const paddingX = 5;
const paddingY = 5;
const w = (can.width - paddingX * 2) / cols;
const h = (can.height - paddingY * 2) / rows;

function solve(start, end) {
	// var openSet = [];
	// var closedSet = [];

	openSet.push(start);
	while(openSet.length > 0) {
		// Find node with smallest f value
		openSet.sort((a, b) => {
			return b.f - a.f;
		});
		var current = openSet[openSet.length - 1];

		openSet.pop();
		closedSet.push(current);

		for(var i in current.neighbours) {
			var node = current.neighbours[i];
			// Ignore processed nodes
			if(closedSet.includes(node)) {
				continue;
			}

			// Tentative g value
			var g = current.g + distance(current, node);
			if(!openSet.includes(node)) {
				openSet.push(node);
			} else if(g >= node.g) {
				continue;
			}

			node.prev = current;
			node.g = g;
			node.f = node.g + distance(node, end);
		}

		if(current === end) {
			return constructPath(end);
		}
	}

	return false;
}

function distance(a, b) {
	var dx = b.x - a.x;
	var dy = b.y - a.y;
	return Math.sqrt(dx*dx + dy*dy); 
}

function constructPath(spot) {
	var path = [spot];
	var c = spot;
	while(c.prev) {
		path.push(c.prev);
		c = c.prev;
	}
	return path;
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
}

function render() {
	// render
	ctx.clearRect(0, 0, can.width, can.height);
	for(var x = 0; x < cols; x++) {
		for(var y = 0; y < rows; y++) {
			grid[x][y].draw('rgba(196, 196, 196, 0.4)');
		}
	}

	for(var i = 0; i < closedSet.length; i++)
		closedSet[i].draw('rgba(165, 138, 206, 0.6)');

	for(var i = 0; i < openSet.length; i++)
		openSet[i].draw('rgba(196, 196, 196, 1.0)');

	if(path === false) {
		console.log('No solution.');
		return;
	}
	
	// Draw path
	console.log('Done.');
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
}

function run() {
	generate();
	path = solve(start, end);
	render();
}

run();