import { Box, Plane, Sphere, Text as DreiText, Torus } from '@react-three/drei';
import { createPortal, MeshProps, useFrame } from '@react-three/fiber';
import { buttonGroup, LevaInputs, useControls } from 'leva';
import React, { useMemo, useRef, useState } from 'react';
import type { Mesh } from 'three';
import { Color, PerspectiveCamera, Scene, WebGLRenderTarget } from 'three';
import Fonts from '../fonts';
import { KineticMaterial } from './KineticMaterial';
import SwitchGeometry from './SwitchGeometry';

function useRenderTargetTexture() {
  const camera = useRef<PerspectiveCamera>();
  const mesh = useRef<Mesh>();

  const [scene, target] = useMemo(() => {
    const scene = new Scene();
    scene.background = new Color(0x000000);
    const { innerHeight, innerWidth } = window;
    const target = new WebGLRenderTarget(innerWidth, innerHeight);
    return [scene, target];
  }, []);

  useFrame(({ gl }) => {
    if (camera.current && mesh.current) {
      gl.setRenderTarget(target);
      gl.render(scene, camera.current);
      gl.setRenderTarget(null);
    }
  });

  return { camera, mesh, scene, texture: target.texture };
}

export const OOOFFFScene = (props: MeshProps) => {
  const [activeComponent, setActiveComponent] = useState('Torus');
  const [distortion, setDistortion] = useState(true);
  const [shadow, setShadow] = useState(true);
  const { camera, mesh, scene, texture } = useRenderTargetTexture();
  const { fontSize, geometrySize, Repeats, Text } = useControls({
    Geometry: buttonGroup({
      Box: () => setActiveComponent('Box'),
      Plane: () => setActiveComponent('Plane'),
      Sphere: () => setActiveComponent('Sphere'),
      Torus: () => setActiveComponent('Torus'),
    }),

    Text: {
      type: LevaInputs.STRING,
      value: 'OF',
    },

    fontSize: {
      label: 'Font Size',
      min: 0.5,
      max: 6,
      step: 0.1,
      value: 2,
    },

    geometrySize: {
      label: 'Geometry Size',
      min: 1,
      max: 10,
      step: 0.1,
      value: 3,
    },

    Repeats: {
      min: 1,
      max: 6,
      step: 1,
      value: 6,
    },

    Distortion: {
      value: !distortion,
      onChange: () => setDistortion((state) => !state),
    },

    Shadow: {
      value: !shadow,
      onChange: () => setShadow((state) => !state),
    },
  });

  const material = (
    <KineticMaterial
      distortion={distortion}
      map={texture}
      repeats={Repeats}
      shadow={shadow}
    />
  );

  return (
    <>
      <perspectiveCamera
        aspect={1}
        far={20}
        fov={75}
        near={1}
        position={[0, 0, 5]}
        ref={camera}
      />

      <SwitchGeometry active={activeComponent}>
        <Plane
          args={[geometrySize, geometrySize]}
          attach="geometry"
          name="Plane"
          ref={mesh}
        >
          {material}
        </Plane>

        <Box
          args={[geometrySize, geometrySize, geometrySize]}
          attach="geometry"
          name="Box"
          ref={mesh}
        >
          {material}
        </Box>

        <Sphere
          args={[geometrySize / 2]}
          attach="geometry"
          name="Sphere"
          ref={mesh}
        >
          {material}
        </Sphere>

        <Torus
          args={[
            geometrySize / 2,
            geometrySize / 4,
            Math.pow(geometrySize, 2),
            Math.pow(geometrySize, 3),
          ]}
          attach="geometry"
          name="Torus"
          ref={mesh}
        >
          {material}
        </Torus>
      </SwitchGeometry>

      {scene &&
        createPortal(
          <DreiText
            color={0xffffff}
            font={Fonts['Cabinet Grotesk']}
            fontSize={fontSize}
          >
            {Text.toUpperCase()}
          </DreiText>,
          scene
        )}
    </>
  );
};
