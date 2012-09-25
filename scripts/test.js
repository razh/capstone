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

var canvas;
var contex;
var width = 800;
var height = 600;
var trackMouse = false;
// TODO: Not really WebGL right now.
function initWebGL() {
  canvas = document.getElementById( "test" );
  canvas.width = width;
  canvas.height = height;

  contex = canvas.getContext( "2d" );

  canvas.addEventListener( 'mousedown', onMouseDown );
  canvas.addEventListener( 'mousemove', onMouseMove );
}

function onMouseMove( event ) {
  event.pageX -= canvas.offsetLeft;
  event.pageY -= canvas.offsetTop;

  if ( trackMouse ) {
    characters[0].x = event.pageX;
    characters[0].y = event.pageY;
  }
}

function onMouseDown( event ) {
  event.pageX -= canvas.offsetLeft;
  event.pageY -= canvas.offsetTop;

  trackMouse = !trackMouse;
  if ( trackMouse ) {
    canvas.style.cursor = 'none';
    characters[0].x = event.pageX;
    characters[0].y = event.pageY;
  } else {
    canvas.style.cursor = 'default';
  }
}

function draw() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
}


var Effect = function( object, properties, duration, easing, step, complete ) {
  this.object = object;
  this.properties = properties;
  this.duration = duration;
  this.easing = easing;
  this.step = step;
  this.complete = complete;

  this.begin = {};
  for ( var key in this.properties )
    this.begin[ key ] = this.object[ key ];

  this.time = 0;
};

Effect.prototype.update = function( elapsedTime ) {
  this.time += elapsedTime;

  var key;
  // When the effect is complete, call the complete function.
  if ( this.time >= this.duration ) {
    for ( key in this.properties )
      this.object[ key ] = this.begin[ key ] + this.properties[ key ];

    removeFromArray( this, effects );
    if ( this.complete !== null ) {
      var effect = this.complete.call( this.object ).effect;
      if ( effect !== null && effect !== undefined ) {
        effects.push( effect );
      }
    }
  } else {
    for ( key in this.properties ) {
      this.object[ key ] = this.easing.call(
        this,
        this.time,
        this.begin[ key ],
        this.properties[ key ],
        this.duration
      );
    }
  }

  // After the animation step is executed, call the step function.
  if ( this.step !== undefined ) {
    var deltas = {};
    for ( key in this.properties )
      deltas[ key ] = this.object[ key ] - this.begin[ key ];

    this.step.call( this, deltas );
  }
};

