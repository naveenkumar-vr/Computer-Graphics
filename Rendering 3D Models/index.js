import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';
import Shader from './shader.js';
import vertexShaderSrc from './vertex.js';
import fragmentShaderSrc from './fragment.js';
import Renderer from './renderer.js';
import Mesh from './Mesh.js';
import getObjData from './parse.js'
import m4 from './m4.js'

const primitives = [];
const renderer = new Renderer();
const gl = renderer.webGlContext();
const shader = new Shader(gl, vertexShaderSrc, fragmentShaderSrc);
shader.use();
var id = -1;
var pick = false;
var pmode = 'o';
var prevColorObj = [];
var prevIdObj = -1;
var camx = 0;
var camy = 0;
var camz = 0;
var camMode = false;
var camAxis = 'y';
var alien;
var shuriken;
var eclipse;
var axis;
(async () => {
    try {
		alien = await getObjData('alien.obj');
		shuriken = await getObjData('shuriken.obj');
		eclipse = await getObjData('eclipse.obj');
		axis = await getObjData('axis.obj');
    } catch (e) {
        // Deal with the fact the chain failed
		console.log(e);
    }
})();

function degToRad(d) {
	return d * Math.PI / 180;
}

window.addEventListener("keydown", function (event)
	{
		if(event.key === "a"){
			document.getElementById("key").textContent=event.key ;
			primitives.push(new Mesh(gl,vec3.fromValues(1,0,0),axis,[0, 0, 0],[degToRad(0), degToRad(90), degToRad(0)],[0.1,0.1,2.2]));
			primitives.push(new Mesh(gl,vec3.fromValues(0,1,0),axis,[0, -1.3, 0],[degToRad(90), degToRad(0), degToRad(0)],[0.1,0.1,4]));
			primitives.push(new Mesh(gl,vec3.fromValues(0,0,1),axis,[0, 0, 0],[degToRad(0), degToRad(0), degToRad(0)],[0.1,0.1,2.2]));
		}
		if(event.key === "c"){
			document.getElementById("key").textContent=event.key ;
			primitives.push(new Mesh(gl,vec3.fromValues(1,0,1),shuriken,[0, 0, 0],[degToRad(0), degToRad(0), degToRad(0)],[2,2,2]));
			primitives.push(new Mesh(gl,vec3.fromValues(1,1,0),alien,[0, 0, 0],[degToRad(0), degToRad(0), degToRad(0)],[2,2,2]));	
			primitives.push(new Mesh(gl,vec3.fromValues(0,1,1),eclipse,[0, 0, 0],[degToRad(0), degToRad(0), degToRad(0)],[2,2,2]));	
		}
		if(event.key != 'o'){
			if(prevColorObj.length>0){
				primitives[prevIdObj].color = prevColorObj;
				prevColorObj = [];
			}
		}
		if(event.key != 'p'){
			if(prevColorObj.length>0){
				primitives[prevIdObj].color = prevColorObj;
				prevColorObj = [];
			}
		}
		if(prevColorObj.length>0){
			primitives[prevIdObj].color = prevColorObj;
			prevColorObj = [];
			camMode=false;
			pick = false;
		}
		if(event.key === "d"){
			document.getElementById("key").textContent=event.key ;
			primitives[3].translation = [0.5,-0.5,0];
			primitives[4].translation = [-0.5,-0.5,0];
			primitives[5].translation = [0,0.5,-0.5];
			camMode=false;
			pick = false;
		}
		if(event.key === "e"){
			document.getElementById("key").textContent=event.key;
			primitives[3].translation = [0.0,-0.5,0];
			primitives[4].translation = [-0.25,0,0];
			primitives[5].translation = [0,0,-0.5];
			camMode=false;
			pick = false;
		}
		if(event.key === "f"){
			document.getElementById("key").textContent=event.key ;
			primitives[3].rotation = [primitives[3].rotation[0],primitives[3].rotation[1],primitives[3].rotation[2]+degToRad(90)];
			primitives[4].rotation = [primitives[4].rotation[0]+degToRad(90),primitives[4].rotation[1],primitives[4].rotation[2]];
			primitives[5].rotation = [primitives[5].rotation[0],primitives[5].rotation[1]+degToRad(90),primitives[5].rotation[2]];
			camMode=false;
			pick = false;
		}
		if(event.key === "g"){
			document.getElementById("key").textContent=event.key ;
			primitives[3].scale = [primitives[3].scale[0]*2,primitives[3].scale[1]*2,primitives[3].scale[2]*2];
			primitives[4].scale = [primitives[4].scale[0]*3,primitives[4].scale[1]*3,primitives[4].scale[2]*3];
			primitives[5].scale = [primitives[5].scale[0]*0.5,primitives[4].scale[1]*0.5,primitives[4].scale[2]*0.5];
			camMode=false;
			pick = false;
		}
		if(event.key === "r"){
			document.getElementById("key").textContent=event.key ;
			primitives[3].scale = [2,2,2];
			primitives[4].scale = [2,2,2];
			primitives[5].scale = [2,2,2];
			camMode=false;
			pick = false;
		}
		if(event.key === "h"){
			document.getElementById("key").textContent=event.key ;
			pick = true;
			camMode=false;
		}
		if(pick){
			if(event.key === "o"){
				document.getElementById("key").textContent=event.key ;
				pmode = 'o';
			}
			if(event.key === "p"){
				document.getElementById("key").textContent=event.key ;
				pmode = 'f';
			}
		}
		if(event.key === "i"){
			document.getElementById("key").textContent=event.key ;
			camMode = true;
			pick = false;
		}
		if(camMode){
			if(event.key === "x"){
				document.getElementById("key").textContent=event.key ;
				camAxis = 'x';
			}
			if(event.key === "y"){
				document.getElementById("key").textContent=event.key ;
				camAxis = 'y';
			}
			if(event.key === "z"){
				document.getElementById("key").textContent=event.key ;
				camAxis = 'z';
			}
		}
	});
