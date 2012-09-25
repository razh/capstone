var Weapon = function( damage, rate, range ) {
  this.firing = true;
  this.time   = 0;
  this.rate   = rate;
  this.range  = range;
};

Weapon.prototype.update = function( elapsedTime ) {
  this.time += elapsedTime;
  if ( this.time >= this.rate )
    this.time = 0;
};



var Gun = function() {

};
