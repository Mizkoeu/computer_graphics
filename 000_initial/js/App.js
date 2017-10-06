// App constructor
let App = function(canvas, overlay) {
	this.canvas = canvas;
	this.overlay = overlay;

	// if no GL support, cry
	this.gl = canvas.getContext("experimental-webgl");
	if (this.gl === null) {
		throw new Error("Browser does not support WebGL");

	}

	this.gl.pendingResources = {};
	// create a simple scene
	this.scene = new Scene(this.gl);
	this.resize();
	this.keysPressed = {};
	this.mousePos = {};

	//for gem swap
	this.startPos = null;
	this.endPos = null;
};

// match WebGL rendering resolution and viewport to the canvas size
App.prototype.resize = function() {
	this.canvas.width = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;
	this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	this.scene.camera.setAspectRatio(this.canvas.clientWidth / this.canvas.clientHeight);
};

//closure function?
App.prototype.registerEventHandlers = function() {
	let theApp = this;
	document.onkeydown = function(event) {
		//jshint unused:false
		theApp.keysPressed[keyboardMap[event.keyCode]] = true;
	};
	document.onkeyup = function(event) {
		//jshint unused:false
		theApp.keysPressed[keyboardMap[event.keyCode]] = false;
	};
	this.canvas.onmousedown = function(event) {
		//jshint unused:false
		theApp.mousePos = {pressed: true,
											 drag: false,
											 coord: new Vec4(2*(event.clientX/theApp.canvas.clientWidth - .5),
										   -2*(event.clientY/theApp.canvas.clientHeight - .5), 0, 0)};
		theApp.startPos = theApp.mousePos.coord;
		console.log(theApp.startPos.x);
	};
	this.canvas.onmousemove = function(event) {
		//jshint unused:false
		event.stopPropagation();
		if (theApp.mousePos.pressed === true) {
			theApp.mousePos = {pressed: true,
												 drag: true,
												 coord: new Vec4(2*(event.clientX/theApp.canvas.clientWidth - .5),
											   -2*(event.clientY/theApp.canvas.clientHeight - .5), 0, 0)};
		}
	};
	this.canvas.onmouseout = function(event) {
		//jshint unused:false
	};
	this.canvas.onmouseup = function(event) {
		//jshint unused:false
		theApp.mousePos = {pressed: false,
											 drag: false,
											 coord: new Vec4(2*(event.clientX/theApp.canvas.clientWidth - .5),
										   -2*(event.clientY/theApp.canvas.clientHeight - .5), 0, 0)};
		theApp.endPos = theApp.mousePos.coord;
		console.log(theApp.endPos.x);
	};
	window.addEventListener('resize', function() {
		theApp.resize();
	});
	window.requestAnimationFrame(function() {
		theApp.update();
	});
};

// animation frame update
App.prototype.update = function() {

	let pendingResourceNames = Object.keys(this.gl.pendingResources);
	if (pendingResourceNames.length === 0) {
		// animate and draw scene
		this.scene.update(this.gl, this.keysPressed, this.mousePos);
		this.overlay.innerHTML = "Computer Graphics is AWESOME.";
		if (this.startPos !== null && this.endPos !== null) {
			//this.scene.drag(this.startPos, this.mousePos);
			this.scene.swap(this.startPos, this.endPos);
			this.startPos = null;
			this.endPos = null;
		}

	} else {
		this.overlay.innerHTML = "Loading: " + pendingResourceNames;
	}

	// refresh
	let theApp = this;
	window.requestAnimationFrame(function() {
		theApp.update();
	});
};

// entry point from HTML
window.addEventListener('load', function() {
	let canvas = document.getElementById("canvas");
	let overlay = document.getElementById("overlay");
	overlay.innerHTML = "WebGL";

	let app = new App(canvas, overlay);
	app.registerEventHandlers();
});
