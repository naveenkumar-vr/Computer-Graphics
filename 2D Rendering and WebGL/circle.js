import Transform from './transform.js'
import { vec3 } from 'https://cdn.skypack.dev/gl-matrix';
export default class Circle
{
	constructor(gl, translation, shape)
	{
        this.shape = shape;
        this.vertexPositionData = new Float32Array([
            //  x , y,  z 
            0, 0 , 0,
            0, 0 , 0
        ]);
        this.vertexColorData = new Float32Array([
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
        ]);
        for ( var i = 0; i <= 200; i++){
            var t = new Float32Array([
                0, 0, 0,
                0.1*Math.cos(i*2*Math.PI/200), 0.1*Math.sin(i*2*Math.PI/200), 0
            ]);
            var c = new Float32Array([
                0.0,0.0,1.0,
                0.0,0.0,1.0,
            ]);
            this.vertexPositionData = new Float32Array([...this.vertexPositionData, ...t])
            this.vertexColorData = new Float32Array([...this.vertexColorData, ...c])
        }
        this.gl = gl;
        this.vertexPositionBuffer = this.gl.createBuffer();
        if (!this.vertexPositionBuffer)
		{
			throw new Error("Buffer for vertex attributes could not be allocated");
        }
        this.colorBuffer = this.gl.createBuffer();
        if (!this.colorBuffer)
		{
			throw new Error("Buffer for color could not be allocated");
        }
        this.transform = new Transform();
		this.translate = translation;
        this.scale = vec3.fromValues( 1, 1, 1);
        this.rotationAngle = 0;
		this.rotationAxis = vec3.fromValues( 0, 0, 1);
		this.transform.setTranslate(translation);
	}

	draw(shader)
	{
		const uModelTransformMatrix = shader.uniform("uModelTransformMatrix");

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexPositionData, this.gl.DYNAMIC_DRAW);
		
		const aPosition = shader.attribute("aPosition");
		this.gl.enableVertexAttribArray(aPosition);
		this.gl.vertexAttribPointer(aPosition, 3, this.gl.FLOAT, false, 3 * this.vertexPositionData.BYTES_PER_ELEMENT, 0);
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexColorData, this.gl.DYNAMIC_DRAW);
		
		const aColor = shader.attribute("aColor");
		this.gl.enableVertexAttribArray(aColor);
		this.gl.vertexAttribPointer(aColor, 3, this.gl.FLOAT, false, 3 * this.vertexPositionData.BYTES_PER_ELEMENT, 0);

        shader.setUniformMatrix4fv(uModelTransformMatrix, this.transform.getMVPMatrix());

		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.vertexPositionData.length / 3);
	}

    setTranslate(translationVec)
	{
		this.translate = translationVec;
	}

	getTranslate()
	{
		return this.translate;
	}

	setScale(scalingVec)
	{
		this.scale = scalingVec;
	}

	getScale()
	{
		return this.scale;
    }
    setRotate(rotationAngle)
	{
		this.rotationAngle = rotationAngle;
	}
	getRotate()
	{
		return this.rotationAngle;
	}
}