uniform vec3 uColor;
uniform sampler2D uTexture;
uniform float uTime;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    vec2 repeat = vec2(1.0, 1.0);

    uv = fract(uv * repeat + vec2(sin(uTime) / 10.0, cos(uTime) / 10.0));
    vec4 texture = texture2D(uTexture, uv);
    gl_FragColor = texture;
}