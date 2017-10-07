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
  this.textureGeometry = new TexturedQuadGeometry(gl);

  //materials
  this.material = new Material(gl, this.solidProgram);
  this.pulsateMaterial = new Material(gl, this.pulsateProgram);
  //this.material.solidColor.set(0.1, 0.3, 0.7, 1);

  //texture binding
  //this.texture = new Texture2D(gl, "./supernova-icon.png");
  //this.material.colorTexture.set(this.texture.glTexture);

  //Create a camera
  this.camera = new OrthoCamera();

  //Create object array
  this.gameObjects = [];
  this.activeObject = null;
  this.gridNum = 10;
  this.cellWidth = 0.18;
  this.inventory = [new Mesh(this.rectGeometry, this.material),
                    new Mesh(this.stargeometry, this.material),
                    new Mesh(this.heartgeometry, this.pulsateMaterial),
                    new Mesh(this.weirdGometry, this.material)];

  for (var i=0;i<this.gridNum;i++) {
    this.gameObjects[i] = [];
    for(var j=0;j<this.gridNum;j++) {
      this.createNew(i, j);
    }
  }

  this.drag = function(startPos, mousePos) {
    this.camera.viewProjMatrix.invert();
    startPos = (new Vec4(startPos, 0)).mul(this.camera.viewProjMatrix);
    var x = Math.floor(this.gridNum/2 + startPos.x/this.cellWidth);
    var y = Math.floor(this.gridNum/2 - startPos.y/this.cellWidth);
    console.log(x, y);
    if (x < this.gridNum && y < this.gridNum && x >= 0 && y >= 0) {
      let obj = this.gameObjects[x][y];
      if (obj !== null && obj.toDestroy === false) {
        if (mousePos.drag === true) {
          var mousePos = (new Vec4(mousePos.coord, 0)).mul(this.camera.viewProjMatrix);
          obj.position.set(new Vec3(mousePos.x, mousePos.y, 0));
        } else {
          obj.setPos(x, y, this.cellWidth);
        }
      }
    }
  };

  this.swap = function(startPos, endPos) {
    //console.log("I got these: (" + startPos.x + ", " + startPos.y + ") and (" + endPos.x + ", " + endPos.y + ")!!");
    //this.camera.viewProjMatrix.invert();
    startPos = (new Vec4(startPos, 0)).mul(this.camera.viewProjMatrix);
    endPos = (new Vec4(endPos, 0)).mul(this.camera.viewProjMatrix);
    //console.log("I got these: (" + startPos.x + ", " + startPos.y + ") and (" + endPos.x + ", " + endPos.y + ")!!");
    var x1 = Math.floor(this.gridNum/2 + startPos.x/this.cellWidth);
    var y1 = Math.floor(this.gridNum/2 - startPos.y/this.cellWidth);
    var x2 = Math.floor(this.gridNum/2 + endPos.x/this.cellWidth);
    var y2 = Math.floor(this.gridNum/2 - endPos.y/this.cellWidth);
    console.log("swapping between (" + x1 + ", " + y1 + ") and (" + x2 + ", " + y2 + ")!!");
    if (x1<this.gridNum && x1>=0 && y1<this.gridNum && y1>=0) {
      if (x2<this.gridNum && x2>=0 && y2<this.gridNum && y2>=0) {
        if ((Math.abs(x1 - x2) === 1 && y1 === y2)|| (Math.abs(y1 - y2) === 1 && x1 === x2)) {
          var temp = this.gameObjects[x1][y1];
          this.gameObjects[x1][y1] = this.gameObjects[x2][y2];
          this.gameObjects[x2][y2] = temp;
          if (this.checkTriple(x1, y1) || this.checkTriple(x2, y2)) {
            this.gameObjects[x1][y1].setPos(x1, y1, this.cellWidth);
            this.gameObjects[x2][y2].setPos(x2, y2, this.cellWidth);
          } else {
            this.gameObjects[x2][y2] = this.gameObjects[x1][y1];
            this.gameObjects[x1][y1] = temp;
          }
        }
      }
    }
  };

  this.checkLine = function() {
    for (var i=0;i<this.gridNum;i++) {
      for(var j=0;j<this.gridNum;j++) {
        if (this.gameObjects[i][j] !== null) {
          let ID = this.gameObjects[i][j].id;
          var rowIdentical = 1;
          var rowStart = i;
          var colIdentical = 1;
          var colStart = j;
          for (var row=i-1;row>=0 && this.gameObjects[row][j] !== null && this.gameObjects[row][j].id === ID;row--,rowStart--,rowIdentical++);
          for (var row=i+1;row<this.gridNum && this.gameObjects[row][j] !== null && this.gameObjects[row][j].id === ID;row++,rowIdentical++);
          if (rowIdentical >= 3) {
            for (var n=0;n<rowIdentical;n++,rowStart++) {
              this.gameObjects[rowStart][j].toDestroy = true;
            }
          }

          for (var col=j-1;col>=0 && this.gameObjects[i][col] !== null && this.gameObjects[i][col].id === ID;col--,colStart--,colIdentical++);
          for (var col=j+1;col<this.gridNum && this.gameObjects[i][col] !== null && this.gameObjects[i][col].id === ID;col++,colIdentical++);
          if (colIdentical >= 3) {
            for (var n=0;n<colIdentical;n++,colStart++) {
              this.gameObjects[i][colStart].toDestroy = true;
            }
          }
        }
      }
    }
  };

  this.checkTriple = function(i, j) {
    if (this.gameObjects[i][j] !== null) {
      let ID = this.gameObjects[i][j].id;
      var rowIdentical = 1;
      var rowStart = i;
      var colIdentical = 1;
      var colStart = j;
      for (var row=i-1;row>=0 && this.gameObjects[row][j] !== null && this.gameObjects[row][j].id === ID;row--,rowStart--,rowIdentical++);
      for (var row=i+1;row<this.gridNum && this.gameObjects[row][j] !== null && this.gameObjects[row][j].id === ID;row++,rowIdentical++);
      if (rowIdentical >= 3) {
        return true;
      }

      for (var col=j-1;col>=0 && this.gameObjects[i][col] !== null && this.gameObjects[i][col].id === ID;col--,colStart--,colIdentical++);
      for (var col=j+1;col<this.gridNum && this.gameObjects[i][col] !== null && this.gameObjects[i][col].id === ID;col++,colIdentical++);
      if (colIdentical >= 3) {
        return true;
      }
    }
    return false;
  };



};

  //Texture practical
  //this.gameObjects.push(new GameObject(4, new Mesh(this.textureGeometry, this.material)));
  //};
