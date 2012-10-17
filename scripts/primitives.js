// Primitives.
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


// Rectangle -------------------------------------------------------------------
var Rectangle = function( entity, x, y,
                          red, green, blue, alpha,
                          width, height ) {
  Shape.call( this, entity, x, y, red, green, blue, alpha );

  this.width  = width;
  this.height = height;
};

Rectangle.prototype = new Shape();
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.draw = function( ctx ) {
  ctx.fillStyle = 'rgba( ' + ( ( 0.5 + this.red )   << 0 ) +
                  ', '     + ( ( 0.5 + this.green ) << 0 ) +
                  ','      + ( ( 0.5 + this.blue )  << 0 ) +
                  ','      + this.alpha + ' )';
  ctx.fillRect();
};

// Line ------------------------------------------------------------------------
var Line = function( x0, y0, x1, y1, red, green, blue, alpha, lineWidth ) {
  this.p0 = {
    x: x0,
    y: y0
  };

  this.p1 = {
    x: x1,
    y: y1
  };

  this.red   = red;
  this.green = green;
  this.blue  = blue;
  this.alpha = alpha;

  this.lineWidth = lineWidth;
};

Line.prototype.draw = function( ctx ) {
  // Round before rendering.
  ctx.lineWidth = ( 0.5 + this.width ) << 0;
  ctx.strokeStyle = 'rgba( ' + ( ( 0.5 + this.red )   << 0 ) +
                    ', '     + ( ( 0.5 + this.green ) << 0 ) +
                    ','      + ( ( 0.5 + this.blue )  << 0 ) +
                    ','      + this.alpha + ' )';

  ctx.beginPath();
  ctx.moveTo( this.p0.x, this.p0.y );
  ctx.lineTo( this.p1.x, this.p1.y );
  ctx.stroke();
};
