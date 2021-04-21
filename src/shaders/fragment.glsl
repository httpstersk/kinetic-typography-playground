uniform vec3 uColor;
uniform float uRepeat;
uniform sampler2D uTexture;
uniform float uTime;

varying vec3 vNormal;
varying vec2 vUv;
varying float vWave;

void main() {
  float time = uTime * 0.25;
  float wave = vWave;
  float shadow = 1.0 - wave;

  vec2 repeat = vec2(uRepeat, uRepeat);
  vec2 uv = fract(vUv * repeat);
  vec3 texture = texture2D(uTexture, uv).rgb;
  vec3 color = texture * shadow;

  gl_FragColor = vec4(color, 1.0);
}