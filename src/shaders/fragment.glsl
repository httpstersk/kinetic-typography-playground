uniform vec3 uColor;
uniform bool uHasTexture;
uniform vec2 uRepeats;
uniform sampler2D uTexture;
uniform float uTime;
uniform bool uUseShadow;

varying vec3 vNormal;
varying vec2 vUv;
varying float vWave;

void main() {
    float wave = vWave;
    vec2 repeat = vec2(uRepeats.x, uRepeats.y);
    vec2 uv = fract(vUv * repeat);
    vec3 texture = texture2D(uTexture, uv).rgb;

    if (uUseShadow) {
      float shadow = 1.0 - wave;
      texture *= shadow;
    }

    if (uHasTexture) {
      gl_FragColor = vec4(texture, 1.0);
    } else {
      gl_FragColor = vec4(uColor, 1.0);
    }
}