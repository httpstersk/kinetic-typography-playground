import {
  Box,
  Circle,
  Cylinder,
  Icosahedron,
  Plane,
  Sphere,
  Text,
  Torus,
} from '@react-three/drei';
import { createPortal, MeshProps, useFrame } from '@react-three/fiber';
import { buttonGroup, folder, LevaInputs, useControls } from 'leva';
import React, { useMemo, useRef, useState } from 'react';
import type { Mesh } from 'three';
import {
  Color,
  PerspectiveCamera,
  Scene as THREEScene,
  WebGLRenderTarget,
} from 'three';
import Fonts from '../fonts';
import { KineticMaterial } from './KineticMaterial';
import SwitchGeometry from './SwitchGeometry';

function useRenderTargetTexture() {
  const camera = useRef<PerspectiveCamera>();
  const mesh = useRef<Mesh>();

  const [scene, target] = useMemo(() => {
    const scene = new THREEScene();
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

export const Scene = (props: MeshProps) => {
  const [activeComponent, setActiveComponent] = useState('Torus');
  const [useDistortion, setUseDistortion] = useState(true);
  const [rotation, setRotation] = useState(true);
  const [useShadow, setUseShadow] = useState(true);
  const [speed, setSpeed] = useState(1);
  const { camera, mesh, scene, texture } = useRenderTargetTexture();
  const {
    amplitude,
    fontSize,
    frequency,
    geometryDetail,
    geometrySize,
    repeats,
    text,
    textColor,
  } = useControls({
    Geometry: {
      value: activeComponent,
      options: [
        'Box',
        'Circle',
        'Cylinder',
        'Icosahedron',
        'Plane',
        'Sphere',
        'Torus',
      ],
      onChange: setActiveComponent,
    },

    text: {
      label: 'Text',
      type: LevaInputs.STRING,
      value: 'Create',
    },

    textColor: {
      label: 'Text Color',
      value: '#fff',
    },

    fontSize: {
      label: 'Font Size',
      min: 0.1,
      max: 6,
      step: 0.1,
      value: 1,
    },

    geometryDetail: {
      label: 'Geometry Details',
      min: 3,
      max: 64,
      step: 1,
      value: 32,
    },

    geometrySize: {
      label: 'Geometry Size',
      min: 1,
      max: 10,
      step: 0.1,
      value: 3,
    },

    repeats: {
      label: 'Repeats',
      value: { x: 3, y: 3 },
      x: { min: 1, step: 1 },
      y: { min: 1, step: 1 },
    },

    Distortion: folder(
      {
        'Use Distortion': {
          value: !useDistortion,
          onChange: () => setUseDistortion((state) => !state),
        },

        amplitude: {
          label: 'Amplitude',
          min: 0.1,
          max: 6,
          step: 0.1,
          value: 1.0,
        },

        frequency: {
          label: 'Frequency',
          min: 0.1,
          max: 6,
          step: 0.1,
          value: 1.0,
        },
      },
      { collapsed: false }
    ),

    Rotation: folder(
      {
        'Use Rotation': {
          value: !rotation,
          onChange: () => setRotation((state) => !state),
        },

        Speed: buttonGroup({
          '0.25x': () => setSpeed(0.25),
          '0.5x': () => setSpeed(0.5),
          '1x': () => setSpeed(1),
          '2x': () => setSpeed(2),
          '3x': () => setSpeed(3),
        }),
      },
      { collapsed: false }
    ),

    Shadow: folder(
      {
        'Use Shadow': {
          value: !useShadow,
          onChange: () => setUseShadow((state) => !state),
        },
      },
      { collapsed: false }
    ),
  });

  useFrame(({ clock }) => {
    if (mesh.current) {
      if (rotation) {
        mesh.current.rotation.y = clock.getElapsedTime() * speed;
      }
    }
  });

  const geometryRadius = geometrySize / 2;

  const material = (
    <KineticMaterial
      amplitude={amplitude.toFixed(1)}
      frequency={frequency.toFixed(1)}
      repeats={repeats}
      texture={texture}
      useDistortion={useDistortion}
      useShadow={useShadow}
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
        <Box
          args={[geometrySize, geometrySize, geometrySize]}
          name="Box"
          ref={mesh}
        >
          {material}
        </Box>

        <Circle
          args={[geometryRadius, geometryDetail]}
          name="Circle"
          ref={mesh}
        >
          {material}
        </Circle>

        <Cylinder
          args={[
            geometryRadius,
            geometryRadius,
            geometryRadius * 2,
            geometryDetail,
          ]}
          name="Cylinder"
          ref={mesh}
        >
          {material}
        </Cylinder>

        <Icosahedron
          args={[geometryRadius, geometryDetail]}
          name="Icosahedron"
          ref={mesh}
        >
          {material}
        </Icosahedron>

        <Plane args={[geometrySize, geometrySize]} name="Plane" ref={mesh}>
          {material}
        </Plane>

        <Sphere
          args={[geometryRadius, geometryDetail, geometryDetail]}
          name="Sphere"
          ref={mesh}
        >
          {material}
        </Sphere>

        <Torus
          args={[
            geometryRadius,
            geometrySize / 4,
            geometryDetail,
            geometryDetail * 2,
          ]}
          name="Torus"
          ref={mesh}
        >
          {material}
        </Torus>
      </SwitchGeometry>

      {scene &&
        createPortal(
          <Text
            color={textColor}
            font={Fonts['Cabinet Grotesk']}
            fontSize={fontSize}
          >
            {text.toUpperCase()}
          </Text>,
          scene
        )}
    </>
  );
};
