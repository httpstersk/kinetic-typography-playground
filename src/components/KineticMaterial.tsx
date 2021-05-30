import { shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import React, { forwardRef, useRef } from 'react';
import mergeRefs from 'react-merge-refs';
import {
  Color,
  ShaderMaterial,
  Texture,
  UniformsLib,
  UniformsUtils,
  Vector2,
  Vector3,
} from 'three';
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
  uUseLight: boolean;
};

type KineticMaterialImplementation = KineticMaterialUniforms &
  JSX.IntrinsicElements['shaderMaterial'];

const getResolution = () => new Vector2(window.innerWidth, window.innerHeight);

const kineticMaterialUniforms: KineticMaterialUniforms = {
  uAmplitude: 1.0,
  uColor: new Color(0x000fff),
  uFrequency: 1.0,
  uHasTexture: false,
  uRepeats: new Vector3(1.0),
  uResolution: getResolution(),
  uTexture: new Texture(),
  uTime: 1.0,
  uUseDistortion: false,
  uUseLight: false,
};

const onShaderMaterialInit = (material?: ShaderMaterial) => {
  if (material) {
    material.uniforms = UniformsUtils.merge([
      UniformsLib.lights,
      kineticMaterialUniforms,
    ]);

    material.uniformsNeedUpdate = true;
  }
};

const KineticMaterialImpl = shaderMaterial(
  kineticMaterialUniforms,
  vertexShader,
  fragmentShader,
  onShaderMaterialInit
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
      uUseLight,
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
        materialRef.current.uUseLight = uUseLight;
      }
    });

    return (
      <kineticMaterialImpl
        attach="material"
        castShadow
        lights
        receiveShadow
        ref={mergeRefs([ref, materialRef])}
        {...props}
      />
    );
  }
);
