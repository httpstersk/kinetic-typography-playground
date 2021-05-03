uniform float uAmplitude;
uniform float uFrequency;
uniform bool uHasTexture;
uniform float uTime;
uniform bool uUseDistortion;

varying vec3 vNormal;
varying vec2 vUv;
varying float vWave;

void main() {
  vUv = uv;
  vNormal = normal;
  vec3 newPosition = position;

  if (uHasTexture && uUseDistortion) {
    newPosition.z += sin((newPosition.x - newPosition.y) * uFrequency - uTime) * uAmplitude;
    vWave = newPosition.z;
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}