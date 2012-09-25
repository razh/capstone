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

// var canvas;
// var contex;
// var width  = 800;
// var height = 600;
var trackMouse = false;
// TODO: Not really WebGL right now.
// function initWebGL() {
//   canvas = document.getElementById( "test" );
//   canvas.width = width;
//   canvas.height = height;

//   contex = canvas.getContext( "2d" );

//   canvas.addEventListener( 'mousedown', onMouseDown );
//   canvas.addEventListener( 'mousemove', onMouseMove );
// }

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

// var easingFunctions = new Easing();

// var characters = [];
// var bullets = [];
// var effects = [];

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

// function drawCanvas() {
//   update();
//   contex.clearRect( 0, 0, width, height );

//   // contex.fillStyle = 'rgba( 200, 200, 200, 1.0 )';
//   // contex.fillRect( 0, 0, width, height );

//   // Draw characters.
//   var i;
//   for ( i = characters.length - 1; i >= 0; i-- ) {
//     characters[i].draw( contex );
//   }

//   // Draw bullets.
//   for ( i = bullets.length - 1; i >= 0; i-- ) {
//     bullets[i].draw( contex );
//   }

//   requestAnimFrame( drawCanvas );
// }


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

// var prevTime = Date.now();
// var currTime;

// function update() {
//   currTime = Date.now();
//   var elapsedTime = currTime - prevTime;
//   prevTime = currTime;

//   // Update characters.
//   var i;
//   for ( i = characters.length - 1; i >= 0; i-- ) {
//     characters[i].update( elapsedTime );
//   }

//   // Update bullets.
//   for ( i = bullets.length - 1; i >= 0; i-- ) {
//     bullets[i].update( elapsedTime );
//   }

//   for ( i = effects.length - 1; i >= 0; i-- ) {
//     effects[i].update( elapsedTime );
//   }
// }

// function initGame() {
//   // "Good guy"
//   characters.push( new Character( 400, 400, 0, 0, 200, 1.0, 10 ) );
//   characters[0].velocity = {
//     x: 0,
//     y: 0
//   };
//   characters[0].firing = false;

//   // "Bad guy"
//   characters.push( new Character( 200, 200, 200, 0, 0, 1.0, 10 ) );
//   characters[1].setTeam(1);
// }

// function init() {
//   initGame();
//   initWebGL();
//   console.log( "test" );
//   drawCanvas();
// }

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
