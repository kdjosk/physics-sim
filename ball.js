// Canvas dimensions
var width = 500;
var height = 400;
var canvas = ctx = false;
// Rendering parameters
var frameRate = 1/40; // seconds
var frameDelay = frameRate * 1000; // time delay between frames in ms
var loopTimer = false;

var ball = {
  position: {x: width/2, y: 0},
  velocity: {x: 10, y: 0},
  mass: 0.1, // kg
  radius: 15, // cm, 1px = 1cm
  restitution: 0.7
};

var Cd = 0.47;
var rho = 1.22;
var A = Math.PI * ball.radius * ball.radius / 10000; // m^2
var g = 9.81; // m/s^2 acceleration due to gravity
var mouse = { x: 0, y: 0, isDown: false };

// Set position of mouse relative to cavas
function getMousePosition(e) {
  mouse.x = e.pageX - canvas.offsetLeft;
  mouse.y = e.pageY - canvas.offsetTop;
}

// React to user pressing left mouse button
// And set position of ball to the point of click
var mouseDown = function(e) {
  if(e.which == 1) {
    getMousePosition(e);
    mouse.isDown = true;
    ball.position.x = mouse.x;
    ball.position.y = mouse.y;
  }
}
var mouseUp = function(e) {
  if (e.which == 1) {
    mouse.isDown = false;
    //Change velocity based on mouse position with respect to ball
    ball.velocity.y = (ball.position.y - mouse.y) / 10;
    ball.velocity.x = (ball.position.x - mouse.x) / 10;
  }
}

var setup = function() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  canvas.onmousemove = getMousePosition;
  canvas.onmousedown = mouseDown;
  canvas.onmouseup = mouseUp;

  ctx.fillStyle = 'red';
  ctx.strokeStyle = '#000000';
  loopTimer = setInterval(loop, frameDelay);
}
var loop = function() {
  if( !mouse.isDown) {
    /*
    * Physics
    */
    // Drag force R = -1/2 * Cd * A * rho * v^3/|v| (the sign of v has to be preserved)
    var Fx = -0.5 * Cd * A * rho * ball.velocity.x * ball.velocity.x * ball.velocity.x / Math.abs(ball.velocity.x);
    var Fy = -0.5 * Cd * A * rho * ball.velocity.y * ball.velocity.y * ball.velocity.y / Math.abs(ball.velocity.y);

    // Fx, Fy will be nan if vx or vy is 0
    Fx = (isNaN(Fx) ? 0 : Fx);
    Fy = (isNaN(Fy) ? 0 : Fy);

    // Acceleration
    var ax = Fx / ball.mass;
    var ay = g + (Fy / ball.mass);
    // Velocity
    // dv = a * dt, v' = v0 + dv
    ball.velocity.x += ax * frameRate; //cm/
    ball.velocity.y += ay * frameRate;

    // Position
    // dx = v * dt, x' = x0 + dx
    ball.position.x += ball.velocity.x * frameRate * 100; //convert to cm
    ball.position.y += ball.velocity.y * frameRate * 100;
  }
  //Handle collisions
  if(ball.position.y > height - ball.radius) {
    ball.velocity.y *= -ball.restitution;
    ball.position.y = height - ball.radius;
  }
  if(ball.position.y < ball.radius) {
    ball.velocity.y *= -ball.restitution;
    ball.position.y = ball.radius;
  }
  if(ball.position.x > width - ball.radius) {
    ball.velocity.x *= -ball.restitution;
    ball.position.x = width - ball.radius;
  }
  if(ball.position.x < ball.radius) {
    ball.velocity.x *= -ball.restitution;
    ball.position.x = ball.radius;
  }

  //Draw the ball
  ctx.clearRect(0, 0, width, height);

  ctx.save();

  ctx.translate(ball.position.x, ball.position.y);
  ctx.beginPath();
  ctx.arc(0, 0, ball.radius, 0, Math.PI*2, true)
  ctx.fill();
  ctx.closePath();

  ctx.restore();

  //Draw the slingshot
  if (mouse.isDown) {
    ctx.beginPath();
    ctx.moveTo(ball.position.x, ball.position.y);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
    ctx.closePath();
  }

}

setup();
