var Game = function() {
  if ( arguments.callee._gameInstance )
    return arguments.callee._gameInstance;
  arguments.callee._gameInstance = this;

  this._canvas = document.getElementById( 'test' );
  this._ctx    = this._canvas.getContext( '2d' );

  this.WIDTH  = 800;
  this.HEIGHT = 600;

  this._canvas.style.backgroundColor = '#C8C8C8';
  this._canvas.width  = this.WIDTH;
  this._canvas.height = this.HEIGHT;

  this._prevTime = Date.now();
  this._currTime = this._prevTime;

  this._characters  = [];
  this._projectiles = [];
  this._effects     = [];
};

Game.prototype.addCharacter = function( character ) {
  this._characters.push( character );
};

Game.prototype.addProjectile = function( projectile ) {
  this._projectiles.push( projectile );
};

Game.prototype.addEffect = function( effect ) {
  this._effects.push( effect );
};

Game.prototype.update = function() {
  this._currTime = Date.now();
  var elapsedTime = this._currTime - this._prevTime;
  this._prevTime = this._currTime;

  this.updateCharacters( elapsedTime );
  this.updateProjectiles( elapsedTime );
  this.updateEffects( elapsedTime );
};

Game.prototype.updateCharacters = function( elapsedTime ) {
  for ( var i = this._characters.length - 1; i >= 0; i-- )
    this._characters[i].update( elapsedTime );
};

Game.prototype.updateProjectiles = function( elapsedTime ) {
  for ( var i = this._projectiles.length - 1; i >= 0; i-- )
    this._projectiles[i].update( elapsedTime );
};

Game.prototype.updateEffects = function( elapsedTime ) {
  for ( var i = this._effects.length - 1; i >= 0; i-- )
    this._effects[i].update( elapsedTime );
};

Game.prototype.init = function() {
  var char0 = new Character( 400, 400, 0, 0, 200, 1.0, 10 );
  char0.setVelocity( 0, 0 );
  char0.firing = false;
  this.addCharacter( char0 );

  var char1 = new Character( 200, 200, 200, 0, 0, 1.0, 10 );
  char1.setTeam( 1 );
  this.addCharacter( char1 );
};

Game.prototype.tick = function() {
  this.update();
  this.draw();

  requestAnimFrame( this.tick() );
};

Game.prototype.draw = function() {
  this.update();

  this._ctx.clearRect( 0, 0, this.WIDTH, height );

  this.drawCharacters();
  this.drawBullets();
};

Game.prototype.drawCharacters = function() {
  for ( var i = this._characters.length - 1; i >= 0; i-- )
    this._characters[i].draw( this._ctx );
};

Game.prototype.drawBullets = function() {
  for ( var i = this._bullets.length - 1; i >= 0; i-- )
    this._bullets[i].draw( this._ctx );
};

var _game = new Game();
