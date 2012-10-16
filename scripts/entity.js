// Entity ----------------------------------------------------------------------
var Entity = function( x, y ) {
  this.position = {
    x: x,
    y: y
  };
};

Entity.prototype.getX = function() {
  return this.position.x;
};

Entity.prototype.setX = function( x ) {
  this.position.x = x;
};

Entity.prototype.getY = function() {
  return this.position.y;
};

Entity.prototype.setY = function( y ) {
  this.position.y = y;
};

Entity.prototype.getXY = function() {
  return {
    x: this.position.x,
    y: this.position.y
  };
};

Entity.prototype.setXY = function( x, y ) {
  this.position.x = x;
  this.position.y = y;
};


// PhysicsComponent ------------------------------------------------------------
var PhysicsComponent = function( entity, x, y ) {
  Entity.call( this, x, y );

  this.entity = entity;
  this.velocity = {
    x: 0,
    y: 0
  };
};

PhysicsComponent.prototype = new Entity();
PhysicsComponent.prototype.constructor = PhysicsComponent;

PhysicsComponent.prototype.update = function( elapsedTime ) {
  this.position.x += elapsedTime * this.velocity.x;
  this.position.y += elapsedTime * this.velocity.y;
};

PhysicsComponent.prototype.setVelocity = function( vx, vy ) {
  this.velocity.x = vx;
  this.velocity.y = vy;
};

// CirclePhysicsComponent ---------------------------------------------------------
var CirclePhysicsComponent = function( entity, x, y, radius ) {
  PhysicsComponent.call( this, entity, x, y );

  this.radius = radius;
};

CirclePhysicsComponent.prototype = new PhysicsComponent();
CirclePhysicsComponent.prototype.constructor = CirclePhysicsComponent;

CirclePhysicsComponent.prototype.update = function( elapsedTime ) {
  PhysicsComponent.prototype.update.call( this, elapsedTime );

  if ( this.radius > this.getX() ) {
    this.setX( this.radius );
    this.velocity.x = -this.velocity.x;
  }
  if ( this.getX() + this.radius > _game.WIDTH ) {
    this.setX( _game.WIDTH - this.radius );
    this.velocity.x = -this.velocity.x;
  }
  if ( this.radius > this.getY() ) {
    this.setY( this.radius );
    this.velocity.y = -this.velocity.y;
  }
  if ( this.getY() + this.radius > _game.HEIGHT ) {
    this.setY( _game.HEIGHT - this.radius );
    this.velocity.y = -this.velocity.y;
  }
};

CirclePhysicsComponent.prototype.getIntersection = function( target ) {
  var x0 = this.getX(),
      y0 = this.getY(),
      r0 = this.radius,
      x1 = target.x,
      y1 = target.y;

  var dx = x1 - x0,
      dy = y1 - y0;

  var length = Math.sqrt( dx * dx + dy * dy );
  dx = dx / length;
  dy = dy / length;

  return {
    x: x0 + dx * r0,
    y: y0 + dy * r0
  };
};

/*
ctx.translate( this.physics.getX(), this.physics.getY() );
this.graphics.draw( ctx );

*/
// RectPhysicsComponent -----------------------------------------------------------
var RectPhysicsComponent = function( entity, x, y, width, height ) {
  PhysicsComponent.call( this, entity, x, y );

  this.width = width;
  this.height = height;
};

RectPhysicsComponent.prototype = new PhysicsComponent();
RectPhysicsComponent.prototype.constructor = RectPhysicsComponent;


RectPhysicsComponent.prototype.update = function( elapsedTime ) {
  PhysicsComponent.prototype.update.call( this, elapsedTime );
};

// Shape -----------------------------------------------------------------------
var Shape = function( entity, x, y, red, green, blue, alpha ) {
  Entity.call( this, x, y );

  this.entity = entity;

  this.red   = red;
  this.green = green;
  this.blue  = blue;
  this.alpha = alpha;
};

Shape.prototype = new Entity();
Shape.prototype.constructor = Shape;

