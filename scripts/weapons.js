// Weapon ----------------------------------------------------------------------
var Weapon = function( damage, rate, range ) {
  this.firing = true;
  this.time   = 0;
  this.rate   = rate;
  this.range  = range;
};

Weapon.prototype.update = function( elapsedTime ) {
  this.time += elapsedTime;
  if ( this.time >= this.rate ) {
    this.firing = true;
    this.time   = 0;
  }
};


// Bullet ----------------------------------------------------------------------
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


// Gun -------------------------------------------------------------------------
var Gun = function( damage, rate, range ) {
  Weapon.call( this, damage, rate, range );
  this.target = {
    x: 0,
    y: 0
  };
};

Gun.prototype = new Weapon();
Gun.prototype.constructor = Gun;

Gun.prototype.update = function( elapsedTime ) {
  Weapon.prototype.update.call( this, elapsedTime );
  if ( this.firing && this.target !== null ) {

  }
};

Gun.prototype.setEntityAsTarget = function( entity ) {
  this.target.x = entity.getX();
  this.target.y = entity.getY();
};

