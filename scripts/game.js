// Main Game Function ----------------------------------------------------------
var Game = function() {
  if ( arguments.callee._gameInstance )
    return arguments.callee._gameInstance;
  arguments.callee._gameInstance = this;

  this._canvas = document.getElementById( 'test' );
  this._ctx    = this._canvas.getContext( '2d' );

  this.WIDTH  = window.innerWidth;
  this.HEIGHT = window.innerHeight;

  // this._canvas.style.padding = '0px 0px';
  this._canvas.style.backgroundColor = '#C8C8C8';
  this._canvas.width  = this.WIDTH;
  this._canvas.height = this.HEIGHT;

  this._prevTime = Date.now();
  this._currTime = this._prevTime;

  this._characters  = [];
  this._enemies     = [];
  this._projectiles = [];
  this._effects     = [];
};

// Character Array Functions ---------------------------------------------------
Game.prototype.addCharacter = function( character ) {
  this._characters.push( character );
};

Game.prototype.removeCharacter = function( character ) {
  removeFromArray( character, this._characters );
};

Game.prototype.getCharacters = function() {
  return this._characters;
};

// Enemy Array Functions -------------------------------------------------------
Game.prototype.addEnemy = function( character ) {
  this._enemies.push( character );
}

// Projectile Array Functions --------------------------------------------------
Game.prototype.addProjectile = function( projectile ) {
  this._projectiles.push( projectile );
};

Game.prototype.removeProjectile = function( projectile ) {
  removeFromArray( projectile, this._projectiles );
};

// Effect Array Functions ------------------------------------------------------
Game.prototype.addEffect = function( effect ) {
  this._effects.push( effect );
};

Game.prototype.removeEffect = function( effect ) {
  removeFromArray( effect, this._effects );
};

// Update functions ------------------------------------------------------------
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

Game.prototype.tick = function() {
  this.update();
  this.draw();
};

// Drawing functions -----------------------------------------------------------
Game.prototype.draw = function() {
  this._ctx.clearRect( 0, 0, this.WIDTH, this.HEIGHT );

  this.drawCharacters();
  this.drawProjectiles();
};

Game.prototype.drawCharacters = function() {
  for ( var i = this._characters.length - 1; i >= 0; i-- )
    this._characters[i].draw( this._ctx );
};

Game.prototype.drawProjectiles = function() {
  for ( var i = this._projectiles.length - 1; i >= 0; i-- )
    this._projectiles[i].draw( this._ctx );
};

// Initialize game object ------------------------------------------------------
Game.prototype.init = function() {
  // blue
  var char0 = new Character( 400, 400, 0, 0, 200, 1.0, 10 );
  char0.setVelocity( 0, 0 );
  //char0.addWeapon( new LaserGun( char0, 1, 200, 200, 255, 200, 200, 1.0 ) );
  this.addCharacter( char0 );

  // red
  var char1 = new Character( 200, 200, 200, 0, 0, 1.0, 10 );
  char1.setTeam( 1 );
  //char1.addWeapon( new BulletGun( char1, 1, 200, -1, 0.5 ) );
  char1.addWeapon( new LaserGun( char1, 1, 200, 200, 255, 200, 200, 1.0 ) );
  this.addCharacter( char1 );

  // green
  var char2 = new Character( 400, 500, 0, 300, 0, 1.0, 10 );
  char2.setVelocity( 0, 0 );
  char2.addWeapon( new BulletGun( char2, 1, 100, 200, .9 ) );
  this.addCharacter( char2 );

};

// Start Game ------------------------------------------------------------------
var _game = new Game();

