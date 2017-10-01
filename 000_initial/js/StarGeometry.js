"use strict";
let StarGeometry = function(gl) {
  this.gl = gl;

  // vertex buffer
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  // create an ARRAY_BUFFER
  var vertexArray = [];
  vertexArray.push(0.0, 0.0, 0.0);
  let radius = .1;
  for (var i = 0; i <= 10; i++) {
    if (i%2 === 0) {
      var evenIndex = 1;
    } else {
      var evenIndex = 2.6;
    }
    vertexArray.push(Math.sin(.2 * i * Math.PI) * radius / evenIndex,
                     Math.cos(.2 * i * Math.PI) * radius / evenIndex, 0);
  }
  console.log(vertexArray.length);

  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(vertexArray),
    gl.STATIC_DRAW);

  // index buffer
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  var indexArray = [];
  for (var i = 1; i <= 10; i++) {
    indexArray.push(0, i, i + 1);
  }
  //console.log(indexArray);

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indexArray),
    gl.STATIC_DRAW);

};

StarGeometry.prototype.draw = function() {
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

  gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_SHORT, 0);
};
