"use strict";
let Scene = function(gl) {
  //time
  this.timeAtLastFrame = new Date().getTime();

  //shader & programs
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.pixSolid = new Shader(gl, gl.FRAGMENT_SHADER, "pulsate_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.pulsateProgram = new Program(gl, this.vsIdle, this.pixSolid);

  //geometries
  this.heartgeometry = new HeartGeometry(gl);
  this.stargeometry = new StarGeometry(gl);
  this.rectGeometry = new RectGeometry(gl);
  this.weirdGometry = new WeirdGeometry(gl);

  //materials
  this.material = new Material(gl, this.solidProgram);
  this.pulsateMaterial = new Material(gl, this.pulsateProgram);
  this.material.solidColor.set(0.1, 0.3, 0.7, 1);

  //Create a camera
  this.camera = new OrthoCamera();

  //Create object array
  this.gameObjects = [];
  this.gridNum = 10;
  this.cellWidth = 0.18;
  this.inventory = [new Mesh(this.rectGeometry, this.material),
                    new Mesh(this.stargeometry, this.material),
                    new Mesh(this.heartgeometry, this.pulsateMaterial),
                    new Mesh(this.weirdGometry, this.material)];


  for (var i=0;i<this.gridNum;i++) {
    this.gameObjects[i] = [];
    for(var j=0;j<this.gridNum;j++) {
      var id = Math.floor(Math.random() * 4);
      var obj = new GameObject(id, this.inventory[id]);
      if (id === 0) {
        obj.isRotate = true;
      }
      obj.color.set(Math.random() * .5, Math.random(), .3, .8);
      obj.scale.set(new Vec3(.8, .8, .8));
      obj.position.set(this.cellWidth*(i-4.5), this.cellWidth*(4.5-j), 0);
      this.gameObjects[i][j] = obj;
    }
  }
};

Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false
  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

  console.log(timeAtThisFrame);

  // clear the screen
  gl.clearColor(.2, .3, .6, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.solidProgram.commit();
  this.pulsateProgram.commit();

  var testCam = this.camera;

  if (keysPressed.W === true) {
    this.gameObjects[4][4].position.add(new Vec3(0, 1.8 * dt, 0));
  }
  if (keysPressed.D === true) {
    this.gameObjects[4][4].position.add(new Vec3(1.8 * dt, 0, 0));
  }
  if (keysPressed.A === true) {
    this.gameObjects[4][4].position.add(new Vec3(-1.8 * dt, 0, 0));
  }
  if (keysPressed.S === true) {
    this.gameObjects[4][4].position.add(new Vec3(0, -1.8 * dt, 0));
  }
  if (keysPressed.RIGHT === true) {
    this.camera.position.add(new Vec2(0.01, 0));
  }
  if (keysPressed.LEFT === true) {
    this.camera.position.add(new Vec2(-0.01, 0));
  }

  //Quake Feature:
  //Screen shakes, in each frame each obj stand a .1% chance of elimination.
  if (keysPressed.Q === true) {
    this.camera.position.set(new Vec2(Math.cos(timeAtThisFrame)*.1, 0));
    for (var i=0;i<this.gridNum;i++) {
      for(var j=0;j<this.gridNum;j++) {
        if (Math.random() < 0.001) {
          this.gameObjects[i][j].scale.set(new Vec3(0, 0, 0));
        }
      }
    }
    this.gameObjects
  }




  if (keysPressed.E === true) {
    this.gameObjects[2][0].scale.mul(0.9);
  }

  this.gameObjects.forEach(function(arr) {
    for (var i=0;i<10;i++) {
      var obj = arr[i];
      if (obj.isRotate === true) {
        obj.orientation += 0.01;
      }
      obj.opacity = Math.sin(timeAtThisFrame/80.0) * .6 + .2;
      obj.draw(testCam);
    }
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
