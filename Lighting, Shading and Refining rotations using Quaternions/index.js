import { vec3, mat4, quat } from 'https://cdn.skypack.dev/gl-matrix';
import Shader from './shader.js';
import vertexShaderSrc from './vertex.js';
import fragmentShaderSrc from './fragment.js';
import pvertexShaderSrc from './pvertex.js';
import pfragmentShaderSrc from './pfragment.js';
import Renderer from './renderer.js';
import Mesh from './Mesh.js';
import getObjData from './parse.js'
import m4 from './m4.js'

const primitives = [];
const renderer = new Renderer();
const gl = renderer.webGlContext();
gl.enable(gl.DEPTH_TEST);
const gshader = new Shader(gl, vertexShaderSrc, fragmentShaderSrc);
const pshader = new Shader(gl, pvertexShaderSrc, pfragmentShaderSrc);
let shader = gshader;
shader.use();
var monkey;
var tors;
var humanoid;
var light;
var cube;
var mode = 'n';
var shade = 'g'
var id=-1;

(async () => {
    try {
		humanoid = await getObjData('humanoid.obj');
		monkey = await getObjData('Monkey.obj');
		tors = await getObjData('Tors.obj');
		cube = await getObjData('cube.obj');
		light = await getObjData('light.obj');
		// console.log(head)
		primitives.push(new Mesh(gl,vec3.fromValues(1,1,1),light,[0, 0, 0],m4.identity(),[0.02,0.02,0.02]));
		primitives.push(new Mesh(gl,vec3.fromValues(1,1,1),light,[0, 0, 0],m4.identity(),[0.02,0.02,0.02]));
		primitives.push(new Mesh(gl,vec3.fromValues(1,1,1),light,[0, 0, 0],m4.identity(),[0.02,0.02,0.02]));
		primitives.push(new Mesh(gl,vec3.fromValues(1,1,1),light,[0, 0, 0],m4.identity(),[0.02,0.02,0.02]));
		primitives.push(new Mesh(gl,vec3.fromValues(1,1,1),light,[0.0,0.5,0],m4.identity(),[0.1,0.1,0.1]));
		primitives.push(new Mesh(gl,vec3.fromValues(1,1,1),monkey,[-0.5,0,0],m4.identity(),[1.5,1.5,1.5]));
		primitives.push(new Mesh(gl,vec3.fromValues(1,1,1),cube,[0.5,0,0],m4.identity(),[0.8,0.8,0.8]));	
		primitives.push(new Mesh(gl,vec3.fromValues(1,1,1),humanoid,[0,-0.50,0],m4.identity(),[0.25,0.25,0.25]));	
		
		primitives[0].translation[1] = primitives[0+4].translation[1]+(primitives[0+4].bb*1.25)
		primitives[1].translation[0] = primitives[1+4].translation[0]-(primitives[1+4].bb*1.25)
		primitives[2].translation[0] = primitives[2+4].translation[0]+(primitives[2+4].bb*1.25)
		primitives[3].translation[1] = primitives[3+4].translation[1]-(primitives[3+4].bb*1.25)
		
    } catch (e) {
        // Deal with the fact the chain failed
		console.log(e);
    }
})();

function degToRad(d) {
	return d * Math.PI / 180;
}

function checkbb(x,y,z){
	// console.log(x,y,z)
	// console.log(primitives[id].translation[0],primitives[id].translation[1],primitives[id].translation[2])
	// console.log(primitives[id].bb)
	console.log((x>=primitives[id].translation[0]+primitives[id].bb || x<=(primitives[id].translation[0]-primitives[id].bb) ||
	y>=primitives[id].translation[1]+primitives[id].bb || y<=(primitives[id].translation[1]-primitives[id].bb) ||
	z>=primitives[id].translation[2]+primitives[id].bb || z<=(primitives[id].translation[2]-primitives[id].bb)))
	if((x>=primitives[id].translation[0]+primitives[id].bb || x<=(primitives[id].translation[0]-primitives[id].bb) ||
	y>=primitives[id].translation[1]+primitives[id].bb || y<=(primitives[id].translation[1]-primitives[id].bb) ||
	z>=primitives[id].translation[2]+primitives[id].bb || z<=(primitives[id].translation[2]-primitives[id].bb)) &&
	!(x>primitives[id].translation[0]+(primitives[id].bb*1.25) || x<(primitives[id].translation[0]+(-1.25*primitives[id].bb)) ||
	y>primitives[id].translation[1]+(primitives[id].bb*1.25) || y<(primitives[id].translation[1]+(-1.25*primitives[id].bb)) ||
	z>primitives[id].translation[2]+(primitives[id].bb*1.25) || z<(primitives[id].translation[2]+(-1.25*primitives[id].bb)))
	) return true;
	else
	false;
}

