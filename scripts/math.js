// Using a Typed Array implementation which can be found here.
// http://media.tojicode.com/sfjs-vectors/
var MatrixArray = ( typeof Float32Array !== 'undefined' ) ?
                  Float32Array : Array;

// MatrixArray (backwards compatibility) is taken from toji's gl-matrix.js.
Vec2.create = function( a, b ) {
  return new MatrixArray( [ a, b ] );
};

Vec2.add = function( a, b, dest ) {
  dest[0] = a[0] + b[0];
  dest[1] = a[1] + b[0];
};

Vec2.subtract = function( a, b, dest ) {

};

Vec2.multiply = function( a, b, dest ) {
  dest[0] = a[0] * b[0];
  dest[1] = a[1] * b[1];
};

Vec2.divide = function( a, b, dest ) {
  dest[0] = a[0] / b[0];
  dest[1] = a[1] / b[1];
};

Vec2.scale = function( vec, scalar, dest ) {
  dest[0] = vec[0] * scalar;
  dest[1] = vec[1] * scalar;
};

Vec2.dist = function( a, b ) {
  var x = b[0] - a[0],
      y = b[1] - a[1];
  return Math.sqrt( x * x + y * y );
};

Vec2.dot = function() {

};
