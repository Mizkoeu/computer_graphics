"use strict";
let HeartGeometry = function(gl) {
  this.gl = gl;

  // vertex buffer
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  // create an ARRAY_BUFFER
  var vertexArray = [];
  vertexArray.push(0.0, 0.0, 0.0);
  let radius = .005;
  for (var i = 0; i <= 60; i++) {
    var t = i * Math.PI/30;
    vertexArray.push(16 * Math.pow(Math.sin(t), 3) * radius,
                     (13 * Math.cos(t)- 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * radius, 0);
  }
  console.log(vertexArray.length);

  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(vertexArray),
    gl.STATIC_DRAW);

  // index buffer
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  var indexArray = [];
  for (var i = 1; i <= 60; i++) {
    indexArray.push(0, i, i + 1);
  }
  //console.log(indexArray);

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indexArray),
    gl.STATIC_DRAW);

};

HeartGeometry.prototype.draw = function() {
  let gl = this.gl;
  // set vertex buffer to pipeline input
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );

  // set index buffer to pipeline input
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

  gl.drawElements(gl.TRIANGLES, 180, gl.UNSIGNED_SHORT, 0);
};
