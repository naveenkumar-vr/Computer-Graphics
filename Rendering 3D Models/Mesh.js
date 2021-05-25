export default class Mesh
{
	constructor(gl, color,data,t,r,s)
	{
		this.vertexAttributesData = new Float32Array(data.vertices);
		this.indices = data.indices;
		this.gl = gl;
		this.color = color;
		this.vertexAttributesBuffer = this.gl.createBuffer();
		if (!this.vertexAttributesBuffer)
		{
			throw new Error("Buffer for vertex attributes could not be allocated");
		}

		this.translation= t;
		this.rotation = r;
		this.scale = s;
		this.rotTranslation = [0,0,0];
	}

	draw(shader,matrix)
	{
		const uModelTransformMatrix = shader.uniform("uModelTransformMatrix");
		let elementPerVertex = 3;

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexAttributesBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexAttributesData, this.gl.STATIC_DRAW);

		const aPosition = shader.attribute("aPosition");
		this.gl.enableVertexAttribArray(aPosition);
		this.gl.vertexAttribPointer(aPosition, elementPerVertex, this.gl.FLOAT, false, 3 * this.vertexAttributesData.BYTES_PER_ELEMENT, 0);

		const uPrimitiveColor = shader.uniform("uPrimitiveColor");		
		shader.setUniform3f(uPrimitiveColor, this.color);

		shader.setUniformMatrix4fv(uModelTransformMatrix, matrix);
		const indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.indices), this.gl.STATIC_DRAW);
		this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
	}
	
}