const pfragmentShaderSrc = ` 
  
precision mediump float;   
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

uniform vec3 uPrimitiveColor;  
uniform bool blinn; 

varying vec3 FragPos; 
varying vec3 Normal;

uniform vec3 viewPos;
uniform PointLight pointLights[NR_POINT_LIGHTS]; 
uniform Material material; 

vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir);

void main () {        
vec4 FragColor;
vec3 norm = normalize(Normal);
  vec3 viewDir = normalize(viewPos-FragPos);
  vec3 result = vec3(0.0,0.0,0.0);
  for(int i = 0; i < NR_POINT_LIGHTS; i++){
      if(pointLights[i].on_off)
        result += CalcPointLight(pointLights[i], norm, FragPos, viewDir);
  }

  gl_FragColor = vec4(result, 1.0);
}       

vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    vec3 lightDir = normalize(light.position - fragPos);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    float spec;
    if(blinn){
      vec3 half_vector = normalize(lightDir + viewDir);
      spec = pow(max(dot(viewDir, half_vector), 0.0), material.shininess);
    }else{
      vec3 reflectDir = reflect(lightDir, normal);
      spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    }
    
    // attenuation
    float distance = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    
    // combine results
    vec3 ambient = material.ambient * light.ambient * uPrimitiveColor;
    vec3 diffuse = material.diffuse * light.diffuse * diff *  uPrimitiveColor;
    vec3 specular = material.specular * light.specular * spec *  uPrimitiveColor;
    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;
    return (ambient + diffuse + specular);
}

	  `;

export default pfragmentShaderSrc;