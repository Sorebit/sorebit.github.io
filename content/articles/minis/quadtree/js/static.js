'use strict';

function Rectangle(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

var can = document.getElementById('result');
var ctx = can.getContext('2d');

var isMouseover = false;
var cursor = new Rectangle(0, 0, 24, 24);

var objects = [];

var handleMousemove = function(e) {
	isMouseover = true;
	
	if(!e.offsetX) {
		e.offsetX = e.layerX - e.target.offsetLeft;
		e.offsetY = e.layerY - e.target.offsetTop;
	} 
	
	cursor.x = e.offsetX - (cursor.width/2);
	cursor.y = e.offsetY - (cursor.height/2);		
};

var handleMouseout = function(e) {	
	isMouseover = false;
};

var quadTree = new Quadtree(new Rectangle(10, 10, 500, 500), 8, 10);

function render(node) {
	ctx.strokeStyle = 'rgba(127, 127, 127, 1.0)';
	ctx.strokeRect(node.bounds.x, node.bounds.y, node.bounds.width, node.bounds.height);

	if(node.nodes.length > 0) {
		for(var i in node.nodes)
			render(node.nodes[i], i);
	}
}

function renderObjects() {
	for(var i in objects) {
		var b = objects[i];
		if(objects[i].check) {
			ctx.fillStyle = 'rgba(165, 138, 206, 0.6)';
			ctx.strokeStyle = 'rgba(73, 56, 99, 0.8)';
		} else {
			ctx.fillStyle = 'rgba(196, 196, 196, 0.4)';
			ctx.strokeStyle = 'rgba(128, 128, 128, 0.8)';
		}

		ctx.fillRect(b.x, b.y, b.width, b.height);
		ctx.strokeRect(b.x, b.y, b.width, b.height);
	}
}

function add(qt) {
	for(var i = 0; i < qt; i++) {		
		var width = Math.random() * 20 + 10;
		var height = width;
		var x = Math.random() * (quadTree.bounds.width - width) + quadTree.bounds.x;
		var y = Math.random() * (quadTree.bounds.height - height) + quadTree.bounds.y;
		var r = new Rectangle(x, y, width, height);
		objects.push(r);
		quadTree.insert(r);
	}
	ctx.clearRect(0, 0, can.width, can.height)
}

function clear() {
	quadTree.clear();
	objects = [];
}

function updateInfo(x) {
	var per = Math.floor(x / objects.length * 100);
	if(isNaN(per) || typeof per === 'undefined')
		per = 0;
	info.innerHTML = x + ' / ' + objects.length + ' (' +  per + '%)';
}

function loop() {

	var candidates = [];
	
	for(var i in objects) {
		objects[i].check = false;
	}	

	if(isMouseover) {
		candidates = quadTree.retrieve( cursor );
		for(i in candidates) {
			candidates[i].check = true;
		}
	}
	
	ctx.clearRect(0, 0, can.width, can.height)
	render(quadTree);
	renderObjects();
	if(isMouseover) {

		ctx.fillStyle = 'rgba(80, 80, 80, 0.7)';
		ctx.strokeStyle = 'rgba(80, 80, 80, 0.9)';
		ctx.fillRect(cursor.x, cursor.y, cursor.width, cursor.height);
		ctx.strokeRect(cursor.x, cursor.y, cursor.width, cursor.height);
	}

	updateInfo(candidates.length);

	requestAnimationFrame(loop);
}

loop();

document.getElementById('btn-add').addEventListener('click', function() { add(1) });
document.getElementById('btn-add-10').addEventListener('click', function() { add(10) });
document.getElementById('btn-clear').addEventListener('click', clear);

document.getElementById('result').addEventListener('mousemove', handleMousemove);
document.getElementById('result').addEventListener('mouseout', handleMouseout);
