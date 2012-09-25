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
  if ( this.x + this.radius > width ) {
    this.x = width - this.radius;
    this.velocity.x = -this.velocity.x;
  }
  if ( this.radius > this.y ) {
    this.y = this.radius;
    this.velocity.y = -this.velocity.y;
  }
  if ( this.y + this.radius > height ) {
    this.y = height - this.radius;
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


// Character -------------------------------------------------------------------
var Character = function( x, y, red, green, blue, alpha, radius ) {
  Circle.call( this, x, y, red, green, blue, alpha, radius );

  this.weapon = null;

  this.firing      = true;
  this.fireTime    = 0;
  this.fireRate    = 200;
  this.bulletSpeed = 0.5;

  this.health = 100;

  this.isHit     = false;
  this.hitTime   = 0;
  this.hitLength = 100;

  this.team = 0;
};

Character.prototype = new Circle();
Character.prototype.constructor = Character;

Character.prototype.fireAt = function( x, y ) {
  var bullet = new Bullet( this.x, this.y, 0, 0, 0, 1.0, 2, this.team );

  bullet.velocity.x = x - this.x;
  bullet.velocity.y = y - this.y;

  var magnitude = Math.sqrt( bullet.velocity.x *
                             bullet.velocity.x +
                             bullet.velocity.y *
                             bullet.velocity.y );
  bullet.velocity.x /= magnitude / this.bulletSpeed;
  bullet.velocity.y /= magnitude / this.bulletSpeed;

  bullets.push( bullet );
};

Character.prototype.update = function( elapsedTime ) {
  Circle.prototype.update.call( this, elapsedTime );

  // Find nearest enemy.
  var enemy = this.getNearestEntity( characters );

  if ( this.firing && this.fireTime <= 0 ) {
    this.fireTime = this.fireRate;
    if ( enemy !== null && enemy !== undefined ) {
      this.fireAt( enemy.x, enemy.y );
    } else {
      this.fireAt(
        this.x + this.velocity.x * 50,
        this.y + this.velocity.y * 50
      );
    }
  } else {
    this.fireTime -= elapsedTime;
  }
};

Character.prototype.getNearestEntity = function( entities ) {
  var entity;
  var distance = Number.MAX_VALUE;
  var min      = Number.MAX_VALUE;

  for ( var i = entities.length - 1; i >= 0; i-- ) {
    if ( this !== entities[i] ) {
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
    effects.push(
      new Effect(
        this,
        {
          radius: 15,
          red: 200
        },
        60,
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
