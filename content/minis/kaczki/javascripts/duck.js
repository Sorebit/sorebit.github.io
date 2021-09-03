'use strict';

const Duck = class {
  constructor(type, animation, x, y) {
    this.type = type;
    this.animation = animation;
    this.animationFrame = 0;
    this.deltaAccumulate = 0;
    this.flipped = Math.random() > 0.5;
    this.x = 0;
    this.y = y;

    switch (type) {
      case 0:
        this.speed = 4;
        this.value = 10;
        this.y += Util.getRandomIntInclusive(-150, 150);
        break;
      case 1:
        this.speed = 4;
        this.value = 10;
        this.y += Util.getRandomIntInclusive(-150, 150);
        break;
      case 2:
        this.speed = 7;
        this.offset = 150;
        this.delta = 4;
        this.value = 20;
        this.y += Util.getRandomIntInclusive(-100, 100);
        break;
      case 6:
        this.speed = 8;
        this.value = 15;
        break;
      default:
        this.speed = 2;
        this.value = 5;
        break;
    }

    if (this.flipped) {
      this.x = 1280;
      this.speed = -this.speed;
    }
  }

  progressAnimation(delta) {
    if (!isNaN(delta)) {
      this.deltaAccumulate += delta;
    }

    if (this.deltaAccumulate >= this.animation.frameLength) {
      this.deltaAccumulate %= this.animation.frameLength;
      this.animationFrame =
          (this.animationFrame + 1) % this.animation.frameCount;
    }
  }

  getFramePath() {
    return this.animation.path + '/' + String(this.animationFrame) + '.' +
        this.animation.fileType;
  }
};
