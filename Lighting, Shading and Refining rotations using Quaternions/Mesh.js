import m4 from './m4.js'
import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';
export default class Mesh
{
	constructor(gl, color,data,t,r,s)
	{
		// for (var i =0;i<data.vertices.length;i++){
		// 	data.vertices[i]=data.vertices[i]/2;
		// }
		this.vertexAttributesData = new Float32Array(data.vertices);
		this.vertexNormalsData = new Float32Array(data.vertexNormals);
		this.indices = data.indices;
		this.gl = gl;
		this.color = color;
		this.vertexAttributesBuffer = this.gl.createBuffer();
		this.normalbuffer = this.gl.createBuffer();
		if (!this.vertexAttributesBuffer)
		{
			throw new Error("Buffer for vertex attributes could not be allocated");
		}
		this.translation= t;
		this.rotation = r;
		this.scale = s;
		this.rotTranslation = [0,0,0];
		this.on = true;
		this.bb = Math.max(...this.vertexAttributesData) * s[0] * 2
		// console.log(this.bb)
	}

	draw(shader,matrix,vp,primitives)
	{
		const uModelTransformMatrix = shader.uniform("uModelTransformMatrix");
		const viewprojection = shader.uniform("viewprojection");
		const transInvMat = shader.uniform("transInvMat");
		let elementPerVertex = 3;

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexAttributesBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexAttributesData, this.gl.DYNAMIC_DRAW);

