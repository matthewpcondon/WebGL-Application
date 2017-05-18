var gl, canvas, vertexCount = 0, texSize = 64, program;
var pyramidVertices = [
    vec4(2.0, 1.0, 2.0, 1.0), // vertex a; the pointy top 2 1 4 2 1 3
    vec4(1.0, 0.1, 3.0, 1.0), // b
    vec4(3.0, 0.1, 3.0, 1.0), // c
    vec4(3.0, 0.1, 1.0, 1.0), // d
    vec4(1.0, 0.1, 1.0, 1.0) // e
];
var prismVertices = [
	vec4(3.25,0.1,-3,1), // bottom
	vec4(3.25,0.1,-3.25,1),
	vec4(3,0.1,-3.25,1),
	vec4(3,0.1,-3,1),
	vec4(3.25,2.5,-3,1), // top
	vec4(3.25,2.5,-3.25,1),
	vec4(3,2.5,-3.25,1),
	vec4(3,2.5,-3,1)
];
var diamondVertices = [
	vec4(0,4,0,1),
	vec4(0,2,0,1),
	vec4(1,3,0,1),
	vec4(-1,3,0,1),
	vec4(0,3,-1,1),
	vec4(0,3,1,1)
];
var squareVertices = [
    vec4(-0.5, 0.5,  1.5, 1.0), // front face
    vec4(-0.5,  1.5,  1.5, 1.0),
    vec4(0.5,  1.5,  1.5, 1.0),
    vec4(0.5, 0.5,  1.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0), // back face
    vec4(-0.5,  1.5, 0.5, 1.0),
    vec4(0.5,  1.5, 0.5, 1.0),
    vec4( 0.5, 0.5, 0.5, 1.0) 
];
var floorVertices = [
	vec4(4.0,0.0,4.0,1.0), // a
	vec4(4.0,0.0,-4.0,1.0), // b
	vec4(-4.0,0.0,-4.0,1.0), // c
	vec4(-4.0,0.0,4.0,1.0) // d
];
var obeliskVertices1 = [
    vec4(-1.0,1.0,0.5,1.0), // bottom bottom
    vec4(-1.0,1.0,0.0,1.0),
    vec4(-1.5,1.0,0.0,1.0),
    vec4(-1.5,1.0,0.5,1.0),
    vec4(-1.0,1.5,0.5,1.0), // bottom top
    vec4(-1.0,1.5,0.0,1.0),
    vec4(-1.5,1.5,0.0,1.0),
    vec4(-1.5,1.5,0.5,1.0)
    ];
var obeliskVertices2 = [
    vec4(-1.2,1.5,0.2,1.0), // middle bottom
    vec4(-1.2,1.5,0.3,1.0),
    vec4(-1.3,1.5,0.3,1.0),
    vec4(-1.3,1.5,0.2,1.0),
    vec4(-1.2,2.0,0.2,1.0), // middle top
    vec4(-1.2,2.0,0.3,1.0),
    vec4(-1.3,2.0,0.3,1.0),
    vec4(-1.3,2.0,0.2,1.0)
    ];
var obeliskVertices3 = [
    vec4(-1.0,2.0,0.5,1.0), // top bottom
    vec4(-1.0,2.0,0.0,1.0),
    vec4(-1.5,2.0,0.0,1.0),
    vec4(-1.5,2.0,0.5,1.0),
    vec4(-1.0,2.5,0.5,1.0), // top top
    vec4(-1.0,2.5,0.0,1.0),
    vec4(-1.5,2.5,0.0,1.0),
    vec4(-1.5,2.5,0.5,1.0)
];
var texCoordsArray = [], useTex = [], isMoving = [];

