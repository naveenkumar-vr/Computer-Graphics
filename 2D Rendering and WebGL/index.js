import Shader from './shader.js';
import vertexShaderSrc from './vertex.js';
import fragmentShaderSrc from './fragment.js';
import Renderer from './renderer.js';
import Mesh from './mesh.js'
import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';
import Cirlce from './circle.js';

const renderer = new Renderer();
const gl = renderer.webGlContext();

const shader = new Shader(gl, vertexShaderSrc, fragmentShaderSrc);
shader.use();
const primitives = [];
var systemMode = 0;
let shapeMode = 'r';
var selectedPrimitive = -1;
var bboxcentroid;

function getDistance(prim,clips){
	var lgth = 0.1;
	var bdth = 0.1;
	if (prim.shape === 'c'){
		var pos = prim.getTranslate();
		return ((clips[0]-pos[0])**2 + (clips[1]-pos[1])**2)**0.5 - 0.1*prim.getScale()[0];
	}
	else{
		if(prim.shape == 'r') bdth = 0.2;
		var pos = prim.getTranslate();
		var scale = prim.getScale()[0]
		var x_min = pos[0] - scale*bdth;
		var x_max = pos[0] + scale*bdth;
		var y_min = pos[1] - scale*lgth;
		var y_max = pos[1] + scale*lgth;
		if (clips[0] < x_min) {
			if (clips[1] <  y_min) 
				return Math.sqrt((Math.pow((x_min-clips[0])) + Math.pow((y_min-clips[1]), 2)));
			if (clips[1] <= y_max) 
				return x_min - clips[0];
			else
				return Math.sqrt(Math.pow((x_min-clips[0]), 2) + Math.pow((y_max-clips[1]), 2));
		} 
		else if (clips[0] <= x_max) {
			if (clips[1] <  y_min) 
				return y_min - clips[1];
			if (clips[1] <= y_max) 
				return 0;
			else
				return clips[1] - y_max;
		} 
		else {
			if (clips[1] <  y_min) 
				return Math.sqrt(Math.pow((x_max-clips[0]), 2) + Math.pow((y_min-clips[1]), 2));
			if (clips[1] <= y_max) 
				return clips[0] - x_max;
			else
				return Math.sqrt(Math.pow((x_max-clips[0]), 2) + Math.pow((y_max-clips[1]), 2));
		}
	}
}

function findClosestPrimitive(clipCoordinates){
	var minId = 0;
	var min = 10000;
	for (let i = 0; i < primitives.length; i++) {
		var dist = getDistance(primitives[i], clipCoordinates);
		if(dist<min){
			min = dist;
			minId = i;
		}
	}
	return minId;
}

function translatePrim(prim, transX, transY) {
	let translation = vec3.create();
	var coordinate = prim.getTranslate();
	vec3.set(translation, coordinate[0]+transX, coordinate[1]+transY, 0);
	prim.setTranslate(translation);
	prim.transform.setTranslate(translation);
}

function scalePrim(prim, scaleZ) {
	let scale = vec3.create();
	var exScale = prim.getScale();
	vec3.set(scale, exScale[0]+scaleZ, exScale[1]+scaleZ, 0);
	prim.setScale(scale);
	prim.transform.setScale(scale);
}

function bbox_Centroid(){
	let x_min=1,x_max=-1,y_min=1,y_max=-1;
	let lgth=0.1;
	let bdth=0.1;
	for (let i = 0; i < primitives.length; i++) {
		if(primitives[i].shape == 'r') {
			bdth = 0.2;
		}
		var pos = primitives[i].getTranslate();
		var scale = primitives[i].getScale()[0];
		var xmin = pos[0] - scale*bdth;
		var ymin = pos[1] - scale*lgth;
		var xmax = pos[0] + scale*bdth;
		var ymax = pos[1] + scale*lgth;
		if(xmin<x_min){
			x_min = xmin;
		}
		if(ymin<y_min){
			y_min = ymin;
		}
		if(xmax>x_max){
			x_max = xmax;
		}
		if(ymax>y_max){
			y_max = ymax;
		}
	}
	var bbCentroid = [(x_max+x_min)/2,(y_min+y_max)/2]
	return bbCentroid;
}

