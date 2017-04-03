window.canvas = document.getElementById("board");
window.ctx = canvas.getContext("2d");

function isNumber(i) {
	return typeof i === 'number';
}

function isInteger(num) {
	return num === (num | 0);
}

function random(minOrMax, maxOrUndefined, dontFloor) {
	dontFloor = dontFloor || false;

	var min = this.isNumber(maxOrUndefined) ? minOrMax: 0;
	var max = this.isNumber(maxOrUndefined) ? maxOrUndefined: minOrMax;

	var range = max - min;

	var result = Math.random() * range + min;

	if (this.isInteger(min) && this.isInteger(max) && ! dontFloor) {
		return Math.floor(result);
	} else {
		return result;
	}
}

function random11() {
	return this.random(-1, 1, true);
}


function rect(ctx, x, y, dx, dy, color) {
	ctx.beginPath();
	ctx.rect(x, y, dx, dy);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}
function text(ctx, t, x, y, align, font) {
	ctx.fillStyle = "#000000"; 
	ctx.textAlign = align || "center";
	ctx.font = font || "12px Sans";
	ctx.fillText(t, x, y);
}

// Blend two colors using a k*k gradient
// c1 and c2 should be #rrggbb
// k should be [0, 1]
function blend(c1, c2, k) {
	if(isNaN(k) || !isFinite(k))
		k = 0;
	if(k > 1)
		k = 1;
	var r1 = parseInt(c1.substr(1, 2), 16);
	var g1 = parseInt(c1.substr(3, 2), 16);
	var b1 = parseInt(c1.substr(5, 2), 16);
	var r2 = parseInt(c2.substr(1, 2), 16);
	var g2 = parseInt(c2.substr(3, 2), 16);
	var b2 = parseInt(c2.substr(5, 2), 16);
	// Blend
	var r3 = Math.round(r1 + (r2 - r1)*k*k).toString(16);
	var g3 = Math.round(g1 + (g2 - g1)*k*k).toString(16);
	var b3 = Math.round(b1 + (b2 - b1)*k*k).toString(16);
	r3 = (r3.length < 2) ? ('0' + r3) : r3;
	g3 = (g3.length < 2) ? ('0' + g3) : g3;
	b3 = (b3.length < 2) ? ('0' + b3) : b3;

	return '#' + r3 + g3 + b3;
}

// Board class
function Board(tileSize, tileSpacing, simulation) {
	this.simulation = simulation;
	this.colorMin = "#eeeeee";
	this.colorMax = "#6a5de8";
	// this.colorMin = "#7566ff";
	// this.colorMax = "#fb6274";

	this.mapLength = 40;
	this.map = [];
	this.rolls = 0;
	this.games = 0;
	this.goToJail = 0;
	this.minLandings = 0;
	this.maxLandings = 0;
	this.jailBreaks = 0;
	for(var i = 0; i < this.mapLength; ++i) {
		this.map.push(0);
	}
	this.tileSize = tileSize;
	this.tileSpacing = tileSpacing;
	this.offsetX = (canvas.width  - this.tileSize * 6.5 - this.tileSpacing*10)/2;
	this.offsetY = (canvas.height - this.tileSize * 6.5 - this.tileSpacing*10)/2;
}

