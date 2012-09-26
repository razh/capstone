// This terrain object isn't used yet.
function initTerrain( width, height ) {
  var i, j;
  var array = [];
  for ( i = 0; i < height; i++ ) {
    array[i] = [];
    for ( j = 0; j < width; j++ ) {
      array[i].push( Math.random() );
    }
  }
}

function printTerrain( array ) {
  var i, j;
  var rowLength = array.length;
  var colLength = array[0].length;
  for ( i = 0; i < rowLength; i++ ) {
    for ( j = 0; j < colLength; j++ ) {
      console.log( array[i][j] );
      if ( j < array[i].length -1 ) {
        console.log( '\t' );
      }
    }

    if ( i < array.length - 1 ) {
      console.log( '\n' );
    }
  }
}

var Terrain = function( width, height ) {
  this.map = [];
  this.width = width;
  this.height = height;
};

Terrain.prototype.generateMidpointDisplacement = function() {
};

Terrain.prototype.toString = function() {
  var string = '';
  var i, j;
  for ( i = 0; i < this.height; i++ ) {
    for ( j = 0; j < this.width; j++ ) {
      string += this.map[i][j];

      if ( j < this.width - 1 )
        string += '\t';
    }

    if ( i < this.height - 1 )
      string += '\n';
  }
};
