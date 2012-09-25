// Weapon ----------------------------------------------------------------------
var Weapon = function( entity, damage, rate, range ) {
  this.firing = true;
  this.time   = 0;

  this.entity = entity;
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


// Gun -------------------------------------------------------------------------
var Gun = function( entity, damage, rate, range, speed ) {
  Weapon.call( this, entity, damage, rate, range );

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
  // console.log( this.entity.x );
  var bullet = new Bullet(
    this.entity.x,
    this.entity.y,
    0,
    0,
    0,
    1.0,
    2,
    this.entity.team
  );

  bullet.velocity.x = this.target.x - this.entity.x;
  bullet.velocity.y = this.target.y - this.entity.y;

  var magnitude = Math.sqrt( bullet.velocity.x *
                             bullet.velocity.x +
                             bullet.velocity.y *
                             bullet.velocity.y );
  bullet.velocity.x /= magnitude / this.speed;
  bullet.velocity.y /= magnitude / this.speed;

  _game.addProjectile( bullet );

  this.firing = false;
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
  return !Number.isNaN( this.target.x ) && !Number.isNaN( this.target.y );
};


// Bullet ----------------------------------------------------------------------
var Bullet = function( x, y, red, green, blue, alpha, radius, team ) {
  Circle.call( this, x, y, red, green, blue, alpha, radius );

  this.collides = true;
  this.team     = team;
};

Bullet.prototype = new Circle();
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function( elapsedTime ) {
  Circle.prototype.update.call( this, elapsedTime );

  var removeBullet = false;
  if ( this.collides ) {
    var distance;
    var i;
    var characters = _game.getCharacters();
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
    _game.addEffect(
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
          _game.removeProjectile( this );
          return {
            effect: undefined
          };
        })
      )
    );
  }
};