window.addEventListener("keydown", function (event)
{
	if(event.key === "m"){
		document.getElementById("key").textContent=event.key ;
		mode = 'm';
		document.getElementById("mode").textContent="mesh-transformation mode" ;
	}
	if(event.key === "l"){
		document.getElementById("key").textContent=event.key ;
		mode = 'l';
		shade = 'b';
		document.getElementById("mode").textContent="​ illuminator mode" ;
		document.getElementById("shade").textContent="Blinn phong";
	}
	if(event.key === "s"){
		document.getElementById("key").textContent=event.key ;
		if(mode != 'l'){
			if(shade == 'g')  {
				shade = 'p';
				document.getElementById("shade").textContent="phong shading" ;
			}
			else{
				shade = 'g';
				document.getElementById("shade").textContent="gourad shading";
			}
		}
	}
	if(event.key === "0"){
		document.getElementById("key").textContent=event.key ;
		if(mode == 'l' ){
			primitives[id-4].on = false;
		}
	}
	if(event.key === "1"){
		document.getElementById("key").textContent=event.key ;
		if(mode == 'l' ){
			primitives[id-4].on = true;
		}
	}
	if(event.key === "4"){
		document.getElementById("key").textContent=event.key ;
		if(mode == 'm' || mode == 'l'){
			id = 4;
			document.getElementById("mesh").textContent="​ 4" ;
		}
	}
	if(event.key === "5"){
		document.getElementById("key").textContent=event.key ;
		if(mode == 'm' || mode == 'l'){
			id = 5;
			document.getElementById("mesh").textContent="​ 5" ;
		}
	}
	if(event.key === "6"){
		document.getElementById("key").textContent=event.key ;
		if(mode == 'm' || mode == 'l'){
			id = 6;
			document.getElementById("mesh").textContent="​ 6" ;
		}
	}
	if(event.key === "7"){
		document.getElementById("key").textContent=event.key ;
		if(mode == 'm' || mode == 'l'){
			id = 7;
			document.getElementById("mesh").textContent="​ 7" ;
		}
	}
	if (event.key == 'ArrowUp') {
		if(mode == 'm'){
			primitives[id].translation = [primitives[id].translation[0],primitives[id].translation[1]+0.05,primitives[id].translation[2]];
		}
		if(mode == 'm' || mode == 'l'){
			if(checkbb(primitives[id-4].translation[0],primitives[id-4].translation[1]+0.05,primitives[id-4].translation[2]))
			primitives[id-4].translation = [primitives[id-4].translation[0],primitives[id-4].translation[1]+0.05,primitives[id-4].translation[2]];
		}
		document.getElementById("key").textContent=event.key ;
	}
	if (event.key == 'ArrowDown') {
		if(mode == 'm'){
			primitives[id].translation = [primitives[id].translation[0],primitives[id].translation[1]-0.05,primitives[id].translation[2]];
		}
		if(mode == 'm' || mode == 'l'){
			if(checkbb(primitives[id-4].translation[0],primitives[id-4].translation[1]-0.05,primitives[id-4].translation[2]))
			primitives[id-4].translation = [primitives[id-4].translation[0],primitives[id-4].translation[1]-0.05,primitives[id-4].translation[2]];
		}
		document.getElementById("key").textContent=event.key ;
	}
	if (event.key == 'ArrowRight') {
		if(mode == 'm'){
			primitives[id].translation = [primitives[id].translation[0]+0.05,primitives[id].translation[1],primitives[id].translation[2]];
		}
		if(mode == 'm' || mode == 'l'){
			if(checkbb(primitives[id-4].translation[0]+0.05,primitives[id-4].translation[1],primitives[id-4].translation[2]))
			primitives[id-4].translation = [primitives[id-4].translation[0]+0.05,primitives[id-4].translation[1],primitives[id-4].translation[2]];
		}
		document.getElementById("key").textContent=event.key ;
	}
	if (event.key == 'ArrowLeft') {
		if(mode == 'm'){
			primitives[id].translation = [primitives[id].translation[0]-0.05,primitives[id].translation[1],primitives[id].translation[2]];
		}
		if(mode == 'm' || mode == 'l'){
			if(checkbb(primitives[id-4].translation[0]-0.05,primitives[id-4].translation[1],primitives[id-4].translation[2]))
			primitives[id-4].translation = [primitives[id-4].translation[0]-0.05,primitives[id-4].translation[1],primitives[id-4].translation[2]];
		}
		document.getElementById("key").textContent=event.key ;
	}
	if (event.key == 'o') {
		if(mode == 'm'){
			primitives[id].translation = [primitives[id].translation[0],primitives[id].translation[1],primitives[id].translation[2]+0.05];
		}
		if(mode == 'm' || mode == 'l'){
			if(checkbb(primitives[id-4].translation[0],primitives[id-4].translation[1],primitives[id-4].translation[2]+0.05))
			primitives[id-4].translation = [primitives[id-4].translation[0],primitives[id-4].translation[1],primitives[id-4].translation[2]+0.05];
		}
		document.getElementById("key").textContent=event.key ;
	}
	if (event.key == 'i') {
		if(mode == 'm'){
			primitives[id].translation = [primitives[id].translation[0],primitives[id].translation[1],primitives[id].translation[2]-0.05];
		}
		if(mode == 'm' || mode == 'l'){
			if(checkbb(primitives[id-4].translation[0],primitives[id-4].translation[1],primitives[id-4].translation[2]-0.05))
			primitives[id-4].translation = [primitives[id-4].translation[0],primitives[id-4].translation[1],primitives[id-4].translation[2]-0.05];
		}
		document.getElementById("key").textContent=event.key ;
	}
	if (event.key == '+') {
		if(mode == 'm'){
			primitives[id].bb = primitives[id].bb*1.05;
			if(checkbb(primitives[id-4].translation[0],primitives[id-4].translation[1],primitives[id-4].translation[2]))
			primitives[id].scale = [primitives[id].scale[0]*1.05,primitives[id].scale[1]*1.05,primitives[id].scale[2]*1.05];
			else primitives[id].bb = primitives[id].bb/1.05;
		}
		document.getElementById("key").textContent=event.key ;
	}
	if (event.key == '-') {
		if(mode == 'm'){
			primitives[id].bb = primitives[id].bb/1.05;
			if(checkbb(primitives[id-4].translation[0],primitives[id-4].translation[1],primitives[id-4].translation[2]))
			primitives[id].scale = [primitives[id].scale[0]/1.05,primitives[id].scale[1]/1.05,primitives[id].scale[2]/1.05];
			else primitives[id].bb = primitives[id].bb*1.05;
		}
		document.getElementById("key").textContent=event.key ;
	}
});


