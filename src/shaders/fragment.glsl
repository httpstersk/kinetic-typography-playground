uniform vec3 uColor;
uniform float uTime;
uniform sampler2D uTexture;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
    vec2 newUv = vUv;
    vec2 repeat = vec2(1.0, 1.0);

    newUv = fract(newUv * repeat + vec2(sin(uTime) / 10.0, cos(uTime) / 10.0));
    vec4 texture = texture2D(uTexture, newUv);
    gl_FragColor = texture;
}