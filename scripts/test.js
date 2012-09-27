var trackMouse = false;

function onMouseMove( event ) {
  var mouse = {
    x: event.pageX - _game._canvas.offsetLeft,
    y: event.pageY - _game._canvas.offsetTop
  };
  // event.pageY -= _game._canvas.offsetTop;

  if ( trackMouse ) {
    _game._characters[0].setXY( mouse.x, mouse.y )
  }
}

function onMouseDown( event ) {
  var mouse = {
    x: event.pageX - _game._canvas.offsetLeft,
    y: event.pageY - _game._canvas.offsetTop
  };

  console.log( event.pageX );
  console.log( _game._canvas.offsetLeft );

  trackMouse = !trackMouse;
  if ( trackMouse ) {
    _game._canvas.style.cursor = 'none';
    _game._characters[0].setXY( mouse.x, mouse.y )
  } else {
    _game._canvas.style.cursor = 'default';
  }
}

function draw() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
}

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame       ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         window.oRequestAnimationFrame      ||
         window.msRequestAnimationFrame     ||
         function( callback ) {
            window.setTimeout( callback, 1000 / 60 );
         };
})();

// addEventListener polyfill 1.0 / Eirik Backer / MIT Licence
(function( win, doc ){
  if ( win.addEventListener ) return;		//No need to polyfill

	function docHijack( p ) {
    var old = doc[p];
    doc[p] = function( v ) {
      return addListen( old( v ) );      
    }
    
  }
	
  function addEvent( on, fn, self ) {
		return ( self = this ).attachEvent( 'on' + on, function( e ) {
			var e = e || win.event;
			e.preventDefault  = e.preventDefault  || function(){ e.returnValue = false }
			e.stopPropagation = e.stopPropagation || function(){ e.cancelBubble = true }
			fn.call( self, e );
		});
	}
  
	function addListen( obj, i ) {
		if ( i = obj.length )
      while( i--)
        obj[i].addEventListener = addEvent;
		else obj.addEventListener = addEvent;
		return obj;
	}

	addListen( [doc, win] );
	if ( 'Element' in win )
    win.Element.prototype.addEventListener = addEvent;			//IE8
	else{																			//IE < 8
    //Make sure we also init at domReady
		doc.attachEvent( 'onreadystatechange', function() { addListen( doc.all ) } );
		docHijack( 'getElementsByTagName' );
		docHijack( 'getElementById' );
		docHijack( 'createElement' );
		addListen( doc.all );	
	}
})( window, document );

function inArray( elem, array ) {
  for ( var i = array.length - 1; i >= 0; i-- )
    if ( array[i] === elem )
      return i;

  return -1;
}

function removeFromArray( elem, array ) {
  var index = inArray( elem, array );
  if ( index !== -1 )
    array.splice( index, 1 );
}

function direction( x0, y0, x1, y1 ) {
  return Math.atan2( y1 - y0, x1 - x0 );
}


function loop() {
  if ( !running )
    return;

  _game.tick();
  requestAnimFrame( loop );
}

function init() {
  _game.init();

  _game._canvas.addEventListener( 'mousedown', onMouseDown, null );
  _game._canvas.addEventListener( 'mousemove', onMouseMove, null );
  document.addEventListener( 'keydown', (function ( event ) {
    if ( event.keyCode === 81 )
      quit();
  }), null );

  loop();
}

function quit() {
  running = false;

  _game._canvas.removeEventListener( 'mousedown', onMouseDown );
  _game._canvas.removeEventListener( 'mousemove', onMouseMove );
}

var running = true;

init();
