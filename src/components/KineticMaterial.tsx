import { shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import React, { forwardRef, useRef } from 'react';
import mergeRefs from 'react-merge-refs';
import { Color, Texture, Vector2, Vector3 } from 'three';
import fragmentShader from '../shaders/fragment.glsl';
import vertexShader from '../shaders/vertex.glsl';

type KineticMaterialUniforms = {
  uAmplitude: number;
  uColor: Color;
  uFrequency: number;
  uHasTexture: boolean;
  uRepeats: Vector3;
  uResolution: Vector2;
  uTexture: Texture;
  uTime: number;
  uUseDistortion: boolean;
  uUseShadow: boolean;
};

type KineticMaterialImplementation = KineticMaterialUniforms &
  JSX.IntrinsicElements['shaderMaterial'];

const getResolution = () => new Vector2(window.innerWidth, window.innerHeight);

const uniforms: KineticMaterialUniforms = {
  uAmplitude: 1.0,
  uColor: new Color(0x000fff),
  uFrequency: 1.0,
  uHasTexture: false,
  uRepeats: new Vector3(1.0),
  uResolution: getResolution(),
  uTexture: new Texture(),
  uTime: 1.0,
  uUseDistortion: false,
  uUseShadow: false,
};

const KineticMaterialImpl = shaderMaterial(
  uniforms,
  vertexShader,
  fragmentShader
);

extend({ KineticMaterialImpl });

export const KineticMaterial = forwardRef<
  any,
  KineticMaterialImplementation & any
>(
  (
    {
      uAmplitude,
      uColor,
      uFrequency,
      uHasTexture,
      uRepeats,
      uUseDistortion,
      uUseShadow,
      uTexture,
      ...props
    },
    ref
  ) => {
    const materialRef = useRef<KineticMaterialImplementation>();

    useFrame(({ clock }) => {
      if (materialRef.current) {
        materialRef.current.uAmplitude = uAmplitude;
        materialRef.current.uColor = uColor;
        materialRef.current.uFrequency = uFrequency;
        materialRef.current.uHasTexture = !!uTexture;
        materialRef.current.uRepeats = uRepeats;
        materialRef.current.uTime = clock.getElapsedTime();
        materialRef.current.uUseDistortion = uUseDistortion;
        materialRef.current.uTexture = uTexture;
        materialRef.current.uUseShadow = uUseShadow;
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
