var Level = function() {
  this._enemyTypes = [];

  this.time = 0;
};

Level.prototype.addEnemyType = function( enemyType ) {
  this._enemyTypes.push( enemyType );
};

Level.prototype.update = function( elaspsedTime ) {
  this.time += elapsedTime;

  // Start time.
  for ( var i = this._enemyTypes.length - 1; i >= 0; i++ ) {
    if ( this.time >= this._enemyTypes[i].start ) {
      this._enemyTypes[i].spawning = true;
    }

    if ( this._enemyTypes[i].spawning && !this._enemyTypes[i].finished ) {
      this._enemyTypes[i].time += elapsedTime;
    }
  }

};

Level.prototype.spawnEnemy = function( enemyType ) {
};

var EnemyGenerator = function( type, start ) {
  this.start = start;


  this.spawning = false;
};

// Structure of enemyType:
/*
  start
  spawning
  time
  rate
  count
  finished
*/
