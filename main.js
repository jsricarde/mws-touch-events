var ongoingTouches = [];


function startup() {
  const el = document.getElementsByTagName("canvas")[ 0 ];
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchend", handleEnd, false);
  el.addEventListener("touchcancel", handleCancel, false);
  el.addEventListener("touchmove", handleMove, false);
  log("initialized.");
}

function handleStart(evt) {
  evt.preventDefault();
  const el = document.getElementsByTagName('canvas')[ 0 ];
  const ctx = el.getContext('2d');
  const touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    log('touchstart' + i + '...');
    ongoingTouches.push(copyTouch(touches[ i ]));
    const color = colorForTouch(touches[ i ]);
    ctx.beginPath();
    ctx.arc(touches[ i ].pageX, touches[ i ].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
    ctx.fillStyle = color;
    ctx.fill();
    log("touchstart:" + i + ".");
  }
}

function handleMove(evt) {
  evt.preventDefault();
  const el = document.getElementsByTagName('canvas')[ 0 ];
  const ctx = el.getContext();
  const touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    const color = colorForTouch(touches[ i ]);
    const idx = ongoingTouchIndexById(touches[ i ].identifier);
    if (idx >= 0) {
      ctx.lineWidth = 4;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(ongoingTouches[ idx ].pageX, ongoingTouches[ idx ].pageY);
      ctx.lineTo(touches[ i ].pageX, touches[ i ].pageY);
      ctx.fillRect(touches[ i ].pageX - 4, touches[ i ].pageY - 4, 8, 8);
      ongoingTouches.splice(idx, 1);
    } else {
      log("Can't draw with touch to end.");
    }
  }
}

function handleEnd(evt) {
  evt.preventDefault();
  log("touchend");
  var el = document.getElementsByTagName("canvas")[ 0 ];
  var ctx = el.getContext("2d");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var color = colorForTouch(touches[ i ]);
    var idx = ongoingTouchIndexById(touches[ i ].identifier);

    if (idx >= 0) {
      ctx.lineWidth = 4;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(ongoingTouches[ idx ].pageX, ongoingTouches[ idx ].pageY);
      ctx.lineTo(touches[ i ].pageX, touches[ i ].pageY);
      ctx.fillRect(touches[ i ].pageX - 4, touches[ i ].pageY - 4, 8, 8);  // and a square at the end
      ongoingTouches.splice(idx, 1);  // remove it; we're done
    } else {
      log("can't figure out which touch to end");
    }
  }
}

function handleCancel(evt) {
  evt.preventDefault();
  log("touchcancel.");
  const touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    const idx = ongoingTouchIndexById(touches[ i ].identifier);
    ongoingTouches.splice(idx, 1);  // remove it; we're done
  }
}

function colorForTouch(touch) {
  let r = touch.identifier % 16;
  let g = Math.floor(touch.identifier / 3) % 16;
  let b = Math.floor(touch.identifier / 7) % 16;
  r = r.toString(16); // make it a hex digit
  g = g.toString(16); // make it a hex digit
  b = b.toString(16); // make it a hex digit
  const color = "#" + r + g + b;
  log("color for touch with identifier " + touch.identifier + " = " + color);
  return color;
}

function copyTouch(touch) {
  return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}

function ongoingTouchIndexById(idToFind) {
  for (let i = 0; i < ongoingTouches.length; i++) {
    const id = ongoingTouches[ i ].identifier;

    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}

function log(msg) {
  const p = document.getElementById('log');
  p.innerHTML = msg + "\n" + p.innerHTML;
}


