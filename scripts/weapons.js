// Weapon ----------------------------------------------------------------------
var Weapon = function( team, damage, rate, range ) {
  this.team   = team;
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
var Bullet = function( x, y, red, green, blue, alpha, radius, team ) {
  Circle.call( this, x, y, red, green, blue, alpha, radius );
  this.team = team;
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
      if ( characters[i].getTeam() !== this.team ) {
        distance = Math.sqrt( ( this.x - characters[i].getX() ) *
                              ( this.x - characters[i].getX() ) +
                              ( this.y - characters[i].getY() ) *
                              ( this.y - characters[i].getY() ) );
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
    this.setVelocity( 0, 0 );
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
var Gun = function( team, damage, rate, range, speed ) {
  Weapon.call( this, team, damage, rate, range );

  this.speed  = speed;
  this.target = {
    x: Number.NaN,
    y: Number.NaN
  };
};

Gun.prototype = new Weapon();
Gun.prototype.constructor = Gun;

Gun.prototype.update = function( elapsedTime ) {
  Weapon.prototype.update.call( this, elapsedTime );
  if ( this.firing && this.hasTarget() ) {
    this.fire();
  }
};

Gun.prototype.fire = function() {
  var bullet = new Bullet( this.x, this.y, 0, 0, 0, 1.0, 2, this );

  bullet.velocity.x = x - this.x;
  bullet.velocity.y = y - this.y;

  var magnitude = Math.sqrt( bullet.velocity.x *
                             bullet.velocity.x +
                             bullet.velocity.y *
                             bullet.velocity.y );
  bullet.velocity.x /= magnitude / this.bulletSpeed;
  bullet.velocity.y /= magnitude / this.bulletSpeed;

  _game.addBullet( bullet );
};

Gun.prototype.setTarget = function( x, y ) {
  this.target.x = x;
  this.target.y = y;
};

Gun.prototype.setEntityAsTarget = function( entity ) {
  if ( entity !== null && entity !== undefined ) {
    this.setTarget( entity.getX(), entity.getY() );
  } else {
    this.setTarget( Number.NaN, Number.NaN );
  }
};

Gun.prototype.hasTarget = function() {
  return !isNaN( this.target.x ) && !isNan( this.target.y );
};
