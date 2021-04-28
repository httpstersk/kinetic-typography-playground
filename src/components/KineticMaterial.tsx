import { extend, useFrame } from '@react-three/fiber';
import React, { forwardRef, useRef } from 'react';
import { Color, DoubleSide, ShaderMaterial, Vector2 } from 'three';
import mergeRefs from 'react-merge-refs';
import fragmentShader from '../shaders/fragment.glsl';
import vertexShader from '../shaders/vertex.glsl';

type KineticMaterialType = JSX.IntrinsicElements['shaderMaterial'] & {
  hasShadow: boolean;
  repeats: number;
  time: number;
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
        uHasShadow: { value: false },
        uHasTexture: { value: false },
        uRepeats: { value: 1.0 },
        uResolution: { value: getResolution() },
        uTexture: { value: null },
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

  get hasShadow() {
    return this.uniforms.uHasShadow.value;
  }

  set hasShadow(value) {
    this.uniforms.uHasShadow.value = !!value;
  }

  get hasTexture() {
    return this.uniforms.uHasTexture.value;
  }

  get map() {
    return this.uniforms.uTexture.value;
  }

  set map(value) {
    this.uniforms.uHasTexture.value = !!value;
    this.uniforms.uTexture.value = value;
  }
}

extend({ KineticMaterialImpl });

export const KineticMaterial = forwardRef<any, KineticMaterialType & any>(
  ({ hasShadow, repeats, ...props }, ref) => {
    const materialRef = useRef<KineticMaterialType>();

    useFrame(({ clock }) => {
      if (materialRef.current) {
        materialRef.current.time = clock.getElapsedTime();
        materialRef.current.repeats = repeats;
        materialRef.current.hasShadow = hasShadow;
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
