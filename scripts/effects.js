var Effect = function( object, properties, duration, easing, step, complete ) {
  this.object     = object;
  this.properties = properties;
  this.duration   = duration;
  this.easing     = easing;
  this.step       = step;
  this.complete   = complete;

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

    _game.removeEffect( this );
    if ( this.complete !== null && this.complete !== undefined ) {
      var effect = this.complete.call( this.object ).effect;
      if ( effect !== null && effect !== undefined ) {
        _game.addEffect( effect );
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
