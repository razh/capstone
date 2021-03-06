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
  this.physics.segments[0].setRotation( Math.PI / 4 );
};

Hydra.prototype.getTeam = function() {
  return this.team;
};

Hydra.prototype.draw = function( ctx ) {
  var x, y, r;
  for ( var i = 0; i < this.physics.numSegments; i++ ) {
    ctx.save();
    ctx.translate( this.physics.segments[i].getX(),
                   this.physics.segments[i].getY() );
    ctx.rotate( this.physics.segments[i].rotation );
    this.graphics.segments[i].draw( ctx );
    ctx.restore();
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
    this.segments.push( segment.clone() );
  }
};


// HydraPhysicsComponent -------------------------------------------------------
var HydraPhysicsComponent = function( entity, x, y,
                                      numSegments, segment, distance ) {
  PhysicsComponent.call( this, entity, x, y );

  this.segments = [];
  this.numSegments = numSegments;
  this.distance = distance;

  console.log( segment );

  for ( var i = 0; i < this.numSegments; i++ ) {
    this.segments.push( segment.clone() );
  }
};

HydraPhysicsComponent.prototype.update = function( elapsedTime ) {
  // this.segments[0].update( elapsedTime );

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


// HydraSegment ----------------------------------------------------------------
var HydraSegment = function( graphics, physics ) {
  this.graphics = graphics;
  this.physics = physics;
};