// Render tiles with numbers and special names
Board.prototype.Draw = function() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(var i = 0; i < this.mapLength; ++i) {
		var k = (this.map[i] - this.minLandings) / (this.maxLandings - this.minLandings);
		var color = blend(this.colorMin, this.colorMax, k);
		var x = this.offsetX
		var y = this.offsetY;
		var sx = this.tileSize;
		var sy = this.tileSize;

		if(i == 0) {
			// GO
			x += this.tileSize * 5.5 + this.tileSpacing*10;
			y += this.tileSize * 5.5 + this.tileSpacing*10;
			
			rect(ctx, x, y, sx, sy, color);
			text(ctx, this.map[i], x + sx/2, y + 21);
			text(ctx, "Go", x + sx/2, y + sy/2 + 9, "center", "18px Sans");
			continue;
		} else if(i <= 9) {
			// Side 1
			x += (11 - i) * (this.tileSize/2 + this.tileSpacing) - this.tileSpacing;
			y += this.tileSize * 5.5 + this.tileSpacing*10;
			sx /= 2;
		} else if(i == 10) {
			// Just visting
			y += this.tileSize * 5.5 + this.tileSpacing*10;
			var jk = (this.map[i] - this.minLandings) / (this.maxLandings - this.minLandings);
			var jColor = blend(this.colorMin, this.colorMax, jk);
			
			rect(ctx, x, y, sx, sy, jColor);
			text(ctx, this.map[i], x + sx/2 - this.tileSize*0.3, y + 21);
			text(ctx, "Just visiting", x + sx/2, y + 75, "center", "14px Sans");
			// Jail
			x += this.tileSize*0.4;
			jk = (this.goToJail - this.minLandings) / (this.maxLandings - this.minLandings);
			jColor = blend(this.colorMin, this.colorMax, jk);

			rect(ctx, x, y, sx*0.6, sy*0.6, jColor);
			text(ctx, this.goToJail, x + sx*0.6/2, y + 21);
			text(ctx, "Jail", x + sx*0.6/2, y + 40);
			continue;

		} else if(i <= 19) {
			// Side 2
			y += (21 - i) * (this.tileSize/2 + this.tileSpacing) - this.tileSpacing;
			sy /= 2;
		} else if(i == 20) {
			// Free parking
			rect(ctx, x, y, sx, sy, color);
			text(ctx, this.map[i], x + sx/2, y + 21);
			text(ctx, "Free", x + sx/2, y + sy/2 + 2, "center", "18px Sans");
			text(ctx, "Parking", x + sx/2, y + sy/2 + 25, "center", "18px Sans");
			continue;
		} else if(i <= 29) {
			// Side 3
			x += (i - 19) * (this.tileSize/2 + this.tileSpacing) - this.tileSpacing;
			sx /= 2;
		} else if(i == 30) {
			// Go to jail
			x += this.tileSize * 5.5 + this.tileSpacing*10;
			
			rect(ctx, x, y, sx, sy, color);
			text(ctx, this.map[i], x + sx/2, y + 21);
			text(ctx, "Go to", x + sx/2, y + sy/2 + 2, "center", "18px Sans");
			text(ctx, "Jail", x + sx/2, y + sy/2 + 25, "center", "18px Sans");
			continue;

		} else {
			// Side 4
			x += this.tileSize * 5.5 + this.tileSpacing*10;
			y += (i - 29) * (this.tileSize/2 + this.tileSpacing) - this.tileSpacing;
			sy /= 2;
		}
		rect(ctx, x, y, sx, sy, color);
		text(ctx, this.map[i], x + sx/2, y + 21);
	}

};

// Show stats
Board.prototype.Stats = function() {
	text(ctx, "Rolls: " + this.rolls, this.offsetX + 135, this.offsetY + 260, "left", "24px Sans");
	text(ctx, "Games: " + this.games, this.offsetX + 135, this.offsetY + 290, "left", "24px Sans");
	text(ctx, "Max Landings: " + this.maxLandings, this.offsetX + 135, this.offsetY + 320, "left", "24px Sans");
	text(ctx, "Min Landings: " + this.minLandings, this.offsetX + 135, this.offsetY + 350, "left", "24px Sans");
	text(ctx, "Min/Max Range: " + (this.maxLandings - this.minLandings), this.offsetX + 135, this.offsetY + 380, "left", "24px Sans");
	for(var i = 0; i < 9; ++i) {
		var color = blend(this.colorMax, this.colorMin, i*0.12);
		var x = this.offsetX + 435;
		var y = (canvas.height - 9*35)/2 + i*35;
		rect(ctx, x, y, 70, 30, color);
	}
	text(ctx, "Most Landed On", this.offsetX + 470, (canvas.height - 9*35)/2 - 20);
	text(ctx, "Least Landed On", this.offsetX + 470, (canvas.height - 9*35)/2 - 20 + 9*35 + 40);
}

