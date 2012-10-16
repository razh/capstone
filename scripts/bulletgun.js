// BulletGun -------------------------------------------------------------------

var BulletGun = function( entity, damage, rate, range, speed ) {
  Gun.call( this, entity, damage, rate, range );

  this.speed  = speed;
};

BulletGun.prototype = new Gun();
BulletGun.prototype.constructor = BulletGun;

BulletGun.prototype.fire = function() {
  var bullet = new Bullet(
    this.entity.x,
    this.entity.y,
    0, 0, 0, 1.0,
    2,
    this.entity.range,
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


// Bullet ----------------------------------------------------------------------
var Bullet = function( x, y, red, green, blue, alpha, radius, range, team ) {
  Circle.call( this, x, y, red, green, blue, alpha, radius );

  var originalx = x;
  var originaly = y;

  this.collides = true;
  this.team     = team;
};

Bullet.prototype = new Circle();
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function( elapsedTime ) {
  Circle.prototype.update.call( this, elapsedTime );

  var distance;
  var removeBullet = false;
  if ( this.collides ) {
    
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

  // Calculate bullet's distance from origin
  distance = Math.sqrt( ( this.x - this.originalx ) *
                        ( this.x - this.originalx ) +
                        ( this.y - this.originaly ) *
                        ( this.y - this.originaly ) );

  // Check if bullet is at the end of weapon range
  if ( distance >= this.range )
  {
    removeBullet = true;
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