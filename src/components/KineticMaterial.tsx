import { extend, useFrame } from '@react-three/fiber';
import React, { forwardRef, useRef } from 'react';
import { Color, DoubleSide, ShaderMaterial, Vector2 } from 'three';
import mergeRefs from 'react-merge-refs';
import fragmentShader from '../shaders/fragment.glsl';
import vertexShader from '../shaders/vertex.glsl';

type KineticMaterialType = JSX.IntrinsicElements['shaderMaterial'] & {
  time: number;
  repeats: number;
};

const getResolution = () => new Vector2(window.innerWidth, window.innerHeight);

class KineticMaterialImpl extends ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      side: DoubleSide,
      uniforms: {
        uColor: { value: new Color(0x000fff) },
        uRepeats: { value: 1.0 },
        uResolution: { value: getResolution() },
        uTexture: { value: null },
        uHasTexture: { value: 0.0 },
        uTime: { value: 1.0 },
      },
    });
  }

  get color() {
    return this.uniforms.uColor.value;
  }

  set color(value) {
    this.uniforms.uColor.value = new Color(value);
  }

  get time() {
    return this.uniforms.uTime.value;
  }

  set time(value) {
    this.uniforms.uTime.value = value;
  }

  get repeats() {
    return this.uniforms.uRepeats.value;
  }

  set repeats(value) {
    this.uniforms.uRepeats.value = value;
  }

  get resolution() {
    return this.uniforms.uResolution.value;
  }

  set resolution(value) {
    this.uniforms.uResolution.value = value;
  }

  get hasTexture() {
    return this.uniforms.uHasTexture.value;
  }

  get map() {
    return this.uniforms.uTexture.value;
  }

  set map(value) {
    this.uniforms.uHasTexture.value = !!value ? 1.0 : 0.0;
    this.uniforms.uTexture.value = value;
  }
}

extend({ KineticMaterialImpl });

export const KineticMaterial = forwardRef<any, KineticMaterialType & any>(
  ({ repeats, ...props }, ref) => {
    const materialRef = useRef<KineticMaterialType>();

    useFrame(({ clock }) => {
      if (materialRef.current) {
        materialRef.current.time = clock.getElapsedTime();
        materialRef.current.repeats = repeats;
      }
    });

    return (
      <kineticMaterialImpl
        attach="material"
        ref={mergeRefs([ref, materialRef])}
        {...props}
      />
    );
  }
);
