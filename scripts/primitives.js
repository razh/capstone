// Primitives.
// Rectangle.
var Rectangle = function( x, y, red, green) {

};


var Line = function( x0, y0, x1, y1, red, green, blue, alpha, lineWidth ) {
  this.p0 = vec2.create( x0, y0 );
  this.p1 = vec2.create( x1, y1 );

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
  ctx.moveTo( p0[0], p0[1] );
  ctx.lineTo( p1[0], p1[1] );
  ctx.stroke();
};
