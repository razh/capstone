var Level = function() {
  this._enemyTypes = [];
};

Level.prototype.addEnemyType = function( enemyType ) {
  this._enemyTypes.push( enemyType )
};