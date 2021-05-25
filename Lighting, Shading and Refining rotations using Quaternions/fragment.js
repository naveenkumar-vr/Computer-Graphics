const fragmentShaderSrc = `   
precision mediump float;  
varying vec4 FragColor;
uniform vec3 uPrimitiveColor;   
void main () {        
         
  gl_FragColor = FragColor*vec4(uPrimitiveColor,1.0); 
}                            
	  `;

export default fragmentShaderSrc;
