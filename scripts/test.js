var trackMouse = false;

function onMouseMove( event ) {
  event.pageX -= _game._canvas.offsetLeft;
  event.pageY -= _game._canvas.offsetTop;

  if ( trackMouse ) {
    _game._characters[0].setXY( event.pageX, event.pageY )
  }
}

function onMouseDown( event ) {
  event.pageX -= _game._canvas.offsetLeft;
  event.pageY -= _game._canvas.offsetTop;

  trackMouse = !trackMouse;
  if ( trackMouse ) {
    _game._canvas.style.cursor = 'none';
    _game._characters[0].setXY( event.pageX, event.pageY );
  } else {
    _game._canvas.style.cursor = 'default';
  }
}

function draw() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
}

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame       ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         window.oRequestAnimationFrame      ||
         window.msRequestAnimationFrame     ||
         function( callback ) {
            window.setTimeout( callback, 1000 / 60 );
         };
})();

function inArray( elem, array ) {
  for ( var i = array.length - 1; i >= 0; i-- )
    if ( array[i] === elem )
      return i;

  return -1;
}

function removeFromArray( elem, array ) {
  var index = inArray( elem, array );
  if ( index !== -1 )
    array.splice( index, 1 );
}

function direction( x0, y0, x1, y1 ) {
  return Math.atan2( y1 - y0, x1 - x0 );
}


function loop() {
  if ( !running )
    return;

  _game.tick();
  requestAnimFrame( loop );
}

function init() {
  _game.init();

  _game._canvas.addEventListener( 'mousedown', onMouseDown );
  _game._canvas.addEventListener( 'mousemove', onMouseMove );
  document.addEventListener( 'keydown', (function ( event ) {
    if ( event.keyCode === 81 )
      quit();
  }));

  loop();
}

function quit() {
  running = false;

  _game._canvas.removeEventListener( 'mousedown', onMouseDown );
  _game._canvas.removeEventListener( 'mousemove', onMouseMove );
}

var running = true;

init();
