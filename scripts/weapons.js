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

  return this.range >= Math.sqrt( ( this.target.x - this.entity.x ) *
                                  ( this.target.x - this.entity.x ) +
                                  ( this.target.y - this.entity.y ) *
                                  ( this.target.y - this.entity.y ) );
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






