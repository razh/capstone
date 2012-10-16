// Using a Typed Array implementation which can be found here.
// http://media.tojicode.com/sfjs-vectors/
var MatrixArray = ( typeof Float32Array !== 'undefined' ) ?
                  Float32Array : Array;

var FLOAT_EPSILON = 0.000001;

var vec2 = {};

// Most of this is taken from toji's gl-matrix.js with some slight changes.
vec2.create = function( x, y ) {
  return new MatrixArray( [ x, y ] );
};

vec2.add = function( a, b, dest ) {
  if ( !dest ) { dest = b; }
  dest[0] = a[0] + b[0];
  dest[1] = a[1] + b[0];
  return dest;
};

vec2.subtract = function( a, b, dest ) {
  if ( !dest ) { dest = b; }
  dest[0] = a[0] - b[0];
  dest[1] = a[1] - b[1];
  return dest;
};

vec2.multiply = function( a, b, dest ) {
  if ( !dest ) { dest = b; }
  dest[0] = a[0] * b[0];
  dest[1] = a[1] * b[1];
  return dest;
};

vec2.divide = function( a, b, dest ) {
  if ( !dest ) { dest = b; }
  dest[0] = a[0] / b[0];
  dest[1] = a[1] / b[1];
  return dest;
};

vec2.scale = function( vec, scalar, dest ) {
  if ( !dest ) { dest = vec; }
  dest[0] = vec[0] * scalar;
  dest[1] = vec[1] * scalar;
  return dest;
};

vec2.dist = function( a, b ) {
  var x = b[0] - a[0],
      y = b[1] - a[1];
  return Math.sqrt( x * x + y * y );
};

vec2.set = function( vec, dest ) {
  dest[0] = vec[0];
  dest[1] = vec[1];
  return dest;
};

vec2.equal = function( a, b ) {
  return a === b || (
    Math.abs( a[0] - b[0] ) < FLOAT_EPSILON &&
    Math.abs( a[1] - b[1] ) < FLOAT_EPSILON
  );
};

vec2.negate = function( vec, dest ) {
  if ( !dest ) { dest = vec; }
  dest[0] = -vec[0];
  dest[1] = -vec[1];
  return dest;
};

vec2.normalize = function( vec, dest ) {
  if ( !dest ) { dest = vec; }

  var magnitude = vec[0] * vec[0] + vec[1] * vec[1];
  if ( magnitude > 0 ) {
    magnitude = Math.sqrt( magnitude );
    dest[0] = vec[0] / magnitude;
    dest[1] = vec[1] / magnitude;
  } else {
    dest[0] = dest[1] = 0;
  }

  return dest;
};

vec2.length = function( vec ) {
  var x = vec[0],
      y = vec[1];
  return Math.sqrt( x * x + y * y );
};

vec2.squaredLength = function( vec ) {
  var x = vec[0],
      y = vec[1];
  return x * x + y * y;
};

vec2.dot = function( a, b ) {
  return a[0] * b[0] + a[1] * b[1];
};

vec2.direction = function( a, b, dest ) {
  if ( !dest ) { dest = a; }

  var x = a[0] - b[0],
      y = a[1] - b[1];

  var length = x * x + y * y;
  if ( !length ) {
    dest[0] = 0;
    dest[1] = 0;
    return dest;
  }

  length = 1 / Math.sqrt( length );
  dest[0] = x * length;
  dest[1] = y * length;
  return dest;
};

vec2.lerp = function( a, b, lerp, dest ) {
  if ( !dest ) { dest = a; }
  dest[0] = a[0] + lerp * ( b[0] - a[0] );
  dest[1] = a[1] + lerp * ( b[1] - a[1] );
  return dest;
};