renderer.getCanvas().addEventListener('click', (event) =>
{	
	let mouseX = event.clientX;
	let mouseY = event.clientY;
	const pixelX = mouseX * gl.canvas.width / gl.canvas.clientWidth;
    const pixelY = gl.canvas.height - mouseY * gl.canvas.height / gl.canvas.clientHeight - 1;
    const data = new Uint8Array(4);
    gl.readPixels(
        pixelX,            // x
        pixelY,            // y
        1,                 // width
        1,                 // height
        gl.RGBA,           // format
        gl.UNSIGNED_BYTE,  // type
        data);             // typed array to hold result
	console.log(data);
	if(pick && pmode === 'o'){
		if(data[0] === 255 && data[1] === 255 && data[2] === 0){
			id = 4;
		}
		else if(data[0] === 255 && data[1] === 0 && data[2] === 255){
			id = 3;
		}
		else if(data[0] === 255 && data[1] <255 && data[1]>0){
			id = 5;
		}
		else{
			id = -1;
		}
		if(id>0){
			if(id === 5){
				if(prevIdObj != 5){
					if(prevColorObj.length>0){
						primitives[prevIdObj].color = prevColorObj;
						prevColorObj = [];
					}
				};
			}
			else if(prevIdObj === 5){
				prevColorObj = primitives[id].color;
				primitives[id].color = [0.9,0.9,0.9];
			}
			else{
				if(prevColorObj.length>0){
					primitives[prevIdObj].color = prevColorObj;
					prevColorObj = [];
				}
				prevColorObj = primitives[id].color;
				primitives[id].color = [0.9,0.9,0.9];
			}
		}else{
			if(prevColorObj.length>0){
				primitives[prevIdObj].color = prevColorObj;
				prevColorObj = [];
			}
		}
		prevIdObj = id;
	}
	if(pick && pmode === 'f'){
		if(data[0] === 255 && data[1] === 255 && data[2] === 0){
			id = 4;
		}
		else if(data[0] === 255 && data[1] === 0 && data[2] === 255){
			id = 3;
		}
		else if(data[0] === 255 && data[1] <255 && data[1]>0){
			id = 5;
		}
		else{
			id = -1;
		}
		if(id>0){
			if(id === 5){
				if(prevIdObj != 5){
					if(prevColorObj.length>0){
						primitives[prevIdObj].color = prevColorObj;
						prevColorObj = [];
					}
				};
			}
			else if(prevIdObj === 5){
				prevColorObj = primitives[id].color;
				primitives[id].color = [0.9,0.9,0.9];
			}
			else{
				if(prevColorObj.length>0){
					primitives[prevIdObj].color = prevColorObj;
					prevColorObj = [];
				}
				prevColorObj = primitives[id].color;
				primitives[id].color = [0.9,0.9,0.9];
			}
		}else{
			if(prevColorObj.length>0){
				primitives[prevIdObj].color = prevColorObj;
				prevColorObj = [];
			}
		}
		prevIdObj = id;
	}
});


var mouseX;
renderer.getCanvas().addEventListener('mousedown', (event) =>
{	
	if(camMode){
		mouseX = event.clientX;
	}
});
renderer.getCanvas().addEventListener('mouseup', (event) =>
{	
	if(camMode){
		mouseX -= event.clientX;
		if(mouseX>0)
		{
			if(camAxis === 'x') camx+=15;
			if(camAxis === 'y') camy+=15;
			if(camAxis === 'z') camz+=15;
		}
		else if (mouseX<0)
		{
			if(camAxis === 'x') camx-=15;
			if(camAxis === 'y') camy-=15;
			if(camAxis === 'z') camz-=15;
		}
		console.log([camx,camy,camz]);
	}

});



//Draw loop
function animate()
{
	var fieldOfViewRadians = degToRad(120);
	var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	var zNear = 0;
	var zFar = 3;
	var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
	var radius = 1.5;
	
	// Compute the position of the first F
	var fPosition = [0, 0, 0];
 
	// Use matrix math to compute a position on a circle where
	// the camera is
	var cameraMatrix = m4.identity();
	cameraMatrix = m4.xRotate(cameraMatrix, degToRad(camx));
    cameraMatrix = m4.yRotate(cameraMatrix, degToRad(camy));
    cameraMatrix = m4.zRotate(cameraMatrix, degToRad(camz));
	
	cameraMatrix = m4.translate(cameraMatrix, radius*0.75, radius*0.75, radius*0.75);
	var up = [0,1,0];
	// Get the camera's position from the matrix we computed
	var cameraPosition = [
	  cameraMatrix[12],
	  cameraMatrix[13],
	  cameraMatrix[14],
	];
   
	// Compute the camera's matrix using look at.
	var lcameraMatrix = m4.lookAt(cameraPosition, fPosition, up);
	var viewMatrix = m4.inverse(lcameraMatrix);
	var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
	renderer.clear();
	primitives.forEach((primitive )=> {
    var matrix = viewProjectionMatrix 
    matrix = m4.translate(matrix, primitive.translation[0],primitive.translation[1], primitive.translation[2]);
    matrix = m4.xRotate(matrix, primitive.rotation[0]);
    matrix = m4.yRotate(matrix, primitive.rotation[1]);
    matrix = m4.zRotate(matrix, primitive.rotation[2]);
    matrix = m4.scale(matrix, primitive.scale[0], primitive.scale[1],primitive.scale[2]);
	primitive.draw(shader,matrix);
	});
	window.requestAnimationFrame(animate);
}
animate();
shader.delete();