const vertexShaderSrc = `     
struct PointLight {
  vec3 position;
  
  float constant;
  float linear;
  float quadratic;

  bool on_off;

  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
};

struct Material {
  float ambient;
  float diffuse;
  float specular;
  float shininess;
}; 

#define NR_POINT_LIGHTS 4

varying vec4 FragColor;

uniform vec3 viewPos;
uniform PointLight pointLights[NR_POINT_LIGHTS]; 
uniform Material material; 
uniform mat4 uModelTransformMatrix;
uniform mat4 transInvMat;
uniform mat4 viewprojection;

attribute vec3 aPosition;
attribute vec3 aNormal;

vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir);

void main () {             
  gl_Position = viewprojection * uModelTransformMatrix * vec4(aPosition, 1.0); 

  vec3 FragPos = vec3(uModelTransformMatrix * vec4(aPosition, 1.0));
  vec3 Normal = mat3(transInvMat) * aNormal;

  vec3 norm = normalize(Normal);
  vec3 viewDir = normalize(viewPos-FragPos);
  vec3 result = vec3(0.0,0.0,0.0);
  for(int i = 0; i < NR_POINT_LIGHTS; i++){
    if(pointLights[i].on_off)
        result += CalcPointLight(pointLights[i], norm, FragPos, viewDir);
  }
  
  FragColor = vec4(result, 1.0);

} 

vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    vec3 lightDir = normalize(light.position - fragPos);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    // attenuation
    float distance = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    
    // combine results
    vec3 ambient = light.ambient * material.ambient;
    vec3 diffuse = light.diffuse * diff * material.diffuse;
    vec3 specular = light.specular * spec * material.specular;
    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;
    return (ambient + diffuse + specular);
}
                   


`;

export default vertexShaderSrc;