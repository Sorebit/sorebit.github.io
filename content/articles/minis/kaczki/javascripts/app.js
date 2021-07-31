(() => {
  'use strict';

  // We'll probably want to encapsulate this in an App class
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const GAME_WIDTH = 1280;
  const GAME_HEIGHT = 720;

  const assetManager = new AssetManager();
  let game = null;
  let lastTimestamp = null;

  const resizeHandler = () => {
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    if (window.innerWidth < GAME_WIDTH || window.innerHeight < GAME_HEIGHT) {
      console.log(
          'Window too small (Minimum: ' + GAME_WIDTH + ' x ' + GAME_HEIGHT);
      return false;
    }

    return true;
  };
  window.onresize = resizeHandler;

  // On document load
  window.onload = () => {
    resizeHandler();

    game = new Game(ctx, assetManager);

    canvas.onmousedown = mouseDownHandler;

    for (let i = 0; i < game.assetList.length; i++) {
      assetManager.queueDownload(game.assetList[i]);
    }

    assetManager.downloadAll(() => {
      console.log('Done loading.');
      game.start();
      step();
    });
  };

  // Step will be called just after all assets are ready.
  // Game itself has to be started
  const step = (timestamp) => {
    // Update timestamps
    // TODO: Does App really need it?
    if (!lastTimestamp) lastTimestamp = timestamp;
    let delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    game.handleLogic();
    game.handleGraphics(delta);
    window.requestAnimationFrame(step);
  };

  const mouseDownHandler = (e) => {
    game.registerClick(getRelativePos(e));
  };

  // Utilities
  const getRelativePos = (absolutePos) => ({
    x: absolutePos.x - canvas.offsetLeft,
    y: absolutePos.y - canvas.offsetTop,
  });
})();
