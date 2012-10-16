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
  var point = this.targetEntity.getIntersection( this.entity );
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

  this.x      = x;
  this.y      = y;

  this.red    = red;
  this.green  = green;
  this.blue   = blue;
  this.alpha  = alpha;
};

LaserBeam.prototype.draw = function( ctx ) {
  ctx.strokeStyle = 'rgba( ' + Math.round( this.red )   +
                    ', '     + Math.round( this.green ) +
                    ','      + Math.round( this.blue )  +
                    ','      + this.alpha + ' )';
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
