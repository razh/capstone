var trackMouse = false;

function onMouseMove( event ) {
  var mouse = {
    x: event.pageX - _game._canvas.offsetLeft,
    y: event.pageY - _game._canvas.offsetTop
  };

  if ( trackMouse ) {
    _game._characters[0].physics.setXY( mouse.x, mouse.y );
  }
}

function onMouseDown( event ) {
  var mouse = {
    x: event.pageX - _game._canvas.offsetLeft,
    y: event.pageY - _game._canvas.offsetTop
  };

  trackMouse = !trackMouse;
  if ( trackMouse ) {
    _game._canvas.style.cursor = 'none';
    _game._characters[0].physics.setXY( mouse.x, mouse.y );
  } else {
    _game._canvas.style.cursor = 'default';
  }
}
