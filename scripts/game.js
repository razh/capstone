var Game = function() {
  if ( arguments.callee._gameInstance )
    return arguments.callee._gameInstance;
  arguments.callee._gameInstance = this;

  var _characters  = [];
  var _projectiles = [];
  var _effects     = [];
};

Game.prototype.addEffect = function( effect ) {

};

