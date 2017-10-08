"use strict"
let GameObject = function(id, mesh) {
  this.id = id;
  this.mesh = mesh;

  this.toDestroy = false;
  this.targetPos = null;
  this.move = function(cellWidth) {
    if (this.targetPos !== null) {
      let x = this.targetPos.x;
      let y = this.targetPos.y;
      let targetPos = new Vec3(cellWidth*(x-4.5), cellWidth*(4.5-y), 0);
      if (this.position.y > targetPos.y) {
        this.position.add(new Vec3(0, -.01, 0));
      } else if (this.position.x > targetPos.x + .1){
        this.position.add(new Vec3(-.01, 0, 0));
      } else if (this.position.x < targetPos.x - .1){
        this.position.add(new Vec3(.01, 0, 0));
      } else {
        this.position.set(targetPos);
        this.targetPos = null;
      }
    }
  };

  this.position = new Vec3(0, 0, 0);
  this.orientation = 0;
  this.scale = new Vec3(0, 0, 0);
  this.color = new Vec4(0, 0, 0, 0);

  this.isRotate = false;
  this.opacity = 1;
  this.modelMatrix = new Mat4();

  this.setPos = function(x, y, cellWidth) {
    this.position.set(cellWidth*(x-4.5), cellWidth*(4.5-y), 0);
  }
};

GameObject.prototype.updateModelMatrix = function(){
  // TODO: set the model matrix according to the position, orientation, and scale
  this.modelMatrix.set().rotate(this.orientation).scale(this.scale).translate(this.position);
};

GameObject.prototype.draw = function(camera){
  this.updateModelMatrix();
  camera.updateViewProjMatrix();
// TODO: Set the uniform modelViewProjMatrix (reflected in the material)
//    from the modelMatrix (no camera yet) Operator = cannot be used. Use Mat4 methods set() and/or mul().
  this.mesh.material.modelViewProjMatrix.set().mul(this.modelMatrix).mul(camera.viewProjMatrix);
  if (this.id === 2) {
    this.mesh.material.opacity.set(this.opacity);
  } else {
    this.mesh.material.solidColor.set(this.color);
  }
  this.mesh.draw();
};
