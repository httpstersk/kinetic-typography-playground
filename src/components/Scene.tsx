import {
  Box,
  Circle,
  Cylinder,
  Icosahedron,
  Octahedron,
  Plane,
  RoundedBox,
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
  const [rotationX, setRotationX] = useState(true);
  const [rotationY, setRotationY] = useState(true);
  const [rotationZ, setRotationZ] = useState(true);
  const [useShadow, setUseShadow] = useState(true);
  const [speed, setSpeed] = useState(1);
  const {
    amplitude,
    bgColor,
    borderRadius,
    fontSize,
    frequency,
    geometryDetail,
    geometrySize,
    materialColor,
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
        'Octahedron',
        'Plane',
        'RoundedBox',
        'Sphere',
        'Torus',
      ],
      onChange: setActiveComponent,
    },

    text: {
      label: 'Text',
      type: LevaInputs.STRING,
      value: 'Idea',
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

    Border: folder(
      {
        borderRadius: {
          label: 'Border Radius',
          min: 0.1,
          max: 1,
          step: 0.1,
          value: 0.1,
        },
      },
      { collapsed: false }
    ),

    Colors: folder(
      {
        textColor: {
          label: 'Text Color',
          value: '#fff',
        },

        materialColor: {
          label: 'Material Color',
          value: '#000',
        },

        bgColor: {
          label: 'Background',
          value: '#000',
        },
      },
      { collapsed: false }
    ),

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
        'Rotation X': {
          value: !rotationX,
          onChange: () => setRotationX((state) => !state),
        },

        'Rotation Y': {
          value: !rotationY,
          onChange: () => setRotationY((state) => !state),
        },

        'Rotation Z': {
          value: !rotationZ,
          onChange: () => setRotationZ((state) => !state),
        },

        Speed: buttonGroup({
          '0.25x': () => setSpeed(0.25),
          '0.5x': () => setSpeed(0.5),
          '1x': () => setSpeed(1),
          '2x': () => setSpeed(2),
          '3x': () => setSpeed(3),
        }),
      },
      { collapsed: true }
    ),

    Shadow: folder(
      {
        'Use Shadow': {
          value: !useShadow,
          onChange: () => setUseShadow((state) => !state),
        },
      },
      { collapsed: true }
    ),
  });

  const { camera, mesh, scene, texture } = useRenderTargetTexture();

  useFrame(({ clock, gl }) => {
    if (mesh.current) {
      const time = clock.getElapsedTime();

      if (bgColor) {
        gl.setClearColor(bgColor);
      }

      if (rotationX) {
        mesh.current.rotation.x = time * speed;
      }

      if (rotationY) {
        mesh.current.rotation.y = time * speed;
      }

      if (rotationZ) {
        mesh.current.rotation.z = time * speed;
      }
    }
  });

  const geometryRadius = geometrySize / 2;

  const material = (
    <KineticMaterial
      amplitude={amplitude.toFixed(1)}
      color={materialColor}
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

        <Octahedron
          args={[geometryRadius, geometryDetail]}
          name="Octahedron"
          ref={mesh}
        >
          {material}
        </Octahedron>

        <Plane args={[geometrySize, geometrySize]} name="Plane" ref={mesh}>
          {material}
        </Plane>

        <RoundedBox
          args={[geometrySize, geometrySize, geometrySize]}
          name="RoundedBox"
          radius={borderRadius}
          smoothness={4}
          ref={mesh}
        >
          {material}
        </RoundedBox>

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
