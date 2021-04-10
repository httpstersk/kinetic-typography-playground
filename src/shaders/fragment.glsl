varying vec2 vUv;
uniform float time;
uniform vec3 color;
uniform float hasTexture;
uniform sampler2D uTexture;
varying vec3 vNormal;

void main() {
    vec2 newUv = vUv;
    vec2 repeat = vec2(1.0, 1.0);
    newUv = fract(newUv * repeat + vec2(sin(time) / 10.0, cos(time) / 10.0));
    vec4 texture = texture2D(uTexture, newUv);

    if (hasTexture == 1.0) {
      gl_FragColor = texture;
    } else {
      gl_FragColor = vec4(color, 1.0);
    }

}