		const aPosition = shader.attribute("aPosition");
		this.gl.enableVertexAttribArray(aPosition);
		this.gl.vertexAttribPointer(aPosition, elementPerVertex, this.gl.FLOAT, false, 3 * this.vertexAttributesData.BYTES_PER_ELEMENT, 0);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalbuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexNormalsData, this.gl.DYNAMIC_DRAW);

		const aNormal = shader.attribute("aNormal");
		this.gl.enableVertexAttribArray(aNormal);
		this.gl.vertexAttribPointer(aNormal, elementPerVertex, this.gl.FLOAT, false, 3 * this.vertexNormalsData.BYTES_PER_ELEMENT, 0);

		const uPrimitiveColor = shader.uniform("uPrimitiveColor");		
		shader.setUniform3f(uPrimitiveColor, this.color);
		const viewPos = shader.uniform("viewPos");
		shader.setUniform3f(viewPos, vec3.fromValues(0,0,1.5));
		shader.setUniformMatrix4fv(uModelTransformMatrix, matrix);
		shader.setUniformMatrix4fv(transInvMat,m4.transpose(m4.inverse(matrix)));
		shader.setUniformMatrix4fv(viewprojection, vp);
		const material_ambient = shader.uniform("material.ambient");
		this.gl.uniform1f(material_ambient, 0.4);
		const material_diffuse = shader.uniform("material.diffuse");
		this.gl.uniform1f(material_diffuse, 0.7);
		const material_specular = shader.uniform("material.specular");
		this.gl.uniform1f(material_specular, 1);
		const material_shininess = shader.uniform("material.shininess");
		this.gl.uniform1f(material_shininess, 32.0);
		// point light 1
		const pointLights0position = shader.uniform("pointLights[0].position");
		this.gl.uniform3f(pointLights0position, primitives[0].translation[0], primitives[0].translation[1], primitives[0].translation[2]);
		const pointLights0ambient = shader.uniform("pointLights[0].ambient");
		this.gl.uniform3f(pointLights0ambient, 0.1, 0.1, 0.1);
		const pointLights0diffuse = shader.uniform("pointLights[0].diffuse");
		this.gl.uniform3f(pointLights0diffuse, 0.6, 0.6, 0.6);
		const pointLights0specular = shader.uniform("pointLights[0].specular");
		this.gl.uniform3f(pointLights0specular, 1, 1, 1);
		const pointLights0constant = shader.uniform("pointLights[0].constant");
		this.gl.uniform1f(pointLights0constant, 0.25);
		const pointLights0linear = shader.uniform("pointLights[0].linear");
		this.gl.uniform1f(pointLights0linear, 0.09);
		const pointLights0quadratic = shader.uniform("pointLights[0].quadratic");
		this.gl.uniform1f(pointLights0quadratic, 0.032);
		const pointLights0on_off = shader.uniform("pointLights[0].on_off");
		this.gl.uniform1f(pointLights0on_off, primitives[0].on);
		// // points light 2
		const pointLights1position = shader.uniform("pointLights[1].position");
		this.gl.uniform3f(pointLights1position, primitives[1].translation[0], primitives[1].translation[1], primitives[1].translation[2]);
		const pointLights1ambient = shader.uniform("pointLights[1].ambient");
		this.gl.uniform3f(pointLights1ambient, 0.1, 0.1, 0.1);
		const pointLights1diffuse = shader.uniform("pointLights[1].diffuse");
		this.gl.uniform3f(pointLights1diffuse, 0.6, 0.6, 0.6);
		const pointLights1specular = shader.uniform("pointLights[1].specular");
		this.gl.uniform3f(pointLights1specular, 1.0, 1.0, 1.0);
		const pointLights1constant = shader.uniform("pointLights[1].constant");
		this.gl.uniform1f(pointLights1constant, 0.25);
		const pointLights1linear = shader.uniform("pointLights[1].linear");
		this.gl.uniform1f(pointLights1linear, 0.09);
		const pointLights1quadratic = shader.uniform("pointLights[1].quadratic");
		this.gl.uniform1f(pointLights1quadratic, 0.032);
		const pointLights1on_off = shader.uniform("pointLights[1].on_off");
		this.gl.uniform1f(pointLights1on_off, primitives[1].on);
		// points light 3
		const pointLights2position = shader.uniform("pointLights[2].position");
		this.gl.uniform3f(pointLights2position, primitives[2].translation[0], primitives[2].translation[1], primitives[2].translation[2]);
		const pointLights2ambient = shader.uniform("pointLights[2].ambient");
		this.gl.uniform3f(pointLights2ambient, 0.1, 0.1, 0.1);
		const pointLights2diffuse = shader.uniform("pointLights[2].diffuse");
		this.gl.uniform3f(pointLights2diffuse, 0.6, 0.6, 0.6);
		const pointLights2specular = shader.uniform("pointLights[2].specular");
		this.gl.uniform3f(pointLights2specular, 1.0, 1.0, 1.0);
		const pointLights2constant = shader.uniform("pointLights[2].constant");
		this.gl.uniform1f(pointLights2constant, 0.25);
		const pointLights2linear = shader.uniform("pointLights[2].linear");
		this.gl.uniform1f(pointLights2linear, 0.09);
		const pointLights2quadratic = shader.uniform("pointLights[2].quadratic");
		this.gl.uniform1f(pointLights2quadratic, 0.032);
		const pointLights2on_off = shader.uniform("pointLights[2].on_off");
		this.gl.uniform1f(pointLights2on_off, primitives[2].on);
		// points light 4
		const pointLights3position = shader.uniform("pointLights[3].position");
		this.gl.uniform3f(pointLights3position, primitives[3].translation[0], primitives[3].translation[1], primitives[3].translation[2]);
		const pointLights3ambient = shader.uniform("pointLights[3].ambient");
		this.gl.uniform3f(pointLights3ambient, 0.1, 0.1, 0.1);
		const pointLights3diffuse = shader.uniform("pointLights[3].diffuse");
		this.gl.uniform3f(pointLights3diffuse, 0.6, 0.6, 0.6);
		const pointLights3specular = shader.uniform("pointLights[3].specular");
		this.gl.uniform3f(pointLights3specular, 1.0, 1.0, 1.0);
		const pointLights3constant = shader.uniform("pointLights[3].constant");
		this.gl.uniform1f(pointLights3constant, 0.25);
		const pointLights3linear = shader.uniform("pointLights[3].linear");
		this.gl.uniform1f(pointLights3linear, 0.09);
		const pointLights3quadratic = shader.uniform("pointLights[3].quadratic");
		this.gl.uniform1f(pointLights3quadratic, 0.032);
		const pointLights3on_off = shader.uniform("pointLights[3].on_off");
		this.gl.uniform1f(pointLights3on_off, primitives[3].on);
		

		const indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.indices), this.gl.DYNAMIC_DRAW);
		this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
	}
		
}

