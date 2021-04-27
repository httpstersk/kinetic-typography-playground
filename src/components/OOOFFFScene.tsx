import { Box, Plane, Sphere, Text } from '@react-three/drei';
import { createPortal, MeshProps, useFrame } from '@react-three/fiber';
import { buttonGroup, useControls } from 'leva';
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
  const [activeComponent, setActiveComponent] = useState('Plane');
  const { camera, mesh, scene, texture } = useRenderTargetTexture();
  const { fontSize, repeats } = useControls({
    fontSize: {
      label: 'Font Size',
      min: 0.5,
      max: 6,
      step: 0.1,
      value: 2,
    },
    repeats: {
      label: 'Repeats',
      min: 1,
      max: 6,
      step: 1,
      value: 1,
    },
    Geometry: buttonGroup({
      Box: () => setActiveComponent('Box'),
      Plane: () => setActiveComponent('Plane'),
      Sphere: () => setActiveComponent('Sphere'),
    }),
  });

  const material = <KineticMaterial map={texture} repeats={repeats} />;

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
        <Plane args={[6, 6]} attach="geometry" name="Plane" ref={mesh}>
          {material}
        </Plane>

        <Box args={[3, 3, 3]} attach="geometry" name="Box" ref={mesh}>
          {material}
        </Box>

        <Sphere args={[6]} attach="geometry" name="Sphere" ref={mesh}>
          {material}
        </Sphere>
      </SwitchGeometry>

      {scene &&
        createPortal(
          <Text
            color={0xffffff}
            font={Fonts['Cabinet Grotesk']}
            fontSize={fontSize}
          >
            OF
          </Text>,
          scene
        )}
    </>
  );
};