// Circle ----------------------------------------------------------------------
var Circle = function( entity, x, y, red, green, blue, alpha, radius ) {
  Shape.call( this, entity, x, y, red, green, blue, alpha );
  this.radius = radius;
};

Circle.prototype = new Shape();
Circle.prototype.constructor = Circle;

Circle.prototype.draw = function( ctx ) {
  // Avoid a negative radius which ctx.arc() can't handle.
  if( this.radius < 0 )
    return;

  // Idiom for rounding floats.
  // rounded = ( 0.5 + someNum ) << 0
  ctx.beginPath();
  ctx.arc(
    ( 0.5 + this.getX() ) << 0,
    ( 0.5 + this.getY() ) << 0,
    ( 0.5 + this.radius ) << 0,
    0,
    Math.PI * 2,
    true
  );

  ctx.fillStyle = 'rgba( ' + ( ( 0.5 + this.red )   << 0 ) +
                  ', '     + ( ( 0.5 + this.green ) << 0 ) +
                  ','      + ( ( 0.5 + this.blue )  << 0 ) +
                  ','      + this.alpha + ' )';
  ctx.fill();
};


// Character -------------------------------------------------------------------
var Character = function( x, y, red, green, blue, alpha, radius ) {
  this.graphics = new Circle( this, 0, 0, red, green, blue, alpha, radius );
  this.physics  = new CirclePhysicsComponent( this, x, y, radius );

  this.weapons = [];

  this.health = 100;

  this.isHit     = false;
  this.hitTime   = 0;
  this.hitLength = 100;

  this.team = 0;
};

Character.prototype.update = function( elapsedTime ) {
  this.physics.update( elapsedTime );

  if ( this.weapons !== null && this.weapons.length > 0 ) {
    var enemy = this.getNearestEntity( _game.getCharacters() );

    for ( var i = this.weapons.length - 1; i >= 0; i--  ) {
      this.weapons[i].setEntityAsTarget( enemy );
      this.weapons[i].update( elapsedTime );
    }
  }
};

Character.prototype.draw = function( ctx ) {
  ctx.save();

  ctx.translate( this.physics.getX(), this.physics.getY() );
  this.graphics.draw( ctx );

  ctx.restore();
};


// TODO: Move to physics component.
Character.prototype.getNearestEntity = function( entities ) {
  var entity;
  var distance = Number.MAX_VALUE;
  var min      = Number.MAX_VALUE;

  for ( var i = entities.length - 1; i >= 0; i-- ) {
    if ( this.team !== entities[i].team ) {
      distance = this.distanceToEntity( entities[i] );
      if ( distance < min ) {
        min = distance;
        entity = entities[i];
      }
    }
  }

  return entity;
};

Character.prototype.distanceToEntity = function( entity ) {
  return Math.sqrt( ( this.physics.getX() - entity.physics.getX() ) *
                    ( this.physics.getX() - entity.physics.getX() ) +
                    ( this.physics.getY() - entity.physics.getY() ) *
                    ( this.physics.getY() - entity.physics.getY() ) );
};

Character.prototype.hit = function() {
  if ( !this.isHit ) {
    this.isHit = true;
    // Effects chain. Nasty syntax, but it works.
    _game.addEffect(
      new Effect(
        this.graphics,
        {
          radius: 15,
          red: 200
        },
        50,
        Easing.easeInOutCubic,
        // Step. Set physics radius to graphics radius.
        (function() {
          this.object.entity.physics.radius = this.object.radius;
        }),
        // Complete.
        (function() {
          return {
            effect: new Effect(
              this,
              {
                radius: -15,
                red: -200
              },
              150,
              Easing.linear,
              // Step.
              (function() {
                this.object.entity.physics.radius = this.object.radius;
              }),
              // Complete.
              (function() {
                this.entity.isHit = false;
                return {
                  effect: undefined
                };
              })
            )
          };
        })
      )
    );
  }
};

Character.prototype.setTeam = function( team ) {
  this.team = team;
};

Character.prototype.getTeam = function() {
  return this.team;
};

Character.prototype.addWeapon = function( weapon ) {
  this.weapons.push( weapon );
};