/*
  Robert Penner's easing functions.
  t: time
  b: begin
  c: change
  d: duration
*/
var Easing = (function() {
  return {
    linear: function( t, b, c, d ) {
      // console.log( "t: " + t + ", b: " + b + ', c: ' + c + ", d: " + d + ", x: " + (c * t / d + b) );
      return c * t / d + b;
    },

    easeInQuad: function( t, b, c, d ) {
      t /= d;
      return c * t * t + b;
    },

    easeOutQuad: function( t, b, c, d ) {
      t /= d;
      return -c * t * ( t - 2 ) + b;
    },

    easeInOutQuad: function( t, b, c, d ) {
      t /= d / 2;
      if ( t < 1 )
        return c / 2 * t * t + b;
      t--;
      return -c / 2 * ( t * ( t - 2 ) - 1 ) + b;
    },

    easeInCubic: function( t, b, c, d ) {
      t /= d;
      return c * t * t * t + b;
    },

    easeOutCubic: function( t, b, c, d ) {
      t /= d;
      t--;
      return c * ( t * t * t + 1 ) + b;
    },

    easeInOutCubic: function( t, b, c, d ) {
      t /= d / 2;
      if ( t < 1 )
        return c / 2 * t * t * t + b;
      t -= 2;
      return c / 2 * ( t * t * t + 2 ) + b;
    },

    easeInQuart: function( t, b, c, d ) {
      t /= d;
      return c * t * t * t * t + b;
    },

    easeOutQuart: function( t, b, c, d ) {
      t /= d;
      t--;
      return -c * ( t * t * t * t - 1 ) + b;
    },

    easeInOutQuart: function( t, b, c, d ) {
      t /= d / 2;
      if ( t < 1 )
        return c / 2 * t * t * t * t + b;
      t -= 2;
      return -c / 2 * ( t * t * t * t - 2 ) + b;
    },

    easeInQuint: function( t, b, c, d ) {
      t /= d;
      return c * t * t * t * t * t + b;
    },

    easeOutQuint: function( t, b, c, d ) {
      t /= d;
      t--;
      return c * ( t * t * t * t * t + 1 ) + b;
    },

    easeInOutQuint: function( t, b, c, d ) {
      t /= d / 2;
      if ( t < 1 )
        return c / 2 * t * t * t * t * t + b;
      t -= 2;
      return c / 2 * ( t * t * t * t * t + 2 ) + b;
    },

    easeInSine: function( t, b, c, d ) {
      return -c * Math.cos( t / d * ( Math.PI / 2 ) ) + c + b;
    },

    easeOutSine: function( t, b, c, d ) {
      return c * Math.sin( t / d * ( Math.PI / 2 ) ) + b;
    },

    easeInOutSine: function( t, b, c, d ) {
      return -c / 2 * ( Math.cos( Math.PI * t / d ) - 1 ) + b;
    },

    easeInExpo: function( t, b, c, d ) {
      return c * Math.pow( 2, 10 * ( t / d - 1 ) ) + b;
    },

    easeOutExpo: function( t, b, c, d ) {
      return c * ( -Math.pow( 2, -10 * t/ d ) + 1 ) + b;
    },

    easeInOutExpo: function( t, b, c, d ) {
      t /= d / 2;
      if ( t < 1 )
        return c / 2 * Math.pow( 2, 10 * ( t - 1 ) ) + b;
      t--;
      return c / 2 * ( - Math.pow( 2, -10 * t ) + 2 ) + b;
    },

    easeInCirc: function( t, b, c, d ) {
      t /= d;
      return -c * ( Math.sqrt( 1 - t * t ) - 1 ) + b;
    },

    easeOutCirc: function( t, b, c, d ) {
      t /= d;
      t--;
      return c * Math.sqrt( 1 - t * t ) + b;
    },

    easeInOutCirc: function( t, b, c, d ) {
      t /= d / 2;
      if ( t < 1 )
        return -c / 2 * ( Math.sqrt( 1 - t * t ) - 1 ) + b;
      t -= 2;
      return c / 2 * ( Math.sqrt( 1 - t * t ) + 1 ) + b;
    }
  };
}) ();

// var easingFunctions = new Easing();

var characters = [];
var bullets = [];
var effects = [];

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

function drawCanvas() {
  update();
  contex.clearRect( 0, 0, width, height );

  contex.fillStyle = 'rgba( 200, 200, 200, 1.0 )';
  contex.fillRect( 0, 0, width, height );

  // Draw characters.
  var i;
  for ( i = characters.length - 1; i >= 0; i-- ) {
    characters[i].draw( contex );
  }

  // Draw bullets.
  for ( i = bullets.length - 1; i >= 0; i-- ) {
    bullets[i].draw( contex );
  }

  requestAnimFrame( drawCanvas );
}


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

var prevTime = Date.now();
var currTime;

function update() {
  currTime = Date.now();
  var elapsedTime = currTime - prevTime;
  prevTime = currTime;

  // Update characters.
  var i;
  for ( i = characters.length - 1; i >= 0; i-- ) {
    characters[i].update( elapsedTime );
  }

  // Update bullets.
  for ( i = bullets.length - 1; i >= 0; i-- ) {
    bullets[i].update( elapsedTime );
  }

  for ( i = effects.length - 1; i >= 0; i-- ) {
    effects[i].update( elapsedTime );
  }
}

function initGame() {
  // "Good guy"
  characters.push( new Character( 400, 400, 0, 0, 200, 1.0, 10 ) );
  characters[0].velocity = {
    x: 0,
    y: 0
  };
  characters[0].firing = false;

  // "Bad guy"
  characters.push( new Character( 200, 200, 200, 0, 0, 1.0, 10 ) );
}

function init() {
  initGame();
  initWebGL();
  console.log( "test" );
  drawCanvas();
}

init();
