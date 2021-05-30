uniform vec3 uColor;
uniform bool uHasTexture;
uniform vec2 uRepeats;
uniform sampler2D uTexture;
uniform float uTime;
uniform bool uUseLight;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying float vWave;

void main() {
    float wave = vWave;
    vec2 repeat = vec2(uRepeats.x, uRepeats.y);
    vec2 uv = fract(vUv * repeat);
    vec3 texture = texture2D(uTexture, uv).rgb;

    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    vec3 lightPosition = vec3(2.0, 2.0, 2.0);
    vec3 lightDirection = normalize(lightPosition - vPosition);

    vec3 cameraDirection = normalize(cameraPosition - vPosition);
    vec3 reflectionDirection = normalize(lightDirection + cameraDirection);

    float shininess = 1.0;
    float reflectionColor = uUseLight
      ? pow(max(dot(reflectionDirection, vNormal), 0.0), shininess)
      : 0.0;

    if (uHasTexture) {
      gl_FragColor = vec4(reflectionColor + uColor + texture, 1.0);
    } else {
      gl_FragColor = vec4(uColor, 1.0);
    }
}