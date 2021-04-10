import { extend } from '@react-three/fiber';
import { Color, ShaderMaterial, Vector2 } from 'three';
import fragmentShader from '../shaders/fragment.glsl';
import vertexShader from '../shaders/vertex.glsl';

class KineticMaterial extends ShaderMaterial {
  constructor() {
    super({
      fragmentShader,
      vertexShader,
      uniforms: {
        resolution: { value: new Vector2(1024, 1024) },
        time: { value: 1.0 },
        color: { value: new Color('red') },
        hasTexture: { value: 0 },
        uTexture: { value: null },
      },
    });
  }

  get time() {
    return this.uniforms.time.value;
  }

  set time(value) {
    this.uniforms.time.value = value;
  }

  get resolution() {
    return this.uniforms.resolution.value;
  }

  set resolution(value) {
    this.uniforms.resolution.value = value;
  }

  get map() {
    return this.uniforms.uTexture.value;
  }

  set map(value) {
    this.uniforms.hasTexture.value = !!value;
    this.uniforms.uTexture.value = value;
  }
}

extend({ KineticMaterial });
