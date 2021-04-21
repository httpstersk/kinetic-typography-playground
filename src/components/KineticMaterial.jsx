import { extend } from '@react-three/fiber';
import { Color, DoubleSide, ShaderMaterial, Vector2 } from 'three';
import fragmentShader from '../shaders/fragment.glsl';
import vertexShader from '../shaders/vertex.glsl';

const getResolution = () => new Vector2(window.innerWidth, window.innerHeight);

class KineticMaterial extends ShaderMaterial {
  constructor() {
    super({
      fragmentShader,
      vertexShader,
      defines: {
        PI: Math.PI,
      },
      side: DoubleSide,
      uniforms: {
        uColor: { type: 'c', value: new Color('red') },
        uRepeat: { type: 'f', value: 1.0 },
        uResolution: { type: 'v2', value: getResolution() },
        uTexture: { type: 't', value: null },
        uTime: { type: 'f', value: 1.0 },
      },
    });
  }

  get time() {
    return this.uniforms.uTime.value;
  }

  set time(value) {
    this.uniforms.uTime.value = value;
  }

  get resolution() {
    return this.uniforms.uResolution.value;
  }

  set resolution(value) {
    this.uniforms.uResolution.value = value;
  }

  get map() {
    return this.uniforms.uTexture.value;
  }

  set map(value) {
    this.uniforms.uTexture.value = value;
  }
}

extend({ KineticMaterial });
