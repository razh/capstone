// Weapon ----------------------------------------------------------------------
var Weapon = function( entity, damage, rate, range ) {
  this.firing = true;
  this.time   = 0;

  this.entity = entity;
  this.damage = damage;
  this.rate   = rate;
  this.range  = range;

  this.target = {
    x: Number.NaN,
    y: Number.NaN
  };
};

Weapon.prototype.update = function( elapsedTime ) {
  this.time += elapsedTime;
  if ( this.time >= this.rate ) {
    this.firing = true;
    this.time   = 0;
  }
};

Weapon.prototype.setTarget = function( x, y ) {
  this.target.x = x;
  this.target.y = y;
};

Weapon.prototype.setEntityAsTarget = function( entity ) {
  if ( entity !== null && entity !== undefined ) {
    this.setTarget( entity.getX(), entity.getY() );
  } else {
    this.setTarget( Number.NaN, Number.NaN );
  }
};

Weapon.prototype.hasTarget = function() {
  /* Cannot use isNaN() or Number.isNaN() as they are not implemented in Chrome
     for Android. */
  return this.target.x !== Number.NaN && this.target.y !== Number.NaN;
};

Weapon.prototype.targetInRange = function() {
  if ( this.entity === null || this.entity === undefined )
    return false;

  if ( this.range === -1 )
    return true;

  return this.range >= Math.sqrt( ( this.target.x - this.entity.getX() ) *
                                  ( this.target.x - this.entity.getX() ) +
                                  ( this.target.y - this.entity.getY() ) *
                                  ( this.target.y - this.entity.getY() ) );
};

// Gun -------------------------------------------------------------------------
var Gun = function( entity, damage, rate, range ) {
  Weapon.call( this, entity, damage, rate, range );
};

Gun.prototype = new Weapon();
Gun.prototype.constructor = Gun;

Gun.prototype.update = function( elapsedTime ) {
  Weapon.prototype.update.call( this, elapsedTime );

  if ( this.firing && this.hasTarget() && this.targetInRange() ) {
    this.fire();
  } else {
    this.firing = false;
  }
};

Gun.prototype.fire = function() {};


// BulletGun -------------------------------------------------------------------

var BulletGun = function( entity, damage, rate, range, speed ) {
  Gun.call( this, entity, damage, rate, range );

  this.speed  = speed;
};

BulletGun.prototype = new Gun();
BulletGun.prototype.constructor = BulletGun;

BulletGun.prototype.fire = function() {
  var bullet = new Bullet(
    this.entity.getX(),
    this.entity.getY(),
    // 0, 0, 0, 1.0,
    { red: 0, green: 0, blue: 0, alpha: 1.0 },
    2,
    this.entity.team
  );

  bullet.velocity.x = this.target.x - this.entity.getX();
  bullet.velocity.y = this.target.y - this.entity.getY();

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
// var Bullet = function( x, y, red, green, blue, alpha, radius, team ) {
var Bullet = function( x, y, color, radius, team ) {
  Circle.call( this, x, y, color, radius );
  // Circle.call( this, x, y, red, green, blue, alpha, radius );

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
        distance = Math.sqrt( ( this.getX() - characters[i].getX() ) *
                              ( this.getX() - characters[i].getX() ) +
                              ( this.getY() - characters[i].getY() ) *
                              ( this.getY() - characters[i].getY() ) );
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
          // alpha: -1.0,
          color: {
            alpha: -1.0
          }
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

// LaserGun --------------------------------------------------------------------
var LaserGun = function( entity, damage, rate, range,
                         color ) {
                         // red, green, blue, alpha ) {
  Gun.call( this, entity, damage, rate, range );


  this.color = color;
  // this.red   = red;
  // this.green = green;
  // this.blue  = blue;
  // this.alpha = alpha;

  this.targetEntity = null;

  this.drawingBeam = false;
  this.beam = new LaserBeam(
    this.entity,
    this.target.x,
    this.target.y,
    this.color
    // this.red,
    // this.green,
    // this.blue,
    // this.alpha
  );
};

LaserGun.prototype = new Gun();
LaserGun.prototype.constructor = LaserGun;

LaserGun.prototype.update = function( elapsedTime ) {
  Gun.prototype.update.call( this, elapsedTime );

  if ( this.drawingBeam === true && this.firing === false ) {
    _game.removeProjectile( this.beam );
    this.drawingBeam = false;
  }
};

LaserGun.prototype.fire = function() {
  var point = this.targetEntity.getIntersection( this.entity.getXY() );
  this.beam.x = point.x;
  this.beam.y = point.y;

  this.targetEntity.hit();

  if ( !this.drawingBeam ) {
    _game.addProjectile( this.beam );
    this.drawingBeam = true;
  }
};

LaserGun.prototype.setEntityAsTarget = function( entity ) {
  Weapon.prototype.setEntityAsTarget.call( this, entity );

  this.targetEntity = entity;
};


// LaserBeam -------------------------------------------------------------------
// var LaserBeam = function( entity, x, y, red, green, blue, alpha ) {
var LaserBeam = function( entity, x, y, color ) {

  this.entity = entity;

  this.x = x;
  this.y = y;

  this.color = color;
  // this.red   = red;
  // this.green = green;
  // this.blue  = blue;
  // this.alpha = alpha;
};

LaserBeam.prototype.draw = function( ctx ) {
  ctx.strokeStyle = 'rgba( ' + Math.round( this.color.red )   +
                    ', '     + Math.round( this.color.green ) +
                    ','      + Math.round( this.color.blue )  +
                    ','      + this.color.alpha + ' )';

  // ctx.strokeStyle = 'rgba( ' + Math.round( this.red )   +
  //                   ', '     + Math.round( this.green ) +
  //                   ','      + Math.round( this.blue )  +
  //                   ','      + this.alpha + ' )';
  ctx.lineWidth = 3;

  var point = this.entity.getIntersection({
    x: this.x,
    y: this.y
  });

  ctx.beginPath();
  ctx.moveTo( point.x, point.y );
  ctx.lineTo( this.x, this.y );
  ctx.closePath();

  ctx.stroke();
};

LaserBeam.prototype.update = function( elapsedTime ) {};
