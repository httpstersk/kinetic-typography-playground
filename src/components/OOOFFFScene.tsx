import { OrbitControls, Plane, Text } from '@react-three/drei';
import { createPortal, MeshProps, useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import type { Mesh } from 'three';
import { Color, PerspectiveCamera, Scene, WebGLRenderTarget } from 'three';
import Fonts from '../fonts';
import './KineticMaterial';

function useRenderTargetTexture() {
  const camera = useRef<PerspectiveCamera>();
  const mesh = useRef<Mesh>();

  const [scene, target] = useMemo(() => {
    const scene = new Scene();
    scene.background = new Color('#000');
    const { innerHeight, innerWidth } = window;
    const target = new WebGLRenderTarget(innerWidth, innerHeight);
    return [scene, target];
  }, []);

  useFrame(({ clock, gl }) => {
    if (camera.current && mesh.current) {
      gl.setRenderTarget(target);
      gl.render(scene, camera.current);
      gl.setRenderTarget(null);

      mesh.current.material.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return { camera, mesh, scene, texture: target.texture };
}

export function OOOFFFScene(props: MeshProps) {
  const { camera, mesh, scene, texture } = useRenderTargetTexture();

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

      <Plane args={[5, 5]} attach="geometry" ref={mesh}>
        <kineticMaterial attach="material" map={texture} />
      </Plane>

      {scene &&
        createPortal(
          <Text
            color={0xffffff}
            font={Fonts['Raleway']}
            fontSize={2}
            lineHeight={0}
          >
            XO
          </Text>,
          scene
        )}

      <OrbitControls />
    </>
  );
}
