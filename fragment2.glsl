precision mediump float;

varying vec3 fNormal;
varying vec3 fPosition;
varying vec2 fTexCoord;

uniform vec3 lightColor;
uniform vec3 lightPosition;
uniform vec3 ambientColor;
uniform mat4 view;

uniform sampler2D sampler0;

void main() {

  vec4 tex0 = texture2D(sampler0, fTexCoord); // Hasil akhirnya adalah warna (RGBA)

  vec3 normal = normalize(fNormal);
  
  vec3 lightDirection = normalize(vec3(view *  vec4(lightPosition, 1)) - fPosition);
  float dotLight = dot(lightDirection, -normal);
  float lightIntensity = max(0.0, dotLight);
  vec3 ambient = ambientColor * tex0.rgb;

  float specularPower = 10.0;
  float specular = 0.0;

    if (lightIntensity > 0.0) {
    // viewing vector
    vec3 viewVec = vec3(0,0,0.95);

    // reflective vector
    vec3 reflectVec = reflect(-lightDirection, normal);

    // determine the specularFactor based on the dot product of viewing and reflective,
    // taking at least a minimum of 0.0
    float specularFactor = max(dot(reflectVec, viewVec), 0.0);
    specular = pow(specularFactor, specularPower);
  }
  vec3 diffuse = lightColor * tex0.rgb * lightIntensity + specular;

  gl_FragColor = vec4(diffuse + ambient, 1.0);
}