Board.prototype.NewGame = function() {
	this.games++;
	this.pos = 0;
	this.rollsLeft = random(20, 40);
}

Board.prototype.UpdatePosition = function(npos) {
	this.pos = (npos >= 0) ? npos : 40 + npos;
	this.map[this.pos]++;
	this.minLandings = this.maxLandings;
	for(var i = 0; i < this.mapLength; ++i) {
		this.maxLandings = Math.max(this.maxLandings, this.map[i]);
		this.minLandings = Math.min(this.minLandings, this.map[i]);
	}
}

Board.prototype.HandleCommunnityChest = function() {
	// Community chest
	var r = random(1, 16);
	if(r == 1) {
		// Jailbreak card
		this.jailBreaks++;
	} else if(r == 2) {
		// Go to jail card
		this.pos = 10;
		this.inJail = true;
		this.goToJail++;
	} else if(r == 3) {
		// Go to start card
		this.UpdatePosition(0);
	}
}

Board.prototype.HandleChance = function() {
	// Chance
	var r = random(1, 16);
	if(r == 1) {
		// Jailbreak card
		this.jailBreaks++;
	} else if(r == 2) {
		// Go to jail card
		this.pos = 10;
		this.inJail = true;
		this.goToJail++;
		// this.UpdateLandings();
	} else if(r == 3) {
		// Go to start card
		this.UpdatePosition(0);
	} else if(r == 4) {
		// Go back 3 tiles
		this.UpdatePosition(this.pos - 3);
	} else if(r == 5) {
		// Go to 11
		this.UpdatePosition(11);
	} else if(r == 6) {
		// Go to 15
		this.UpdatePosition(15);
	} else if(r == 7) {
		// Go to 24
		this.UpdatePosition(24);
	} else if(r == 8) {
		// Go to 39
		this.UpdatePosition(39);
	}

	if(this.pos == 33) {
		this.HandleCommunnityChest();
	}	
}

Board.prototype.Update = function() {
	// If there are no rolls left, start new game
	if(this.rollsLeft <= 0) {
		this.NewGame();
	}
	var d1, d2;
	// If in jail, take 3 rolls at most
	if(this.inJail) {
		var i;
		for(i = 0; i < 3; i++) {
			this.rolls++;
			this.rollsLeft--;
			d1 = random(1, 6);
			d2 = random(1, 6);
			if(d1 == d2)
				break;
			if(this.jailBreaks > 0) {
				this.jailBreaks--;
				break;
			}
		}
		this.inJail = false;
	} else {
		this.rolls++;
		this.rollsLeft--;
		d1 = random(1, 6);
		d2 = random(1, 6);
	}
	// Update position and landings
	this.UpdatePosition((this.pos + d1 + d2) % 40);
	// Go to Jail tile
	if(this.pos == 30) {
		this.pos = 10;
		this.inJail = true;
		this.goToJail++;
	} else if(this.pos == 2 || this.pos == 17 || this.pos == 33) {
		this.HandleCommunnityChest();
	} else if(this.pos == 7 || this.pos == 22 || this.pos == 36) {
		this.HandleChance();
	}
};

// Initialize board and start simulation
var board = new Board(90, 5, true);
board.NewGame();

if(board.simulation) {
	var tick = setInterval(function() {
		board.Update();
		board.Draw();
		board.Stats();
		if(board.games > 300) {
			clearInterval(tick);
		}

	}, 20);
} else {
	while(board.games < 300) {
		board.Update();
	}
	board.Draw();
	board.Stats();
}

