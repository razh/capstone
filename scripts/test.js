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
Object.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  } return newObj;
};
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

  _game._canvas.addEventListener( 'mousedown', onMouseDown, null );
  _game._canvas.addEventListener( 'mousemove', onMouseMove, null );
  document.addEventListener( 'keydown', (function ( event ) {
    if ( event.keyCode === 81 )
      quit();
  }), null );

  loop();
}

function quit() {
  running = false;

  _game._canvas.removeEventListener( 'mousedown', onMouseDown );
  _game._canvas.removeEventListener( 'mousemove', onMouseMove );
}

var running = true;

init();
