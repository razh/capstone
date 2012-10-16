// Using a Typed Array implementation which can be found here.
// http://media.tojicode.com/sfjs-vectors/
var MatrixArray = ( typeof Float32Array !== 'undefined' ) ?
                  Float32Array : Array;

// MatrixArray (backwards compatibility) is taken from toji's gl-matrix.js.
vec2.create = function( a, b ) {
  return new MatrixArray( [ a, b ] );
};

vec2.add = function( a, b, dest ) {
  if ( !dest ) dest = b;
  dest[0] = a[0] + b[0];
  dest[1] = a[1] + b[0];
  return dest;
};

vec2.subtract = function( a, b, dest ) {
  if ( !dest ) dest = b;
  dest[0] = a[0] - b[0];
  dest[1] = a[1] - b[1];
  return dest;
};

vec2.multiply = function( a, b, dest ) {
  if ( !dest ) dest = b;
  dest[0] = a[0] * b[0];
  dest[1] = a[1] * b[1];
  return dest;
};

vec2.divide = function( a, b, dest ) {
  if ( !dest ) dest = b;
  dest[0] = a[0] / b[0];
  dest[1] = a[1] / b[1];
  return dest;
};

vec2.scale = function( vec, scalar, dest ) {
  if ( !dest ) dest = vec;
  dest[0] = vec[0] * scalar;
  dest[1] = vec[1] * scalar;
  return dest;
};

vec2.dist = function( a, b ) {
  var x = b[0] - a[0],
      y = b[1] - a[1];
  return Math.sqrt( x * x + y * y );
};

vec2.dot = function() {

};
