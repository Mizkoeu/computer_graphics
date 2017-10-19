"use strict";
let Scene = function(gl) {
  gl.enable(gl.BLEND);
  gl.enable(gl.DEPTH_TEST);
  gl.blendFunc(
  gl.SRC_ALPHA,
  gl.ONE_MINUS_SRC_ALPHA);

  //time
  this.timeAtLastFrame = new Date().getTime();

  //shader & programs
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new TextureProgram(gl, this.vsIdle, this.fsSolid);

  //geometries
  this.textureGeometry = new TexturedIndexedTrianglesGeometry(gl, "./Slowpoke.json");

  //materials
  this.bodyMaterial = new Material(gl, this.solidProgram);
  this.eyeMaterial = new Material(gl, this.solidProgram);
  //texture binding
  this.texture = new Texture2D(gl, "./Slowpoke/YadonDh.png");
  this.texture2 = new Texture2D(gl, "./Slowpoke/YadonEyeDh.png");
  this.bodyMaterial.colorTexture.set(this.texture.glTexture);
  this.eyeMaterial.colorTexture.set(this.texture2.glTexture);
  //Create a camera
  this.camera = new PerspectiveCamera();

  //Array of Light sources
  this.lightSource = new Vec4Array(2);
  this.lightSource.at(0).set(1, 1, 1, 0);
  this.lightSource.at(1).set(0, -1, -1, 0);

  //this.bodyMaterial.lightPos.set(this.lightSource);

  //Create object array
  this.mesh = new Mesh(this.textureGeometry, this.material);
  this.materials = [];
  this.materials.push(this.bodyMaterial);
  this.materials.push(this.eyeMaterial);
  this.renderObject = new GameObject(new MultiMesh(gl, "./Slowpoke/Slowpoke.json", this.materials));
  this.renderObject.position = new Vec3(0, -.2, -1.5);
  //this.renderObject.orientation = .2;
  this.renderObject.scale = .06;
  this.newPoke = new GameObject(new MultiMesh(gl, "./Slowpoke/Slowpoke.json", this.materials));
  this.newPoke.position = new Vec3(-.33, -.2, -1.2);
  this.newPoke.scale = 0.03;
  this.newPoke.orientation = .3;
};


Scene.prototype.update = function(gl, keysPressed) {
  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

  // clear the screen
  gl.clearColor(0.1, 0.1, 0.4, .5);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.solidProgram.commit();

  this.camera.move(dt, keysPressed);

  //drawing the shapes!!!
  this.renderObject.draw(this.camera, this.lightSource);
  this.newPoke.draw(this.camera, this.lightSource);

//The rest is from the first 2 weeks of practicals!

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