Scene.prototype.dramaticExit = function() {
  var status = false;
    for (var x=0;x<this.gridNum;x++) {
      for (var y=0;y<this.gridNum;y++) {
        let obj = this.gameObjects[x][y];
        if (obj !== null) {
          if (obj.toDestroy === true) {
            if (obj.scale.x >= 0) {
              status = true;
              obj.scale.add(new Vec3(-0.1, -0.1, -0.1));
              obj.orientation += .3;
            } else {
              this.gameObjects[x][y] = null;
            }
          }
        }
      }
    }
  return status;
};

Scene.prototype.createNew = function(i, j) {
    var id = Math.floor(Math.random() * 4);
    var obj = new GameObject(id, this.inventory[id]);
    if (id === 0) {
      obj.isRotate = true;
    }
    obj.color.set(Math.random() * .5, Math.random(), .2, .8);
    obj.scale.set(new Vec3(.8, .8, .8));
    obj.setPos(i, j, this.cellWidth)
    this.gameObjects[i][j] = obj;
  };

Scene.prototype.skyFall = function() {
    for (var i=0;i<this.gridNum;i++) {
      for(var j=0;j<this.gridNum;j++) {
        if (this.gameObjects[i][j] === null) {
         if (j !== 0) {
           this.gameObjects[i][j] = this.gameObjects[i][j-1];
           this.gameObjects[i][j-1] = null;
           this.gameObjects[i][j].targetPos = new Vec3(i, j, 0);
         } else {
           this.createNew(i, j);
         }
        }
      }
    }
};

