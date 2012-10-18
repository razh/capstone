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
    this.setTarget( entity.physics.getX(), entity.physics.getY() );
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

  return this.range >= Math.sqrt( ( this.target.x -
                                    this.entity.physics.getX() ) *
                                  ( this.target.x -
                                    this.entity.physics.getX() ) +
                                  ( this.target.y -
                                    this.entity.physics.getY() ) *
                                  ( this.target.y -
                                   this.entity.physics.getY() ) );
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
var BulletGun = function( entity, damage, rate, range, speed,
                          red, green, blue, alpha, radius ) {
  Gun.call( this, entity, damage, rate, range );

  this.speed = speed;

  this.red   = red;
  this.green = green;
  this.blue  = blue;
  this.alpha = alpha;

  this.radius = radius;
};

BulletGun.prototype = new Gun();
BulletGun.prototype.constructor = BulletGun;

BulletGun.prototype.fire = function() {
  var bullet = new Bullet(
    this.entity.physics.getX(),
    this.entity.physics.getY(),
    this.red,
    this.green,
    this.blue,
    this.alpha,
    this.radius,
    this.entity.team
  );

  bullet.physics.velocity.x = this.target.x - this.entity.physics.getX();
  bullet.physics.velocity.y = this.target.y - this.entity.physics.getY();

  var magnitude = Math.sqrt( bullet.physics.velocity.x *
                             bullet.physics.velocity.x +
                             bullet.physics.velocity.y *
                             bullet.physics.velocity.y );
  bullet.physics.velocity.x /= magnitude / this.speed;
  bullet.physics.velocity.y /= magnitude / this.speed;

  _game.addProjectile( bullet );

  this.firing = false;
};


// Bullet ----------------------------------------------------------------------
var Bullet = function( x, y, red, green, blue, alpha, radius, team ) {
  this.graphics = new Circle( this, 0, 0, red, green, blue, alpha, radius );
  this.physics  = new CirclePhysicsComponent( this, x, y, radius );

  this.collides = true;
  this.team     = team;
};

Bullet.prototype.update = function( elapsedTime ) {
  this.physics.update( elapsedTime );

  var removeBullet = false;
  if ( this.collides ) {
    var distance;
    var i;
    var characters = _game.getCharacters();
    for ( i = characters.length - 1; i >= 0; i-- ) {
      if ( characters[i].getTeam() !== this.team ) {
        distance = Math.sqrt( ( this.physics.getX() -
                                characters[i].physics.getX() ) *
                              ( this.physics.getX() -
                                characters[i].physics.getX() ) +
                              ( this.physics.getY() -
                                characters[i].physics.getY() ) *
                              ( this.physics.getY() -
                                characters[i].physics.getY() ) );
        if ( distance < this.physics.radius + characters[i].physics.radius ) {
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
    this.physics.setVelocity( 0, 0 );
    this.collides = false;
    _game.addEffect(
      new Effect(
        this.graphics,
        {
          radius: 5,
          alpha: -1.0
        },
        500,
        Easing.easeOutQuad,
        undefined,
        (function() {
          _game.removeProjectile( this.entity );
          return {
            effect: undefined
          };
        })
      )
    );
  }
};

Bullet.prototype.draw = function( ctx ) {
  ctx.save();

  ctx.translate( this.physics.getX(), this.physics.getY() );
  this.graphics.draw( ctx );

  ctx.restore();
};


// LaserGun --------------------------------------------------------------------
var LaserGun = function( entity, damage, rate, range,
                         red, green, blue, alpha ) {
  Gun.call( this, entity, damage, rate, range );

  this.red   = red;
  this.green = green;
  this.blue  = blue;
  this.alpha = alpha;

  this.targetEntity = null;

  this.drawingBeam = false;
  this.beam = new LaserBeam(
    this.entity,
    this.target.x,
    this.target.y,
    this.red,
    this.green,
    this.blue,
    this.alpha
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
  var point = this.targetEntity.physics.getIntersection(
    this.entity.physics.getXY()
  );

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
var LaserBeam = function( entity, x, y, red, green, blue, alpha ) {
  this.entity = entity;

  this.x = x;
  this.y = y;

  this.red   = red;
  this.green = green;
  this.blue  = blue;
  this.alpha = alpha;
};

LaserBeam.prototype.draw = function( ctx ) {
  ctx.strokeStyle = 'rgba( ' + Math.round( this.red )   +
                    ', '     + Math.round( this.green ) +
                    ','      + Math.round( this.blue )  +
                    ','      + this.alpha + ' )';
  ctx.lineWidth = 3;

  var point = this.entity.physics.getIntersection({
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


// MissileGun ------------------------------------------------------------------
var MissileGun = function() {

};


// Missile ---------------------------------------------------------------------
var Missile = function() {

};
