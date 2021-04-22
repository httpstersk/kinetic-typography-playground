uniform vec3 uColor;
uniform float uRepeats;
uniform sampler2D uTexture;
uniform float uHasTexture;
uniform float uTime;

varying vec3 vNormal;
varying vec2 vUv;
varying float vWave;

void main() {
    float wave = vWave;
    float shadow = 1.0 - wave;

    vec2 repeat = vec2(uRepeats, uRepeats);
    vec2 uv = fract(vUv * repeat);
    vec3 texture = texture2D(uTexture, uv).rgb;
    vec3 color = texture * shadow;

  if (uHasTexture == 1.0) {
    gl_FragColor = vec4(color, 1.0);
  } else {
    gl_FragColor = vec4(uColor, 1.0);
  }
}