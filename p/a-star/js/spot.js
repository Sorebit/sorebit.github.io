function Spot(ctx, x, y) {
	this.ctx = ctx;
	this.x = x;
	this.y = y;
	this.f = 0;
	this.g = 0;
	this.neighbours = [];
	this.prev = undefined;
	this.wall = false;
}

Spot.prototype.draw = function(color) {
	this.ctx.lineWidth = 1;
	this.ctx.fillStyle = color;
	if(this.wall) {
		this.ctx.fillStyle = '#404040';
	}
	this.ctx.fillRect(this.x * w + paddingX + 2, this.y * h + paddingY + 2, w - 2, h - 2);
};

Spot.prototype.addNeighbours = function() {
	for(var dx = -1; dx <= 1; dx++) {
		for(var dy = -1; dy <= 1; dy++) {
			var x = this.x + dx;
			var y = this.y + dy;
			// Don't add ourselves
			if(dx === 0 && dy === 0)
				continue;
			// Don't add out of bounds
			if(x < 0 || x >= cols || y < 0 || y >= rows)
				continue;
			if(grid[x][y].wall)
				continue;
			// Check if we're not trying to go through two corners
			// e.x
			// @ - current, d - destination, # - wall, . - ground
			// ...
			// .@#
			// .#d
			if(Math.abs(dx) === Math.abs(dy)) {
				if(grid[x][this.y].wall && grid[this.x][y].wall) {
					continue;
				}
			}
			// Add
			this.neighbours.push(grid[x][y]);
		}		
	}
}