Scene.prototype.bomb = function(keysPressed, mousePos, startPos) {
  //Bomb feature
  if (keysPressed.B === true && mousePos.pressed === true && mousePos.drag === false) {
    //this.camera.viewProjMatrix.invert();
    var startPos = (new Vec4(startPos, 0)).mul(this.camera.viewProjMatrix);
    var x = Math.floor(this.gridNum/2 + startPos.x/this.cellWidth);
    var y = Math.floor(this.gridNum/2 - startPos.y/this.cellWidth);
    console.log("new x, y at bomb: " + x + ", " + y);

    this.gameObjects[x][y].toDestroy = true;
  }
};

Scene.prototype.update = function(gl, keysPressed, mousePos) {
  //jshint bitwise:false
  //jshint unused:false
  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

  // clear the screen
  gl.clearColor(.1, .2, .4, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.solidProgram.commit();
  this.pulsateProgram.commit();

  var testCam = this.camera;

  // Mouse position calculation
  // var pos = new Vec4(mousePos.x, mousePos.y, 0, 0);
  // var mouseCoord = pos.mul(testCam.viewProjMatrix.invert());
  // var x = Math.floor(this.gridNum/2 + mouseCoord.x/this.cellWidth);
  // var y = Math.floor(this.gridNum/2 - mouseCoord.y/this.cellWidth);

  //**********************************
  //********* DEBUG ******************
  //console.log(mousePos);
  //console.log("Mouse is at x: " + x + "; y: " + y);

  //drag
  // if (x<this.gridNum && x>=0 && y<this.gridNum && y>=0) {
  //   if (mousePos.drag === false && mousePos.pressed === true) {
  //   //this.activeObject = this.gameObjects[x][y];
  //   }
  // }
  //
  // if (mousePos.drag === true && this.activeObject !== null) {
  //   //this.activeObject.position.set(mouseCoord);
  // }
  //
  // //if mouse is up, no active objects is registered
  // if (mousePos.pressed === false && this.activeObject !== null) {
  //   //this.activeObject.position.set(this.gameObjects[x][y].position);
  //   //this.activeObject = null;
  // }

  //click and disappear!
  // if (x<this.gridNum && x>=0 && y<this.gridNum && y>=0 && mousePos.pressed === true) {
  //   this.gameObjects[x][y].scale.set(new Vec3(0, 0, 0));
  // }

  if (keysPressed.A === true) {
    testCam.rotation += 0.05;
  }
  if (keysPressed.D === true) {
    testCam.rotation -= 0.05;
  }
  if (keysPressed.S === true) {
    this.gameObjects[4][4].position.add(new Vec3(0, -1.8 * dt, 0));
  }

  //Quake Feature:
  //Screen shakes, in each frame each obj stand a .1% chance of elimination.
  if (keysPressed.Q === true) {
    this.camera.position.set(new Vec2(Math.cos(timeAtThisFrame)*.05, 0));
    for (var i=0;i<this.gridNum;i++) {
      for(var j=0;j<this.gridNum;j++) {
        if (Math.random() < 0.001) {
          this.gameObjects[i][j].toDestroy = true;;
        }
      }
    }
    this.gameObjects
  }

  if (keysPressed.E === true) {
    this.gameObjects[2][0].scale.mul(0.9);
  }

  //drawing the shapes!!!
  let theScene = this;
  this.gameObjects.forEach(function(arr) {
    for (var i=0;i<10;i++) {
      var obj = arr[i];
      if (obj !== null) {
        obj.move(theScene.cellWidth);
        if (obj.isRotate === true) {
          obj.orientation += 0.01;
        }
        obj.opacity = Math.sin(timeAtThisFrame/150.0) * .5 + .1;
        obj.draw(testCam);
      }
    }
    //arr.draw(testCam);
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
