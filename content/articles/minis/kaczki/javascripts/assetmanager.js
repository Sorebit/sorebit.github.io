'use strict';
// Adapted from: https://www.html5rocks.com/en/tutorials/games/assetmanager/

// fullPath is prefixed by assets folder path
// relativePath describes path inside assets folder
const AssetManager = class {
  constructor() {
    this.successCount = 0;
    this.errorCount = 0;
    this.downloadQueue = [];
    this.cache = {};
    this.assetsFolderPath = '';
  }

  queueDownload(relativePath) {
    this.downloadQueue.push(relativePath);
  }

  downloadAll(callback) {
    if (this.downloadQueue.length === 0) {
      callback();
      return;
    }

    for (let i = 0; i < this.downloadQueue.length; i++) {
      const relativePath = this.downloadQueue[i];
      const fullPath = this.assetsFolderPath + '/' + relativePath;
      const img = new Image();
      const that = this;

      img.addEventListener('load', function() {
        that.successCount++;
        if (that.isDone()) {
          callback();
        }
      }, false);

      img.addEventListener('error', function() {
        that.errorCount++;
        console.log('Couldn\'t load:', fullPath);
        if (that.isDone()) {
          callback();
        }
      }, false);

      img.src = fullPath;
      this.cache[relativePath] = img;
    }
  }

  isDone() {
    return (this.downloadQueue.length === this.successCount + this.errorCount);
  }

  getAsset(relativePath) {
    return this.cache[relativePath];
  }
}
