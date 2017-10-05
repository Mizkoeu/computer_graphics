"use strict"
let GameObject = function(id, mesh) {
  this.id = id;
  this.mesh = mesh;

  this.position = new Vec3(0, 0, 0);
  this.orientation = 0;
  this.scale = new Vec3(1, 1, 1);
  this.color = new Vec4(0, 0, 0, 0);

  this.isRotate = false;
  this.opacity = 1;
  this.modelMatrix = new Mat4();
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
  this.mesh.material.solidColor.set(this.color);
  if (this.id === 2) {
    this.mesh.material.opacity.set(this.opacity);
  }
  this.mesh.draw();
};
