import { OrbitControls, Plane, Text } from '@react-three/drei';
import { createPortal, MeshProps, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import React, { useMemo, useRef } from 'react';
import type { Mesh } from 'three';
import { Color, PerspectiveCamera, Scene, WebGLRenderTarget } from 'three';
import Fonts from '../fonts';
import { KineticMaterial } from './KineticMaterial';

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

export function OOOFFFScene(props: MeshProps) {
  const { camera, mesh, scene, texture } = useRenderTargetTexture();
  const { repeats } = useControls({
    repeats: {
      label: 'Repeats',
      value: 1,
      min: 1,
      max: 6,
      step: 1,
    },
  });

  return (
    <>
      <perspectiveCamera
        ref={camera}
        fov={75}
        aspect={1}
        near={1}
        far={20}
        position={[0, 0, 5]}
      />

      <Plane args={[6, 6]} attach="geometry" ref={mesh}>
        <KineticMaterial map={texture} repeats={repeats} />
      </Plane>

      {scene &&
        createPortal(
          <Text
            color={0xffffff}
            font={Fonts['Cabinet Grotesk']}
            fontSize={1.5}
            lineHeight={0}
          >
            OF
          </Text>,
          scene
        )}

      <OrbitControls />
    </>
  );
}
