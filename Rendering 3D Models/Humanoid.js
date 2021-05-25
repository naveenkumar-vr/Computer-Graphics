import m4 from './m4.js'
import Mesh from './Mesh.js';
import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';
function degToRad(d) {
	return d * Math.PI / 180;
}
function rotpoint(r,o,a) {
	var x = r[0]-o[0];
	var y = r[1]-o[1];
	var xnew = x * Math.cos(a) - y * Math.sin(a);
	var ynew = x * Math.sin(a) + y * Math.cos(a);
	x = xnew+o[0];
	y = ynew+o[1]; 
    return [x,y];
}
export default class Humanoid
{
	constructor(gl,head,body,limb,t,r,s)
	{
        this.primitives = [];
        this.primitives.push(new Mesh(gl,[1,0.5,0.2],body,[0, 0, 0],[degToRad(0), degToRad(0), degToRad(0)],[1,1,1]));
        this.primitives.push(new Mesh(gl,[1,0.3,0.19],head,[0, 0.5, 0],[degToRad(0), degToRad(0), degToRad(0)],[1,1,1]));
        this.primitives.push(new Mesh(gl,[1,0.3,0.18],limb,[0.25, 0.1, 0],[degToRad(0), degToRad(0), degToRad(0)],[1,1,1]));
        this.primitives.push(new Mesh(gl,[1,0.3,0.17],limb,[-0.25, 0.1, 0],[degToRad(0), degToRad(0), degToRad(0)],[1,1,1]));
        this.primitives.push(new Mesh(gl,[1,0.3,0.16],limb,[0.15, -0.3, 0],[degToRad(0), degToRad(0), degToRad(0)],[1,1,1]));
        this.primitives.push(new Mesh(gl,[1,0.3,0.15],limb,[-0.15, -0.3, 0],[degToRad(0), degToRad(0), degToRad(0)],[1,1,1]));
		this.translation= t;
		this.rotation = r;
		this.scale = s;
        this.colors = [[1,0.5,0.2],[1,0.3,0.19],[1,0.3,0.18],[1,0.3,0.17],[1,0.3,0.16],[1,0.3,0.15]];
        this.oselected = false;
	}

    colorIt(){
        if(this.oselected){
            this.primitives.forEach((primitive,index) => {
                primitive.color = this.colors[index];
            });
            this.oselected = false;
        }
        else{
            this.primitives.forEach((primitive,index) => {
                primitive.color = [0.9,0.9,0.9];
            });
            this.oselected = true;
        }
    }

    faceselect(data){
        this.faceunselect();
        if(data[1] === 128){
            this.primitives[0].color = [0.9,0.9,0.9];
        }
        else if(data[2] === 48){
            this.primitives[1].color = [0.9,0.9,0.9];
        }
        else if(data[2] === 46){
            this.primitives[2].color = [0.9,0.9,0.9];
        }
        else if(data[2] === 43){
            this.primitives[3].color = [0.9,0.9,0.9];
        }
        else if(data[2] === 41){
            this.primitives[4].color = [0.9,0.9,0.9];
        }
        else if(data[2] === 38){
            this.primitives[5].color = [0.9,0.9,0.9];
        }
    }

    faceunselect(){
        this.primitives.forEach((primitive,index) => {
            primitive.color = this.colors[index];
        });
    }

	draw(shader,matrix)
	{
		this.primitives.forEach((primitive) => {
            var rotPoints;
            if(this.rotation[0] > 0 ){
                rotPoints = rotpoint([(primitive.translation[1]*this.scale[1])+this.translation[1], (primitive.translation[2]*this.scale[2])+this.translation[2]],[this.translation[1],this.translation[2]],this.rotation[0]);
                primitive.rotTranslation[1] = rotPoints[0] - primitive.translation[1]*this.scale[1];
                primitive.rotTranslation[2] = rotPoints[1] - primitive.translation[2]*this.scale[2];
            }
            if(this.rotation[1] > 0 ){
                rotPoints = rotpoint([(primitive.translation[0]*this.scale[0])+this.translation[0], (primitive.translation[2]*this.scale[2])+this.translation[2]],[this.translation[0],this.translation[2]],this.rotation[1]);
                primitive.rotTranslation[0] = rotPoints[0] - primitive.translation[0]*this.scale[0];
                primitive.rotTranslation[2] = rotPoints[1] - primitive.translation[2]*this.scale[2];
            }
            if(this.rotation[2] > 0 ){
                rotPoints = rotpoint([(primitive.translation[0]*this.scale[0])+this.translation[0], (primitive.translation[1]*this.scale[1])+this.translation[1]],[this.translation[0],this.translation[1]],this.rotation[1]);
                primitive.rotTranslation[0] = rotPoints[0] - primitive.translation[0]*this.scale[0];
                primitive.rotTranslation[1] = rotPoints[1] - primitive.translation[1]*this.scale[1];
            }
            var cmatrix=matrix;
            cmatrix = m4.translate(cmatrix, (primitive.translation[0]*this.scale[0])+this.translation[0]+primitive.rotTranslation[0],(primitive.translation[1]*this.scale[1])+this.translation[1]+primitive.rotTranslation[1], (primitive.translation[2]*this.scale[2])+this.translation[2]+primitive.rotTranslation[2]);
            cmatrix = m4.xRotate(cmatrix, primitive.rotation[0]);
            cmatrix = m4.yRotate(cmatrix, primitive.rotation[1]);
            cmatrix = m4.zRotate(cmatrix, primitive.rotation[2]);
            cmatrix = m4.scale(cmatrix, primitive.scale[0]*this.scale[0], primitive.scale[1]*this.scale[1],primitive.scale[2]*this.scale[2]);
            primitive.draw(shader,cmatrix);
        });
	}
	
}