var texture;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];
var pointsArray = [], pyramidPointsArray = [], colorsArray = [], normalsArray = [], lightPosition1, lightPosition1Loc, lightPosition2, lightPosition2Loc, lightAmbient1, lightAmbient1Loc, lightAmbient2, lightAmbient2Loc, lightDiffuse1, lightDiffuse1Loc, lightDiffuse2, lightDiffuse2Loc, lightSpecular1, lightSpecular1Loc, lightSpecular2, lightSpecular2Loc, materialAmbient, materialDiffuse, materialSpecular, materialShininess = 100.0, materialShininessLoc, ambientProduct1, ambientProduct1Loc, ambientProduct2, ambientProduct2Loc, diffuseProduct1, diffuseProduct1Loc, diffuseProduct2, diffuseProduct2Loc, specularProduct1, specularProduct1Loc, specularProduct2, specularProduct2Loc;
var transMatrix, boxMatrix, boxMatrixLoc, boxMatrixTrans, pyrMatrix, pyrMatrixLoc, pyrMatrixTrans, modelViewMatrix, projectionMatrix, modelViewMatrixLoc, projectionMatrixLoc, eye;
var yButton, Peragus = 0.0, frontPerspective, backPerspective, leftPerspective, rightPerspective, topPerspective, bottomPerspective, isoPerspective, clicks = 0, maneuver, pyramidMovement, Malachor = 0.0, Korriban = 0.0, malachorLoc, xDist = 0.1, yDist = 0.1, zDist = 1.0;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
function YakovlevYakThirtyEight(){
	document.getElementById("type1").innerHTML = navigator.oscpu;
	document.getElementById("type2").innerHTML = navigator.appVersion;
	canvas = document.getElementById("Sukhoi Su-24");
	transMatrix = mat4();
	boxMatrix = mat4();
	pyrMatrix = mat4();
	lightPosition1 = vec4(4.0, 4.0, 4.0, 0.0);
	lightPosition2 = vec4(-4.0, 4.0, -4.0, 0.0);
	lightAmbient1 = vec4(0.2, 0.2, 0.2, 1.0 );
	lightDiffuse1 = vec4( 0.0, 1.0, 0.0, 1.0 );
	lightSpecular1 = vec4( 0.0, 1.0, 0.0, 1.0 );
	lightAmbient2 = vec4(0.2, 0.2, 0.2, 1.0 );
	lightDiffuse2 = vec4( 1.0, 0.0, 1.0, 1.0 );
	lightSpecular2 = vec4( 1.0, 0.0, 1.0, 1.0 );
	materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
	materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
	materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
	ambientProduct1 = mult(lightAmbient1, materialAmbient);
    diffuseProduct1 = mult(lightDiffuse1, materialDiffuse);
    specularProduct1 = mult(lightSpecular1, materialSpecular);
	ambientProduct2 = mult(lightAmbient2, materialAmbient);
    diffuseProduct2 = mult(lightDiffuse2, materialDiffuse);
    specularProduct2 = mult(lightSpecular2, materialSpecular);
	gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
    	alert("As far as the program can determine, your browser does not support WebGl.");
    }
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    boxMatrixLoc = gl.getUniformLocation(program, "boxMatrix");
    pyrMatrixLoc = gl.getUniformLocation(program, "pyrMatrix");
    
    createMeACube();
	createMeAPyramid();
	createMeAFloor();
	createMeAnObelisk();
	createMeADiamond();
	createMeAPrism();
	gl.viewport(0, 0, canvas.width, canvas.height);
	aspect = canvas.width / canvas.height;
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	yButton = document.getElementById("orbitY");
	frontPerspective = document.getElementById("frontPerspective");
	backPerspective = document.getElementById("backPerspective");
	leftPerspective = document.getElementById("leftPerspective");
	rightPerspective = document.getElementById("rightPerspective");
	topPerspective = document.getElementById("topPerspective");
	bottomPerspective = document.getElementById("bottomPerspective");
	isoPerspective = document.getElementById("isometricView");
	maneuver = document.getElementById("maneuver");
	pyramidMovement = document.getElementById("pyramidMovement");
	
	yButton.onclick = function(){
		Peragus += 0.1;
		eye = vec3( Math.sin(Peragus)*Math.cos(0.0), 
		Math.sin(Peragus)*Math.sin(0.0),
		Math.cos(Peragus));
    };
    malachorLoc = gl.getUniformLocation(program, "Malachor");
    
    frontPerspective.onclick = function(){
    	eye = vec3(0.0, 0.0, 4.0);
    };
    backPerspective.onclick = function(){
    	eye = vec3(0.0, 0.0, -4.0);
    };
    leftPerspective.onclick = function(){
    	eye = vec3(-4.0, 0.0, 0.0);
    };
    rightPerspective.onclick = function(){
    	eye = vec3(4.0, 0.0, 0.0);
    };
    bottomPerspective.onclick = function(){
    	eye = vec3(0.00001, -4.0, 0.0); /* There was a weird error preventing me from using 0,-1,0.
    	It was telling me that the normalize() function from MV.js was getting a zero-length
    	vector. */
    };
    topPerspective.onclick = function(){
    	eye = vec3(0.00001, 4.0, 0.0);
    };
    isoPerspective.onclick = function(){
    	eye = vec3(-2.0, 2.0, 2.0);
    };

