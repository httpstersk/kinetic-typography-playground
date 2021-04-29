uniform bool uDistortion;
uniform bool uHasTexture;
uniform float uRepeats;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying float vWave;

// #pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
// #pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
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

  float amplitude = 1.0;
  float frequency = 0.9;
  float time = uTime * 2.0;
  vec3 newPosition = position;

  if (uHasTexture && uDistortion) {
    newPosition.z +=  sin((newPosition.x - newPosition.y) * frequency - time) * amplitude;
    vWave = newPosition.z;
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}