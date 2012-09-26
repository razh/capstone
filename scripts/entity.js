// Entity ----------------------------------------------------------------------
var Entity = function( x, y ) {
  this.x = x;
  this.y = y;

  this.lifeTime = 0;

  this.velocity = {
    x: 0.25,
    y: 0.25
  };
};

Entity.prototype.update = function( elapsedTime ) {
  this.x += elapsedTime * this.velocity.x;
  this.y += elapsedTime * this.velocity.y;
};

Entity.prototype.getX = function() {
  return this.x;
};

Entity.prototype.getY = function() {
  return this.y;
};

Entity.prototype.setXY = function( x, y ) {
  this.x = x;
  this.y = y;
};

Entity.prototype.setVelocity = function( vx, vy ) {
  this.velocity.x = vx;
  this.velocity.y = vy;
};


// Shape -----------------------------------------------------------------------
var Shape = function( x, y, red, green, blue, alpha ) {
  Entity.call( this, x, y );

  this.red   = red;
  this.green = green;
  this.blue  = blue;
  this.alpha = alpha;
};


// Circle ----------------------------------------------------------------------
var Circle = function( x, y, red, green, blue, alpha, radius ) {
  Shape.call( this, x, y, red, green, blue, alpha );
  this.radius = radius;

  this.lifeTime = 0;
  this.maximumAge = 2000;
};

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.update = function( elapsedTime ) {
  Entity.prototype.update.call( this, elapsedTime );

  if ( this.radius > this.x ) {
    this.x = this.radius;
    this.velocity.x = -this.velocity.x;
  }
  if ( this.x + this.radius > _game.WIDTH ) {
    this.x = _game.WIDTH - this.radius;
    this.velocity.x = -this.velocity.x;
  }
  if ( this.radius > this.y ) {
    this.y = this.radius;
    this.velocity.y = -this.velocity.y;
  }
  if ( this.y + this.radius > _game.HEIGHT ) {
    this.y = _game.HEIGHT - this.radius;
    this.velocity.y = -this.velocity.y;
  }
};

Circle.prototype.draw = function( ctx ) {
  ctx.beginPath();
  ctx.arc(
    Math.round( this.x ),
    Math.round( this.y ),
    Math.round( this.radius ),
    0,
    Math.PI * 2,
    true
  );
  ctx.fillStyle = 'rgba( ' + Math.round( this.red )   +
                  ', '     + Math.round( this.green ) +
                  ','      + Math.round( this.blue )  +
                  ','      + this.alpha + ' )';
  ctx.fill();
};

Circle.prototype.getIntersection = function( target ) {
  var x0 = this.x,
      y0 = this.y,
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


// Character -------------------------------------------------------------------
var Character = function( x, y, red, green, blue, alpha, radius ) {
  Circle.call( this, x, y, red, green, blue, alpha, radius );

  this.weapons = [];

  this.health = 100;

  this.isHit     = false;
  this.hitTime   = 0;
  this.hitLength = 100;

  this.team = 0;
};

Character.prototype = new Circle();
Character.prototype.constructor = Character;

Character.prototype.update = function( elapsedTime ) {
  Circle.prototype.update.call( this, elapsedTime );

  if ( this.weapons !== null && this.weapons.length > 0 ) {
    var enemy = this.getNearestEntity( _game.getCharacters() );

    for ( var i = this.weapons.length - 1; i >= 0; i--  ) {
      this.weapons[i].setEntityAsTarget( enemy );
      this.weapons[i].update( elapsedTime );
    }
  }
};

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
  return Math.sqrt( ( this.x - entity.getX() ) *
                    ( this.x - entity.getX() ) +
                    ( this.y - entity.getY() ) *
                    ( this.y - entity.getY() ) );
};

Character.prototype.hit = function() {
  if ( !this.isHit ) {
    this.isHit = true;
    // Effects chain. Nasty syntax, but it works.
    _game.addEffect(
      new Effect(
        this,
        {
          radius: 15,
          red: 200
        },
        50,
        Easing.easeInOutCubic,
        undefined,
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
              undefined,
              (function() {
                this.isHit = false;
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