//Draw loop
function animate()
{
	const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI/2 , 1 , 1, 1000);
	const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, vec3.fromValues(0, 0, 1.5), vec3.fromValues(0.0,0.0,0.0), vec3.fromValues(0.0, 1.0, 0.0));
	var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
	renderer.clear();
	primitives.forEach((primitive,index )=> {
    	var matrix = m4.identity() 
		var matrix2 = m4.identity() 
		matrix = m4.translate(matrix, primitive.translation[0],primitive.translation[1], primitive.translation[2]);
		if(index == id){
			Trackball.RotationWithQuaternion.onRotationChanged = function (updatedRotationMatrix) 
				{
					let Rot = mat4.create();
					mat4.copy(Rot, updatedRotationMatrix);
					primitive.rotation = Rot;
				}
		}
		matrix = m4.multiply(matrix, primitive.rotation);
    	matrix = m4.scale(matrix, primitive.scale[0], primitive.scale[1],primitive.scale[2]);
		var matrix2 = m4.inverse(matrix)
		matrix2 = m4.transpose(matrix2)
		if(shade == 'g' ){
			shader = gshader;
			shader.use();
			primitive.draw(shader,matrix,viewProjectionMatrix,primitives);
		}
		else if(shade == 'p' && index === id){
			shader = pshader;
			shader.use();
			primitive.draw(shader,matrix,viewProjectionMatrix,primitives);
		}
		else{
			shader = pshader;
			shader.use();
			var blinn = shader.uniform("blinn");
			gl.uniform1f(blinn,true);
			primitive.draw(shader,matrix,viewProjectionMatrix,primitives);
		}
		
	});
	window.requestAnimationFrame(animate);
}
animate();
// shader.delete();