uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;

#pragma glslify: snoise = require('glsl-noise/simplex/3d')

void main() {
  vUv = uv;
  vNormal = normal;
  vec3 transformed = position;
  float noise = snoise(vec3(position.xy, uTime / 10.0)) * 1.0;
  transformed += normal * noise;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}