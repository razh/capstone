// Hydra -----------------------------------------------------------------------
var Hydra = function( x, y, numSegments, segment, distance, team ) {
  this.graphics = new HydraGraphicsComponent( this, 0, 0,
                                              numSegments, segment.graphics,
                                              distance );
  this.physics  = new HydraPhysicsComponent( this, x, y,
                                             numSegments, segment.physics,
                                             distance );
  this.team = team;

  this.physics.segments[0].setVelocity( 0.25, 0.25 );
};

Hydra.prototype.getTeam = function() {
  return this.team;
};

Hydra.prototype.draw = function( ctx ) {
  var x, y, r;
  for ( var i = 0; i < this.graphics.numSegments &&
                   i < this.physics.numSegments; i++ ) {
    // ctx.save();
    // ctx.translate( this.physics.segments[i].getX(),
    //                this.physics.segments[i].getY() );
    // this.graphics.segments[i].draw( ctx );
    // ctx.restore();
    x = this.physics.segments[i].getX();
    y = this.physics.segments[i].getY();
    r = this.physics.segments[i].radius;

    ctx.beginPath();
    ctx.arc( x, y, r, 0, Math.PI * 2, true );
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'red';
    ctx.stroke();
  }
};

Hydra.prototype.update = function( elapsedTime ) {
  this.physics.update( elapsedTime );
};

Hydra.prototype.hit = function() {};

// HydraGraphicsComponent ------------------------------------------------------
var HydraGraphicsComponent = function( entity, x, y,
                                       numSegments, segment, distance ) {
  this.segments = [];
  this.numSegments = numSegments;

  for ( var i = 0; i < this.numSegments; i++ ) {
    this.segments.push( segment );
  }
};

HydraGraphicsComponent.prototype.draw = function( ctx ) {
};


// HydraPhysicsComponent -------------------------------------------------------
var HydraPhysicsComponent = function( entity, x, y,
                                      numSegments, segment, distance ) {
  PhysicsComponent.call( this, entity, x, y );

  this.segments = [];
  this.numSegments = numSegments;
  this.distance = distance;

  for ( var i = 0; i < this.numSegments; i++ ) {
    this.segments.push( segment );
  }
};

HydraPhysicsComponent.prototype.update = function( elapsedTime ) {
  this.segments[0].update( elapsedTime );

  var x0, y0, x1, y1;
  var dx, dy;
  var distance;
  for ( var i = 0; i < this.numSegments - 1; i++ ) {
    x0 = this.segments[i].getX();
    y0 = this.segments[i].getY();
    x1 = this.segments[ i + 1 ].getX();
    y1 = this.segments[ i + 1 ].getY();

    dx = x1 - x0;
    dy = y1 - y0;

    // TODO: Clean up this code.
    distance = Math.sqrt( dx * dx + dy * dy );
    if ( distance >= this.distance ) {
      dx *= this.distance / distance;
      dy *= this.distance / distance;

      this.segments[ i + 1 ].setX( x0 + dx );
      this.segments[ i + 1 ].setY( y0 + dy );
    }
  }
};

HydraPhysicsComponent.prototype.getX = function() {
  return this.segments[0].getX();
};

HydraPhysicsComponent.prototype.getY = function() {
  return this.segments[0].getY();
};

HydraPhysicsComponent.prototype.getIntersection = function() {
  return {
    x: this.segments[0].getX(),
    y: this.segments[0].getY()
  };
};


// // HydraSegment ----------------------------------------------------------------
// var HydraSegment = function( gfxPrototype, gfxOptions,
//                              physPrototype, physOptions ) {
//   this.graphics = {
//     proto: gfxPrototype,
//     opts: gfxOptions
//   };
//   this.physics = {
//     proto: physPrototype,
//     opts: physOptions
//   };
// };
