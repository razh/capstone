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


var Entity = function( x, y, red, green, blue, alpha ) {
  this.x = x;
  this.y = y;

  this.red   = red;
  this.green = green;
  this.blue  = blue;
  this.alpha = alpha;

  this.lifeTime = 0;

  this.velocity = {
    x: 0.25,
    y: 0.25
  };
};

Entity.prototype.update = function( elapsedTime ) {
  this.x += elapsedTime * this.velocity.x;
  this.y += elapsedTime * this.velocity.y;
};

var Circle = function( x, y, red, green, blue, alpha, radius ) {
  Entity.call( this, x, y, red, green, blue, alpha );
  this.radius = radius;

  this.lifeTime = 0;
  this.maximumAge = 2000;
};

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.update = function( elapsedTime ) {
  Entity.prototype.update.call( this, elapsedTime );

  if ( this.radius > this.x ) {
    this.x = this.radius;
    this.velocity.x = -this.velocity.x;
  }
  if ( this.x + this.radius > width ) {
    this.x = width - this.radius;
    this.velocity.x = -this.velocity.x;
  }
  if ( this.radius > this.y ) {
    this.y = this.radius;
    this.velocity.y = -this.velocity.y;
  }
  if ( this.y + this.radius > height ) {
    this.y = height - this.radius;
    this.velocity.y = -this.velocity.y;
  }
};

var Weapon = function() {
  this.firing = true;
  this.fireRate = 0;
  this.range = 200;
};

var Character = function( x, y, red, green, blue, alpha, radius ) {
  Circle.call( this, x, y, red, green, blue, alpha, radius );

  this.canFire = true;
  this.fireTime = 0;
  this.fireRate = 200;
  this.bulletSpeed = 0.5;

  this.health = 100;

  this.isHit = false;
  this.hitTime = 0;
  this.hitLength = 100;
};

Character.prototype = new Circle();
Character.prototype.constructor = Character;

Character.prototype.fireAt = function( x, y ) {
  var bullet = new Bullet( this.x, this.y, 0, 0, 0, 1.0, 2, this );

  bullet.velocity.x = x - this.x;
  bullet.velocity.y = y - this.y;

  var magnitude = Math.sqrt( bullet.velocity.x *
                             bullet.velocity.x +
                             bullet.velocity.y *
                             bullet.velocity.y );
  bullet.velocity.x /= magnitude / this.bulletSpeed;
  bullet.velocity.y /= magnitude / this.bulletSpeed

  bullets.push( bullet );
};

Character.prototype.update = function( elapsedTime ) {
  Circle.prototype.update.call( this, elapsedTime );
  // Find enemy.
  var enemy;
  for ( var i = characters.length - 1; i >= 0; i-- ) {
    if ( characters[i] !== this ) {
      enemy = characters[i];
    }
  }

  if ( this.canFire && this.fireTime <= 0 ) {
    this.fireTime = this.fireRate;
    if ( enemy !== null && enemy !== undefined ) {
      this.fireAt( enemy.x, enemy.y );
    } else {
      this.fireAt(
        this.x + this.velocity.x * 50,
        this.y + this.velocity.y * 50
      );
    }
  } else {
    this.fireTime -= elapsedTime;
  }
};

Character.prototype.hit = function() {
  if ( !this.isHit ) {
    this.isHit = true;
    // Effects chain. Nasty syntax, but it works.
    effects.push(
      new Effect(
        this,
        {
          radius: 15,
          red: 200,
        },
        60,
        Easing.easeInOutCubic,
        undefined,
        (function() {
          return {
            effect: new Effect(
              this,
              {
                radius: -15,
                red: -200,
              },
              150,
              Easing.linear,
              undefined,
              (function() {
                this.isHit = false;
                return {
                  effect: undefined
                };
              })
            )
          };
        })
      )
    );
  }
};

Character.prototype.draw = function( ctx ) {
  Circle.prototype.draw.call( this, ctx );
};


var Bullet = function( x, y, red, green, blue, alpha, radius, shooter ) {
  Circle.call( this, x, y, red, green, blue, alpha, radius );
  this.shooter = shooter;
  this.collides = true;
};

Bullet.prototype = new Circle();
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function( elapsedTime ) {
  Circle.prototype.update.call( this, elapsedTime );

  var removeBullet = false;
  if ( this.collides ) {
    var distance;
    var i;
    for ( i = characters.length - 1; i >= 0; i-- ) {
      if ( characters[i] !== this.shooter ) {
        distance = Math.sqrt( ( this.x - characters[i].x ) *
                              ( this.x - characters[i].x ) +
                              ( this.y - characters[i].y ) *
                              ( this.y - characters[i].y ) );
        if ( distance < this.radius + characters[i].radius ) {
          characters[i].hit();
          removeBullet = true;
        }
      }
    }
  }

  if ( this.lifeTime > this.maximumAge ) {
    removeBullet = true;
  } else {
    this.lifeTime += elapsedTime;
  }

  if ( removeBullet ) {
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.collides = false;
    effects.push(
      new Effect(
        this,
        {
          radius: 5,
          alpha: -1.0
        },
        500,
        Easing.easeOutQuad,
        undefined,
        (function() {
          removeFromArray( this, bullets );
          return {
            effect: undefined
          };
        })
      )
    );
  }
};


// new Circle( 0, 0, 2, 'rgba( 0, 0, 0, 1.0 )' );
Circle.prototype.draw = function( ctx ) {
  ctx.beginPath();
  ctx.arc(
    Math.round( this.x ),
    Math.round( this.y ),
    Math.round( this.radius ),
    0,
    Math.PI * 2,
    true
  );
  ctx.fillStyle = 'rgba( ' + Math.round( this.red )   +
                  ', '     + Math.round( this.green ) +
                  ','      + Math.round( this.blue )  +
                  ','      + this.alpha + ' )';
  ctx.fill();
};


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
  characters[0].canFire = false;

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
