'use strict';

const Game = class {
  constructor(ctx, assetManager) {
    // Logic
    this.points = 0;
    this.gameLevel = 3;
    this.ducksMissed = 0;
    this.maxMisses = 20;
    this.gameFinished = false;
    this.isRunning = false;
    this.ducks = [];

    // Graphics
    this.ctx = ctx;
    this.screenWidth = ctx.canvas.width;
    this.screenHeight = ctx.canvas.height;
    this.hud = {
      textColor: '#ffffff',
      textOutline: '#000000',
      textColorSpecial: '#ff3333',
      lineWidth: 3,
      font: '32px Georgia',
      fontGameOver: 'bold 100px Arial',
      missLimit: 15,
      paddingX: 15,
      paddingY: 30,
    };
    this.ctx.lineWidth = this.hud.lineWidth;
    this.ctx.textBaseline = 'middle';
    this.ctx.strokeStyle = this.hud.textOutline;

    // Assets
    this.assetsFolderPath = 'assets';
    this.assetList = [];
    this.background = 'background.jpeg';
    // Assets to load (`assetsFolderPath`/`path`-`num`.`fileType`)
    // frameLength is in ms, should be bigger than refresh rate, since
    // requestAnimationFrame is basically refresh rate
    this.animations = [
      {path: 'fly-1', fileType: 'gif', frameCount: 4, frameLength: 150},
      {path: 'fly-2', fileType: 'gif', frameCount: 6, frameLength: 100},
      {path: 'fly-3', fileType: 'gif', frameCount: 8, frameLength: 100},
      {path: 'walk-1', fileType: 'gif', frameCount: 5, frameLength: 150},
      {path: 'walk-2', fileType: 'gif', frameCount: 6, frameLength: 120},
      {path: 'walk-3', fileType: 'gif', frameCount: 12, frameLength: 100},
      {path: 'walk-4', fileType: 'gif', frameCount: 6, frameLength: 100},
    ];

    this.assetList.push(this.background);
    for (let i = 0; i < this.animations.length; i++) {
      for (let j = 0; j < this.animations[i].frameCount; j++) {
        this.assetList.push(
            this.animations[i].path + '/' + String(j) + '.' +
            this.animations[i].fileType);
      }
    }

    this.assetManager = assetManager;
    this.assetManager.assetsFolderPath = this.assetsFolderPath;
  }

  start() {
    this.isRunning = true;
  }

  stop() {
    this.isRunning = false;
  }

  gameOver() {
    this.gameFinished = true;
    this.ducks = {};
  }

  // Logic
  handleLogic() {
    // Handle logic updates only when running
    if (!this.isRunning) return;

    if (this.ducksMissed >= this.maxMisses) {
      this.gameOver();
    }

    for (let i = 0; i < this.ducks.length; i++) {
      const duck = this.ducks[i];

      // Update position
      duck.x += duck.speed;

      if (duck.type == 2) {
        duck.y += duck.delta;
        duck.offset -= duck.delta;
        if (duck.offset < 0 || duck.offset > 200) {
          duck.delta = -duck.delta;
        }
      }

      // Lose a chance if duck out of screen
      const img = this.assetManager.getAsset(duck.getFramePath());
      if (duck.x > this.screenWidth + img.width / 2 ||
          duck.x < -img.width / 2) {
        this.ducks.splice(i, 1);
        this.ducksMissed++;
      }
    }

    // Add more ducks if needed
    if (this.ducks.length < this.gameLevel) {
      let id = Util.getRandomIntInclusive(0, this.animations.length - 1);
      if (id < 3) {
        this.addDuck(id, 0, this.screenHeight / 5);
      } else {
        this.addDuck(id, 0, this.screenHeight * 4 / 5);
      }
    }
  }

  registerClick(position) {
    for (let i = this.ducks.length - 1; i >= 0; i--) {
      const duck = this.ducks[i];
      const img = this.assetManager.getAsset(duck.getFramePath());
      const minX = duck.x - img.width / 2;
      const maxX = minX + img.width;
      const minY = duck.y - img.height / 2;
      const maxY = minY + img.height;

      if (position.x >= minX && position.x <= maxX && position.y >= minY &&
          position.y <= maxY) {
        // Basic kill of top-most duck
        this.ducks.splice(i, 1);
        this.points += duck.value;
        this.manageGameLevel();
      }
    }
  }

  addDuck(type, x, y) {
    this.ducks.push(new Duck(type, this.animations[type], x, y));
  }

  manageGameLevel() {
    if (this.points > 100 && this.points < 200 && this.gameLevel < 4) {
      this.gameLevel++;
    }
    if (this.points > 200 && this.points < 300 && this.gameLevel < 5) {
      this.gameLevel++;
    }
    if (this.points > 300 && this.points < 400 && this.gameLevel < 6) {
      this.gameLevel++;
    }
  }


  // Graphics
  drawHud() {
    this.ctx.font = this.hud.font;
    this.ctx.fillStyle = this.hud.textColor;

    this.strokeFill(
        'start', 'Points: ' + this.points, this.hud.paddingX,
        this.hud.paddingY);

    if (this.ducksMissed >= this.hud.missLimit) {
      this.ctx.fillStyle = this.hud.textColorSpecial;
    }

    this.strokeFill(
        'end', 'Chances: ' + (this.maxMisses - this.ducksMissed),
        this.screenWidth - this.hud.paddingX, this.hud.paddingY);
  }

  drawDucks(delta) {
    for (let i = 0; i < this.ducks.length; i++) {
      const duck = this.ducks[i];
      // Handle animation only when running
      if (this.isRunning) {
        duck.progressAnimation(delta);
      }

      // Draw animation frame
      const img = this.assetManager.getAsset(duck.getFramePath());
      let x = duck.x - img.width / 2;
      const y = duck.y - img.height / 2;
      // Flip if needed
      this.ctx.save();
      if (duck.flipped) {
        this.ctx.scale(-1, 1);
        x = -x - img.width;
      }

      this.ctx.drawImage(img, x, y);
      this.ctx.restore();
    }
  }

  drawGameOver() {
    this.ctx.font = this.hud.fontGameOver;
    this.ctx.fillStyle = this.hud.textColorSpecial;
    this.strokeFill(
        'center', 'GAME OVER', this.screenWidth / 2, this.screenHeight / 2);
  }

  handleGraphics(delta) {
    // Clear screen with background
    this.ctx.drawImage(this.assetManager.getAsset(this.background), 0, 0);

    if (this.gameFinished) {
      this.drawGameOver();
      return;
    }

    this.drawDucks(delta);
    this.drawHud();
  };

  strokeFill(textAlign, text, x, y) {
    const oldAlign = this.ctx.textAlign;
    this.ctx.textAlign = textAlign;
    this.ctx.strokeText(text, x, y);
    this.ctx.fillText(text, x, y);
    this.ctx.textAlign = oldAlign;
  }
};
