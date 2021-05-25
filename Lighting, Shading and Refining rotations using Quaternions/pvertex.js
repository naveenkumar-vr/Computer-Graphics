const pvertexShaderSrc = `     

uniform mat4 uModelTransformMatrix;
uniform mat4 transInvMat;
uniform mat4 viewprojection;

varying vec3 FragPos; 
varying vec3 Normal;
varying vec3 viewPos;

attribute vec3 aPosition;
attribute vec3 aNormal;



void main () {             
  gl_Position =  viewprojection * uModelTransformMatrix * vec4(aPosition, 1.0); 

  FragPos = vec3(uModelTransformMatrix * vec4(aPosition, 1.0));
  Normal = mat3(transInvMat) * aNormal;

} 


                   


`;

export default pvertexShaderSrc;