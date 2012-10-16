var Game = function() {
  if ( arguments.callee._gameInstance )
    return arguments.callee._gameInstance;
  arguments.callee._gameInstance = this;

  this._canvas = document.getElementById( 'test' );
  this._ctx    = this._canvas.getContext( '2d' );

  this.WIDTH  = window.innerWidth;
  this.HEIGHT = window.innerHeight;

  this._canvas.style.backgroundColor = '#92AF9F';
  this._canvas.width  = this.WIDTH;
  this._canvas.height = this.HEIGHT;

  this._prevTime = Date.now();
  this._currTime = this._prevTime;

  this._characters  = [];
  this._projectiles = [];
  this._effects     = [];
};

// Add entities.
Game.prototype.addCharacter = function( character ) {
  this._characters.push( character );
};

Game.prototype.addProjectile = function( projectile ) {
  this._projectiles.push( projectile );
};

Game.prototype.addEffect = function( effect ) {
  this._effects.push( effect );
};

// Remove entities.
Game.prototype.removeCharacter = function( character ) {
  removeFromArray( character, this._characters );
};

Game.prototype.removeProjectile = function( projectile ) {
  removeFromArray( projectile, this._projectiles );
};

Game.prototype.removeEffect = function( effect ) {
  removeFromArray( effect, this._effects );
};

// Getters.
Game.prototype.getCharacters = function() {
  return this._characters;
};

// Update functions.
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

// Drawing functions.
Game.prototype.draw = function() {
  this._ctx.clearRect( 0, 0, this.WIDTH, this.HEIGHT );

  this.drawCharacters( this._ctx );
  this.drawProjectiles( this._ctx );
};

Game.prototype.drawCharacters = function( ctx ) {
  for ( var i = this._characters.length - 1; i >= 0; i-- )
    this._characters[i].draw( ctx );
};

Game.prototype.drawProjectiles = function( ctx ) {
  for ( var i = this._projectiles.length - 1; i >= 0; i-- )
    this._projectiles[i].draw( ctx );
};

// Initialize game object.
Game.prototype.init = function() {
  var char0 = new Character( 200, 400, 44, 52, 56, 1.0, 20 );
  this.addCharacter( char0 );

  var char1 = new Character( 200, 200, 240, 63, 53, 1.0, 20 );
  char1.setTeam( 1 );
  char1.physics.setVelocity( 0.25, 0.25 );
  char1.addWeapon( new BulletGun( char1, 1, 200, -1, 0.5, 27, 32, 37, 1.0, 3 ) );
  char1.addWeapon( new LaserGun( char1, 1, 200, 200, 240, 103, 93, 0.75 ) );
  this.addCharacter( char1 );

  var char2 = new Character( 400, 500, 240, 240, 211, 1.0, 20 );
  char2.addWeapon( new BulletGun( char2, 1, 1000, -1, 0.5, 27, 32, 37, 1.0, 3 ) );
  this.addCharacter( char2 );
};

var _game = new Game();

