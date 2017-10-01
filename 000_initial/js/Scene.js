"use strict";
let Scene = function(gl) {

  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);

  //this.grid = new Grid(10, 10);

  this.heartgeometry = new HeartGeometry(gl);
  this.stargeometry = new StarGeometry(gl);
  this.rectGeometry = new RectGeometry(gl);
  this.triangleGeometry = new TriangleGeometry(gl);
  this.trianglePosition = new Vec3(0, .55, 0);
  this.triangleScale = 1;
  this.triangleRotation = 0.0;
  this.triangleRotation2 = 0.0;
  this.trianglePosition2 = {x:1, y:1, z:0};
  this.timeAtLastFrame = new Date().getTime();

  this.material = new Material(gl, this.solidProgram);
  this.material.solidColor.set(0.1, 0.3, 0.7, 1);

  //Create a camera
  this.camera = new OrthoCamera();

  this.gameObjects = [];
  this.inventory = [this.rectGeometry, this.stargeometry, this.heartgeometry];

  for (var i=0;i<100;i++) {
    var row = Math.floor(i/10);
    var col = i%10;
    var geo = this.inventory[Math.floor(Math.random() * 3)];
    var star = new GameObject(new Mesh(geo, this.material));
    star.isRotate = Math.floor(Math.random() * 1.1);
    star.color.set(Math.random(0, .5), Math.random(0, 1), .5, .8);
    //star.scale.set(new Vec3(.8, .8, .8));
    star.position.set(.2*row - .8, .2*col - .8, 0);
    this.gameObjects.push(star);
  }
};

Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false
  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;


  //console.log("triang pos: " + this.trianglePosition.x + " and screen width: " + window.screen.width);

  this.trianglePosition2.x -= 0.1 * dt;
  this.triangleRotation2 += 0.2;

  this.triangleRotation += 0.1 * dt;

  // clear the screen
  gl.clearColor(.7, .8, .1, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.solidProgram.commit();

  var testCam = this.camera;

  if (keysPressed.W === true) {
    this.gameObjects[0].position.add(new Vec3(0, 1.8 * dt, 0));
  }
  if (keysPressed.D === true) {
    this.gameObjects[0].position.add(new Vec3(1.8 * dt, 0, 0));
  }
  if (keysPressed.A === true) {
    this.gameObjects[0].position.add(new Vec3(-1.8 * dt, 0, 0));
  }
  if (keysPressed.S === true) {
    this.gameObjects[0].position.add(new Vec3(0, -1.8 * dt, 0));
  }
  if (keysPressed.RIGHT === true) {
    this.camera.position.add(new Vec2(0.01, 0));
  }
  if (keysPressed.LEFT === true) {
    this.camera.position.add(new Vec2(-0.01, 0));
  }
  if (keysPressed.Q === true) {
    this.gameObjects[1].scale.mul(1.1);
  }
  if (keysPressed.E === true) {
    this.gameObjects[1].scale.mul(0.9);
  }


  if (this.trianglePosition.x > 2.5) {
    this.trianglePosition = new Vec3(-2.5, this.trianglePosition.y, 0);
  }


  this.gameObjects.forEach(function(obj) {
    if (obj.isRotate == true) {
      obj.orientation += 0.01;
    }
    obj.draw(testCam);
  });
//--> Using MATERIAL to SET MATRIX <---
  // this.material.modelViewProjMatrix.set().rotate(this.triangleRotation)
  //                                .translate(this.trianglePosition)
  //                                .scale(this.triangleScale);
  // this.material.commit();
  // this.triangleGeometry.draw();


//--> REALLY LOW LEVEL CODES, GO FIGURE IT OUT <---
  // var modelMatrixUniformLocation = gl.getUniformLocation(this.solidProgram.glProgram, "modelMatrix");
  // if (modelMatrixUniformLocation < 0)
  //   console.log("Could not find uniform modelMatrixUniformLocation.");
  // else {
  //   var modelMatrix = new Mat4().rotate(this.triangleRotation)
  //                               .translate(this.trianglePosition)
  //                               .scale(this.triangleScale);
  //   modelMatrix.commit(gl, modelMatrixUniformLocation);
  // }
  //
  // this.triangleGeometry.draw();
  //
  // var modelMatrixUniformLocation = gl.getUniformLocation(this.solidProgram.glProgram, "modelMatrix");
  // if (modelMatrixUniformLocation < 0)
  //   console.log("Could not find uniform modelMatrixUniformLocation.");
  // else {
  //   var modelMatrix = new Mat4().translate(new Vec3(2, 0, 0))
  //                               .rotate(this.triangleRotation2)
  //                               .translate(this.trianglePosition)
  //                               .scale(this.triangleScale);
  //   modelMatrix.commit(gl, modelMatrixUniformLocation);
  // }
  //
  // this.triangleGeometry.draw();
};
