import { extend, useFrame } from '@react-three/fiber';
import React, { forwardRef, useRef } from 'react';
import { Color, DoubleSide, ShaderMaterial, Vector2 } from 'three';
import mergeRefs from 'react-merge-refs';
import fragmentShader from '../shaders/fragment.glsl';
import vertexShader from '../shaders/vertex.glsl';

type KineticMaterialType = JSX.IntrinsicElements['shaderMaterial'] & {
  amplitude: number;
  frequency: number;
  repeats: number;
  time: number;
  useDistortion: boolean;
  useShadow: boolean;
};

const getResolution = () => new Vector2(window.innerWidth, window.innerHeight);

class KineticMaterialImpl extends ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      side: DoubleSide,
      uniforms: {
        uAmplitude: { value: 1.0 },
        uColor: { value: new Color(0x000fff) },
        uFrequency: { value: 1.0 },
        uHasTexture: { value: false },
        uRepeats: { value: new Vector2(1.0) },
        uResolution: { value: getResolution() },
        uUseDistortion: { value: false },
        uUseShadow: { value: false },
        uTexture: { value: null },
        uTime: { value: 1.0 },
      },
    });
  }

  get amplitude() {
    return this.uniforms.uAmplitude.value;
  }

  set amplitude(value) {
    this.uniforms.uAmplitude.value = value;
  }

  get color() {
    return this.uniforms.uColor.value;
  }

  set color(value) {
    this.uniforms.uColor.value = new Color(value);
  }

  get frequency() {
    return this.uniforms.uFrequency.value;
  }

  set frequency(value) {
    this.uniforms.uFrequency.value = value;
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

  get texture() {
    return this.uniforms.uTexture.value;
  }

  set texture(value) {
    this.uniforms.uHasTexture.value = !!value;
    this.uniforms.uTexture.value = value;
  }

  get time() {
    return this.uniforms.uTime.value;
  }

  set time(value) {
    this.uniforms.uTime.value = value;
  }

  get useDistortion() {
    return this.uniforms.uUseDistortion.value;
  }

  set useDistortion(value) {
    this.uniforms.uUseDistortion.value = !!value;
  }

  get useShadow() {
    return this.uniforms.uUseShadow.value;
  }

  set useShadow(value) {
    this.uniforms.uUseShadow.value = !!value;
  }
}

extend({ KineticMaterialImpl });

export const KineticMaterial = forwardRef<any, KineticMaterialType & any>(
  (
    { amplitude, frequency, repeats, useDistortion, useShadow, ...props },
    ref
  ) => {
    const materialRef = useRef<KineticMaterialType>();

    useFrame(({ clock }) => {
      if (materialRef.current) {
        materialRef.current.time = clock.getElapsedTime();
        materialRef.current.amplitude = amplitude;
        materialRef.current.frequency = frequency;
        materialRef.current.repeats = repeats;
        materialRef.current.useDistortion = useDistortion;
        materialRef.current.useShadow = useShadow;
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