window.onkeydown = function(event) {
		//alert("Final project detected the keycode: " + event.keyCode.toString());
		switch (event.keyCode){
			case 37: // pan left
			eye[0] -= 0.5;
			break;
			case 38: // pan up
			eye[1] += 0.5;
			break;
			case 39: // pan right
			eye[0] += 0.5;
			break;
			case 40: // pan down
			eye[1] -= 0.5;
			break;
			case 90: // zoom in
				//document.getElementById("type1").innerHTML = ++clicks;
				transMatrix = mult(transMatrix, scalem(1.05, 1.05, 1.05));
			break;
			case 88: // zoom out
				transMatrix = mult(transMatrix, scalem(0.95, 0.95, 0.95));
			break;
		}
	};
    
    eye = vec3(0.0, 0.2, 4.0); /* This is the default camera position. I placed it so that every object can be seen initially. */
    
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );
    
    materialShininessLoc = gl.getUniformLocation(program, "shininess");
    lightPosition1Loc = gl.getUniformLocation(program, "uLightPosition1");
    lightPosition2Loc = gl.getUniformLocation(program, "uLightPosition2");
    ambientProduct1Loc = gl.getUniformLocation(program, "uAmbientProduct1");
	diffuseProduct1Loc = gl.getUniformLocation(program, "uDiffuseProduct1");
	specularProduct1Loc = gl.getUniformLocation(program, "uSpecularProduct1");
    ambientProduct2Loc = gl.getUniformLocation(program, "uAmbientProduct2");
	diffuseProduct2Loc = gl.getUniformLocation(program, "uDiffuseProduct2");
	specularProduct2Loc = gl.getUniformLocation(program, "uSpecularProduct2");
    
	gl.uniform1f(materialShininessLoc, materialShininess);
    gl.uniform4fv(lightPosition1Loc, lightPosition1);
    gl.uniform4fv(lightPosition2Loc, lightPosition2);
    gl.uniform4fv(ambientProduct1Loc, ambientProduct1);
    gl.uniform4fv(diffuseProduct1Loc, diffuseProduct1);
    gl.uniform4fv(specularProduct1Loc, specularProduct1);
    gl.uniform4fv(ambientProduct2Loc, ambientProduct2);
    gl.uniform4fv(diffuseProduct2Loc, diffuseProduct2);
    gl.uniform4fv(specularProduct2Loc, specularProduct2);
	
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);
    
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    
    var vBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
 	
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );
    
    var bBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(useTex), gl.STATIC_DRAW);
    
    var useTextures = gl.getAttribLocation( program, "aUseTex");
    gl.vertexAttribPointer(useTextures, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(useTextures);
    
    var movBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, movBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(isMoving), gl.STATIC_DRAW);
    
    var useMovement = gl.getAttribLocation(program, "isMoving");
    gl.vertexAttribPointer(useMovement, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(useMovement);
    
    var image = document.getElementById("Gentlemen, this... is a duck...");
	configureTexture( image );
    
    render();
}
function configureTexture( image ) {
	texture = gl.createTexture();
	gl.bindTexture( gl.TEXTURE_2D, texture );
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, 
		gl.RGB, gl.UNSIGNED_BYTE, image );
	gl.generateMipmap( gl.TEXTURE_2D );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
		gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}
