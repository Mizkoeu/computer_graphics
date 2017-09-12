"use strict";
let Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.triangleGeometry = new TriangleGeometry(gl);
  //this.triangleGeometry2 = new TriangleGeometry(gl);
  this.trianglePosition = {x:0, y:0, z:0};
  this.trianglePosition2 = {x:1, y:1, z:0};
  this.timeAtLastFrame = new Date().getTime();

};

Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false
  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

  this.trianglePosition.x += 0.5 * dt;
  if (this.trianglePosition.x > 2.5) {
    this.trianglePosition.x = -2.5;
  }
  console.log("triang pos: " + this.trianglePosition.x + " and screen width: " + window.screen.width);

  this.trianglePosition2.x -= 0.1 * dt;

  // clear the screen
  gl.clearColor(0, 0, 0.8, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.solidProgram.commit();

  var trianglePositionLocation = gl.getUniformLocation(this.solidProgram.glProgram, "trianglePosition");

  if (trianglePositionLocation < 0)
    console.log("Could not find uniform trianglePosition.");
  else {
    gl.uniform3f(trianglePositionLocation,
    this.trianglePosition.x, this.trianglePosition.y, this.trianglePosition.z);
  };

  this.triangleGeometry.draw();

  var trianglePositionLocation = gl.getUniformLocation(this.solidProgram.glProgram, "trianglePosition");

  if (trianglePositionLocation < 0)
    console.log("Could not find uniform trianglePosition2.");
  else {
    console.log("tracking pos2: " + this.trianglePosition2.x);
    gl.uniform3f(trianglePositionLocation,
    this.trianglePosition2.x, this.trianglePosition2.y, this.trianglePosition2.z);
  };

  this.triangleGeometry.draw();
};
