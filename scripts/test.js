// This terrain object isn't used yet.
function initTerrain( width, height ) {
  var i, j;
  var array = [];
  for ( i = 0; i < height; i++ ) {
    array[i] = [];
    for ( j = 0; j < width; j++ ) {
      array[i].push( Math.random() );
    }
  }
}

function printTerrain( array ) {
  var i, j;
  var rowLength = array.length;
  var colLength = array[0].length;
  for ( i = 0; i < rowLength; i++ ) {
    for ( j = 0; j < colLength; j++ ) {
      console.log( array[i][j] );
      if ( j < array[i].length -1 ) {
        console.log( '\t' );
      }
    }

    if ( i < array.length - 1 ) {
      console.log( '\n' );
    }
  }
}

var Terrain = function( width, height ) {
  this.map = [];
  this.width = width;
  this.height = height;
};

Terrain.prototype.generateMidpointDisplacement = function() {
};

Terrain.prototype.toString = function() {
  var string = '';
  var i, j;
  for ( i = 0; i < this.height; i++ ) {
    for ( j = 0; j < this.width; j++ ) {
      string += this.map[i][j];

      if ( j < this.width - 1 )
        string += '\t';
    }

    if ( i < this.height - 1 )
      string += '\n';
  }
};


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
  _game.tick();
  requestAnimFrame( loop );
}

function init() {
  _game.init();

  _game._canvas.addEventListener( 'mousedown', onMouseDown );
  _game._canvas.addEventListener( 'mousemove', onMouseMove );

  loop();
}

init();