function createMeACube(){
	quad(1, 0, 3, 2, squareVertices, vec2(1.0, 1.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(2, 3, 7, 6, squareVertices, vec2(1.0, 1.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(3, 0, 4, 7, squareVertices, vec2(1.0, 1.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(6, 5, 1, 2, squareVertices, vec2(1.0, 1.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(4, 5, 6, 7, squareVertices, vec2(1.0, 1.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(5, 4, 0, 1, squareVertices, vec2(1.0, 1.0), vec4(0.0, 0.0, 0.0, 0.0));
}
function createMeAPyramid(){
	tri(0,1,2, pyramidVertices, vec2(1.0,0.0), vec4(0.0, 0.0, 0.0, 0.0));// front
	tri(1,4,0, pyramidVertices, vec2(1.0,0.0), vec4(0.0, 0.0, 0.0, 0.0));// left
	tri(4,3,0, pyramidVertices, vec2(1.0,0.0), vec4(0.0, 0.0, 0.0, 0.0));// back
	tri(3,2,0, pyramidVertices, vec2(1.0,0.0), vec4(0.0, 0.0, 0.0, 0.0));// right
	quad(2, 1, 4, 3, pyramidVertices, vec2(1.0, 0.0), vec4(0.0, 36, 47, 1));
}
function createMeAFloor(){
	var t1 = subtract(floorVertices[1], floorVertices[0]);
	var t2 = subtract(floorVertices[2], floorVertices[1]);
	var normal = cross(t1, t2);
	var normal = vec3(normal);
	pointsArray.push(floorVertices[0]);//
	normalsArray.push(normal);
	colorsArray.push([0.0, 0.0, 0.0, 0.0]);
	texCoordsArray.push(texCoord[0]);
	useTex.push(1.0, 1.0);
	isMoving.push(0.0, 0.0);
	
	pointsArray.push(floorVertices[1]);//
	normalsArray.push(normal);
	colorsArray.push([0.0, 0.0, 0.0, 0.0]);
	texCoordsArray.push(texCoord[1]);
	useTex.push(1.0, 1.0);
	isMoving.push(0.0, 0.0);
	
	pointsArray.push(floorVertices[2]);//
	normalsArray.push(normal);
	colorsArray.push([0.0, 0.0, 0.0, 0.0]);
	texCoordsArray.push(texCoord[2]);
	useTex.push(1.0, 1.0);
	isMoving.push(0.0, 0.0);
	
	pointsArray.push(floorVertices[0]);//
	normalsArray.push(normal);
	colorsArray.push([0.0, 0.0, 0.0, 0.0]);
	texCoordsArray.push(texCoord[0]);
	useTex.push(1.0, 1.0);
	isMoving.push(0.0, 0.0);
	
	pointsArray.push(floorVertices[2]);//
	normalsArray.push(normal);
	colorsArray.push([0.0, 0.0, 0.0, 0.0]);
	texCoordsArray.push(texCoord[2]);
	useTex.push(1.0, 1.0);
	isMoving.push(0.0, 0.0);
	
	pointsArray.push(floorVertices[3]);//
	normalsArray.push(normal);
	colorsArray.push([0.0, 0.0, 0.0, 0.0]);
	texCoordsArray.push(texCoord[3]);
	useTex.push(1.0, 1.0);
	isMoving.push(0.0, 0.0);
	
	vertexCount += 6;
}
function quad(a, b, c, d, vertices, moving, colour){// a b c a c d
// a a a a a a
	var t1 = subtract(vertices[b], vertices[a]);
	var t2 = subtract(vertices[c], vertices[b]);
	var normal = cross(t1, t2);
	var normal = vec3(normal);
	pointsArray.push(vertices[a]);
	normalsArray.push(normal);
	colorsArray.push(colour);
	texCoordsArray.push(vec2(0.0, 0.0));
	useTex.push(0.0, 0.0);
	isMoving.push(moving);
	
	pointsArray.push(vertices[b]);
	normalsArray.push(normal); 
	colorsArray.push(colour);
	texCoordsArray.push(vec2(0.0, 0.0));
	useTex.push(0.0, 0.0);
	isMoving.push(moving);
	
	pointsArray.push(vertices[c]);
	normalsArray.push(normal);
	colorsArray.push(colour);
	texCoordsArray.push(vec2(0.0, 0.0));
	useTex.push(0.0, 0.0);
	isMoving.push(moving);
	
	pointsArray.push(vertices[a]);
	normalsArray.push(normal);
	colorsArray.push(colour);
	texCoordsArray.push(vec2(0.0, 0.0));
	useTex.push(0.0, 0.0);
	isMoving.push(moving);
	
	pointsArray.push(vertices[c]);
	normalsArray.push(normal);
	colorsArray.push(colour);
	texCoordsArray.push(vec2(0.0, 0.0));
	useTex.push(0.0, 0.0);
	isMoving.push(moving);
	
	pointsArray.push(vertices[d]);
	normalsArray.push(normal);
	colorsArray.push(colour);
	texCoordsArray.push(vec2(0.0, 0.0));
	useTex.push(0.0, 0.0);
	isMoving.push(moving);
	
	vertexCount += 6;
}
function tri(a, b, c, vertices, moving, colour){ // I assume it only needs 3 calls, as only one triangle is being produced.
// a, b, c
// a, a, a
	var t1 = subtract(vertices[b], vertices[a]);
	var t2 = subtract(vertices[c], vertices[b]);
	var normal = cross(t1, t2);
	var normal = vec3(normal);
	pointsArray.push(vertices[a]);
	normalsArray.push(normal);
	colorsArray.push(colour);
	texCoordsArray.push(vec2(0.0, 0.0));
	useTex.push(0.0, 0.0);
	isMoving.push(moving);
	
	pointsArray.push(vertices[b]);
	normalsArray.push(normal);
	colorsArray.push(colour);
	texCoordsArray.push(vec2(0.0, 0.0));
	useTex.push(0.0, 0.0);
	isMoving.push(moving);
	
	pointsArray.push(vertices[c]);
	normalsArray.push(normal);
	colorsArray.push(colour);
	texCoordsArray.push(vec2(0.0, 0.0));
	useTex.push(0.0, 0.0);
	isMoving.push(moving);
	
	vertexCount += 3;
}
function createMeAnObelisk(){
	// Because of intersecting faces, call of the quad calls to the top and bottom of the middle prism.
	quad(1, 0, 3, 2, obeliskVertices1, vec2(0.0, 0.0), vec4(0,0,0,0));
    quad(2, 3, 7, 6, obeliskVertices1, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(3, 0, 4, 7, obeliskVertices1, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(6, 5, 1, 2, obeliskVertices1, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(4, 5, 6, 7, obeliskVertices1, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(5, 4, 0, 1, obeliskVertices1, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
	
	quad(1, 0, 3, 2, obeliskVertices2, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(2, 3, 7, 6, obeliskVertices2, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(3, 0, 4, 7, obeliskVertices2, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(6, 5, 1, 2, obeliskVertices2, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(4, 5, 6, 7, obeliskVertices2, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(5, 4, 0, 1, obeliskVertices2, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    
    quad(1, 0, 3, 2, obeliskVertices3, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(2, 3, 7, 6, obeliskVertices3, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(3, 0, 4, 7, obeliskVertices3, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(6, 5, 1, 2, obeliskVertices3, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(4, 5, 6, 7, obeliskVertices3, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(5, 4, 0, 1, obeliskVertices3, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
	// vertexCount += 96;
}
function createMeADiamond(){
	tri(2,4,0, diamondVertices, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
	tri(4,3,0, diamondVertices, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
	tri(3,5,0, diamondVertices, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
	tri(5,2,0, diamondVertices, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
	tri(1,4,2, diamondVertices, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
	tri(1,3,4, diamondVertices, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
	tri(1,5,3, diamondVertices, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
	tri(1,2,5, diamondVertices, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
}
function createMeAPrism(){
	gl.uniform1f(materialShininessLoc, 0.0);// 865f50
	quad(1, 0, 3, 2, prismVertices, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(2, 3, 7, 6, prismVertices, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(3, 0, 4, 7, prismVertices, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(6, 5, 1, 2, prismVertices, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(4, 5, 6, 7, prismVertices, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    quad(5, 4, 0, 1, prismVertices, vec2(0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0));
    gl.uniform1f(materialShininessLoc, 100.0);
}
function render(){
	modelViewMatrix = mat4();
	boxMatrix = mat4();
	boxMatrixTrans = mat4();
	boxMatrixTrans = mult(boxMatrixTrans, rotate(Malachor, 0,0,1));
	boxMatrixTrans = mult(boxMatrixTrans, translate(xDist, yDist, zDist));
	pyrMatrix = mat4();
	pyrMatrixTrans = mat4();
	pyrMatrixTrans = mult(pyrMatrixTrans, rotate(Korriban, 0,0,1));
	//boxMatrixTrans = mult(boxMatrixTrans, translate(-1, -1, -1));
	if (Malachor % 180){
		Malachor += 5.0;
		xDist += 0.1;
		yDist += 0.1;
		zDist += 0.1;
	}
	maneuver.onclick = function() {
		clicks++;
		maneuver.innerHTML = (clicks % 2) ? "Complete barrel roll" : "Start barrel roll";
		//boxMatrix = mult(boxMatrix, translate(0.0, 0.0, 0.0));
		Malachor += 5.0;
		xDist *= -1;
		yDist *= -1;
		zDist *= -1;
		//gl.uniformMatrix4fv(boxMatrixLoc, false, flatten(boxMatrix));
		gl.uniform1f(malachorLoc, Malachor);
    };
    pyramidMovement.onclick = function(){
    	Korriban += 5.0;
    }
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	modelViewMatrix = mult(transMatrix, lookAt(eye, at, up));
	boxMatrix = mult(boxMatrix, transMatrix);
	boxMatrix = mult(boxMatrix, lookAt(eye, at, up));
	boxMatrix = mult(boxMatrix, boxMatrixTrans);
	pyrMatrix = mult(pyrMatrix, transMatrix);
	pyrMatrix = mult(pyrMatrix, lookAt(eye, at, up));
	pyrMatrix = mult(pyrMatrix, pyrMatrixTrans);
	projectionMatrix = ortho(-4.0, 4.0, -4.0, 4.0, -20, 20);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(boxMatrixLoc, false, flatten(boxMatrix));
    gl.uniformMatrix4fv(pyrMatrixLoc, false, flatten(pyrMatrix));
	gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    requestAnimFrame(render);
}
