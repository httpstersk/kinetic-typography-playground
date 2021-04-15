uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;

// #pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
// #pragma glslify: snoise4 = require(glsl-noise/simplex/4d)
// #pragma glslify: cnoise2 = require(glsl-noise/classic/2d)
// #pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
// #pragma glslify: cnoise4 = require(glsl-noise/classic/4d)
// #pragma glslify: pnoise2 = require(glsl-noise/periodic/2d)
// #pragma glslify: pnoise3 = require(glsl-noise/periodic/3d)
// #pragma glslify: pnoise4 = require(glsl-noise/periodic/4d)

void main() {
  vUv = uv;
  vNormal = normal;
  vec3 transformed = position;
  float noise = snoise3(vec3(position.xy, uTime / 10.0)) * 1.0;
  transformed += normal * noise;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}