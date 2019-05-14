// Canvas dimensions
var width = 1000;
var height = 800;
var canvas = ctx = false;
// Rendering parameters
var frameRate = 1/60; // seconds
var frameDelay = frameRate * 1000; // time delay between frames in ms
var loopTimer = false;

var anchor_x = width/2;
var anchor_y = 300;

var length1 = 200; //length of the rod
var length2 = 200;
var mass1 = 2; // mass of the first weight
var mass2 = 2; // mass of the second weight
var theta1 = Math.PI/2; // angle of the first rod with respect to y axis
var theta2 = Math.PI/3; // angle of the second rod with respect to x axis
var omega1 = 0; // angular velocity of the first weight
var omega2 = 0; // angular velocity of the first weight
var epsilon1 = 0; // angular acceleration of the first weight1
var epsilon2 = 0; // anguar acceleration of the second pendulum
// Coordinates of the weigths
var x1;
var y1;
var x2;
var y2;

var g = 981; // cm/s^2 acceleration due to gravity
var mouse = { x: 0, y: 0, isDown: false };

// Set position of mouse relative to cavas
function getMousePosition(e) {
  mouse.x = e.pageX - canvas.offsetLeft;
  mouse.y = e.pageY - canvas.offsetTop;
}

//Reset movement of the pendulum, set angles from sliders
function reset() {

  var s1 = document.getElementById("theta1_slider")
  s1.innerHTML = s1.value;
  theta1 = parseFloat(s1.value);

  var s2 = document.getElementById("theta2_slider")
  s2.innerHTML = s2.value;
  theta2 = parseFloat(s2.value);

  omega1 = 0;
  omega2 = 0;
  epsilon1 = 0;
  epsilon2 = 0;

}

// React to user pressing left mouse button
// And set position of ball to the point of click

var setup = function() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  ctx.fillStyle = 'black';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;

  document.getElementById("m1_slider").onchange = function() {
    this.innerHTML = this.value;
    mass1 = parseInt(this.value);
    document.getElementById("m1_slider_label").innerHTML = mass1;
  }
  document.getElementById("m2_slider").onchange = function() {
    this.innerHTML = this.value;
    mass2 = parseInt(this.value);
    document.getElementById("m2_slider_label").innerHTML = mass2;
  }
  document.getElementById("l1_slider").onchange = function() {
    this.innerHTML = this.value;
    length1 = parseInt(this.value);
    document.getElementById("l1_slider_label").innerHTML = length1;
  }
  document.getElementById("l2_slider").onchange = function() {
    this.innerHTML = this.value;
    length2 = parseInt(this.value);
    document.getElementById("l2_slider_label").innerHTML = length2;
  }
  document.getElementById("theta1_slider").onchange = function() {
    this.innerHTML = this.value;
    theta1 = parseFloat(this.value);
    document.getElementById("theta1_slider_label").innerHTML = theta1;
  }
  document.getElementById("theta2_slider").onchange = function() {
    this.innerHTML = this.value;
    theta2 = parseFloat(this.value);
    document.getElementById("theta2_slider_label").innerHTML = theta2;
  }
  document.getElementById("g_slider").onchange = function() {
    this.innerHTML = this.value;
    g = parseFloat(this.value);
    document.getElementById("g_slider_label").innerHTML = g;
    g *= 100; // convert to cm/s^2
  }
  //Reset movement of the pendulum, set angles from sliders
  document.getElementById("reset").onclick = function() {
    var s1 = document.getElementById("theta1_slider")
    s1.innerHTML = s1.value;
    theta1 = parseFloat(s1.value);

    var s2 = document.getElementById("theta2_slider")
    s2.innerHTML = s2.value;
    theta2 = parseFloat(s2.value);

    omega1 = 0;
    omega2 = 0;
    epsilon1 = 0;
    epsilon2 = 0;
  }

  loopTimer = setInterval(loop, frameDelay);
}
var loop = function() {
  if( !mouse.isDown) {
    /*
    * Physics
    * Equations from https://www.myphysicslab.com/pendulum/double-pendulum-en.html
    */

    /*  Calculate epsilon1 */
    // Calculate all numerator parts
    var num1 = -g * (2 * mass1 + mass2) * Math.sin(theta1);
    var num2 = -mass2 * g * Math.sin(theta1 - 2 * theta2);
    var num3 = -2*Math.sin(theta1 - theta2) * mass2 * (omega2 * omega2 * length2);
    var num4 = -2*Math.sin(theta1 - theta2) * mass2 * (omega1 * omega1 * length1 * Math.cos(theta1 - theta2));
    // Calculate all numerator parts
    var denum1 = length1 * (2 * mass1 + mass2 - mass2 * Math.cos(2 * theta1 - 2 * theta2));
    // Calculate epsilon1
    epsilon1 =  (num1 + num2 + num3 + num4) / denum1;

    /* Calculate epsilon2 */
    // Calculate all numerator parts
    var num12 = omega1 * omega1 * length1 * (mass1 + mass2);
    var num22 = g * (mass1 + mass2) * Math.cos(theta1);
    var num32 = omega2 * omega2 * length2 * mass2 * Math.cos(theta1 - theta2);
    var num42 = 2 * Math.sin(theta1 - theta2);
    // Calculate all denumerator parts
    var denum12 = length2 * (2 * mass1 + mass2 - mass2 * Math.cos(2 * theta1 - 2 * theta2));
    // Calculate epsilon2
    epsilon2 = num42 * (num12 + num22 + num32) / denum12;

    //console.log("epsilon: ", epsilon1, epsilon2);
    //console.log("omega: ", omega1, omega2);

    /* Calculate omegas */
    omega1 += epsilon1 * frameRate;
    omega2 += epsilon2 * frameRate;



    /* Calculate thetas */
    theta1 += omega1 * frameRate;
    theta2 += omega2 * frameRate;

    /* Calculate positions */
    x1 = length1 * Math.sin(theta1);
    y1 = length1 * Math.cos(theta1);

    //console.log("x,y: ", x1, y1);

    x2 = x1 + length2 * Math.sin(theta2);
    y2 = y1 + length2 * Math.cos(theta2);
  }

  //Draw the ball
  ctx.clearRect(0, 0, width, height);

  ctx.save();

  ctx.translate(anchor_x, anchor_y);
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(x1, y1, 15, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(x2, y2, 15, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
  ctx.restore();

}

setup();