function rotateTrans(prim, rotateAngle, bbxc) {
	let rot = prim.getRotate() + rotateAngle;
	prim.setRotate(rot);
	prim.transform.setRotate(rot);
	let post = prim.getTranslate();
	let x = post[0]-bbxc[0];
	let y = post[1]-bbxc[1];
	let x_temp = x * Math.cos(rot) - y * Math.sin(rot);
	let y_temp = x * Math.sin(rot) + y * Math.cos(rot);
	x = x_temp + bbxc[0];
	y = y_temp + bbxc[1]; 
	let translation = vec3.create();
	vec3.set(translation, x, y, 0);
	prim.transform.setTranslate(translation);
}

// Convert mouse click to coordinate system as understood by webGL
window.onload = () =>
{
	renderer.getCanvas().addEventListener('click', (event) =>
	{
		let mouseX = event.clientX;
		let mouseY = event.clientY;
		let translation = vec3.create();
		const clipCoordinates = renderer.mouseToClipCoord(mouseX,mouseY);
		if(systemMode == 0) {
			if(shapeMode == "r") {
				vec3.set(translation, clipCoordinates[0], clipCoordinates[1], 0);
				primitives.push(new Mesh(gl, false, translation, shapeMode));
			}
			else if(shapeMode == "s") {
				vec3.set(translation, clipCoordinates[0], clipCoordinates[1], 0);
				primitives.push(new Mesh(gl, true, translation, shapeMode));
			}
			else if(shapeMode == "c") {
				vec3.set(translation, clipCoordinates[0], clipCoordinates[1], 0);
				primitives.push(new Cirlce(gl, translation, shapeMode));
			}
		}
		else if(systemMode == 1) {
			selectedPrimitive = findClosestPrimitive(clipCoordinates);
			console.log(clipCoordinates);
			console.log(selectedPrimitive);
		}
		});
	window.addEventListener("keydown", function(event)
	{
		if(event.key == 'Escape') {
			// window.location.replace("file:///Users/naveenkumar/Documents/acad/sem6/CG/assignment1/play2/index.html");
			window.close();
		}
		if(event.key == 'm') {
			systemMode=(systemMode+1)%3;
			console.log(systemMode);
		}
		if(systemMode == 0) {
			for(var i=0; i<primitives.length; i++) {
				primitives[i].setRotate(0);
				primitives[i].transform.setRotate(0);
				var pos = primitives[i].getTranslate();
				let translation = vec3.create();
				vec3.set(translation, pos[0], pos[1], 0);
				primitives[i].transform.setTranslate(translation);
			}
			if (event.key === 's') {
				shapeMode = 's';
			}
			else if(event.key === 'r'){
				shapeMode = 'r';
			}else if(event.key === 'c'){
				shapeMode = 'c';	
			}
		}
		if(systemMode == 1) {
			if(event.key == 'ArrowUp') {
				translatePrim(primitives[selectedPrimitive], 0, 0.04); 
			}
			else if(event.key == 'ArrowDown') {
				translatePrim(primitives[selectedPrimitive], 0, -0.04); 
			}
			else if(event.key == 'ArrowLeft') {
				translatePrim(primitives[selectedPrimitive], -0.04, 0); 
			}
			else if(event.key == 'ArrowRight') {
				translatePrim(primitives[selectedPrimitive], 0.04, 0); 
			}
			else if(event.key === '+') {
				scalePrim(primitives[selectedPrimitive], 0.04);
			}
			else if(event.key === '-') {
				scalePrim(primitives[selectedPrimitive], -0.04);
			}
			else if(event.key == 'x') {
				primitives.splice(selectedPrimitive, 1);
			}
		}
		if(systemMode === 2){
			bboxcentroid = bbox_Centroid();
			if(event.key === 'ArrowLeft'){
				for(var i=0;i<primitives.length;i++){
					rotateTrans(primitives[i], 0.04, bboxcentroid);   
				}
			}
			else if(event.key === 'ArrowRight'){
				for(var i=0;i<primitives.length;i++){
					rotateTrans(primitives[i], -0.04, bboxcentroid);
				}
			}
		}
	},
		true
	);
};
console.log(shapeMode);
//Draw loop
function animate()
{
	renderer.clear();
	primitives.forEach((primitive) => {
		primitive.transform.updateMVPMatrix();
		primitive.draw(shader);
	});
	window.requestAnimationFrame(animate);
}

animate();
shader.delete();