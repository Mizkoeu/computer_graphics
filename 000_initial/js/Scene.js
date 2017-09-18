"use strict";
let Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.triangleGeometry = new TriangleGeometry(gl);
  //this.triangleGeometry2 = new TriangleGeometry(gl);
  this.trianglePosition = new Vec3(0, 0, 0);
  this.triangleScale = .15;
  this.triangleRotation = 0.0;
  this.triangleRotation2 = 0.0;
  this.trianglePosition2 = {x:1, y:1, z:0};
  this.timeAtLastFrame = new Date().getTime();

};

Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false
  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;


  console.log("triang pos: " + this.trianglePosition.x + " and screen width: " + window.screen.width);

  this.trianglePosition2.x -= 0.1 * dt;
  this.triangleRotation2 += 0.2;
  // clear the screen
  gl.clearColor(.7, .8, .1, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.solidProgram.commit();

  if (keysPressed.W === true) {
    this.trianglePosition.add(new Vec3(0, 1.8 * dt, 0));
  }
  if (keysPressed.D === true) {
    this.trianglePosition.add(new Vec3(1.8 * dt, 0, 0));
  }
  if (keysPressed.A === true) {
    this.trianglePosition.add(new Vec3(-1.8 * dt, 0, 0));
  }
  if (keysPressed.S === true) {
    this.trianglePosition.add(new Vec3(0, -1.8 * dt, 0));
  }
  if (keysPressed.RIGHT === true) {
    this.triangleRotation += .1;

  }
  if (keysPressed.LEFT === true) {
    this.triangleRotation -= .1;
  }
  if (keysPressed.Q === true) {
    this.triangleScale *= 1.2;
  }
  if (keysPressed.E === true) {
    this.triangleScale *= .8;
  }


  if (this.trianglePosition.x > 2.5) {
    this.trianglePosition = new Vec3(-2.5, 0, 0);
  }

  var modelMatrixUniformLocation = gl.getUniformLocation(this.solidProgram.glProgram, "modelMatrix");
  if (modelMatrixUniformLocation < 0)
    console.log("Could not find uniform modelMatrixUniformLocation.");
  else {
    var modelMatrix = new Mat4().rotate(this.triangleRotation)
                                .translate(this.trianglePosition)
                                .scale(this.triangleScale);
    modelMatrix.commit(gl, modelMatrixUniformLocation);
  }

  this.triangleGeometry.draw();

  var modelMatrixUniformLocation = gl.getUniformLocation(this.solidProgram.glProgram, "modelMatrix");
  if (modelMatrixUniformLocation < 0)
    console.log("Could not find uniform modelMatrixUniformLocation.");
  else {
    var modelMatrix = new Mat4().translate(new Vec3(2, 0, 0))
                                .rotate(this.triangleRotation2)
                                .translate(this.trianglePosition)
                                .scale(this.triangleScale);
    modelMatrix.commit(gl, modelMatrixUniformLocation);
  }

  this.triangleGeometry.draw();
};
