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

const DEFAULT_GEOMETRY = 'Torus';
const LIGHT_POSITION_LIMIT = 30;

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
  const [activeComponent, setActiveComponent] = useState(DEFAULT_GEOMETRY);
  const isRoundedBoxActive = activeComponent === 'RoundedBox';
  const [useDistortion, setUseDistortion] = useState(true);
  const [rotationX, setRotationX] = useState(true);
  const [rotationY, setRotationY] = useState(true);
  const [rotationZ, setRotationZ] = useState(true);
  const [useLight, setUseLight] = useState(true);
  const [useTextAnimation, setUseTextAnimation] = useState(true);
  const [wireframe, showWireframe] = useState(true);
  const [speed, setSpeed] = useState(1);
  const {
    amplitude,
    bgColor,
    boxRoundness,
    fontSize,
    frequency,
    geometryDetail,
    geometrySize,
    lightPosition,
    materialColor,
    repeats,
    shininess,
    text,
    textColor,
    textSpeed,
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
      {
        collapsed: false,
        color: 'gold',
      }
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
      {
        collapsed: false,
        color: 'deeppink',
      }
    ),

    'Text Animation': folder(
      {
        Animate: {
          value: !useTextAnimation,
          onChange: () => setUseTextAnimation((state) => !state),
        },
        textSpeed: {
          label: 'Speed',
          min: 0.01,
          max: 1.0,
          step: 0.01,
          value: 0.5,
        },
      },
      {
        collapsed: false,
        color: 'aqua',
      }
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
      {
        collapsed: false,
        color: 'aquamarine',
      }
    ),

    Light: folder(
      {
        'Use Light': {
          value: !useLight,
          onChange: () => setUseLight((state) => !state),
        },

        shininess: {
          label: 'Shininess',
          min: 1.0,
          max: 10.0,
          step: 1.0,
          value: 1.0,
        },

        lightPosition: {
          label: 'Light Position',
          value: {
            x: LIGHT_POSITION_LIMIT / 2,
            y: LIGHT_POSITION_LIMIT / 2,
            z: LIGHT_POSITION_LIMIT / 2,
          },
          x: { min: -LIGHT_POSITION_LIMIT, max: LIGHT_POSITION_LIMIT, step: 1 },
          y: { min: -LIGHT_POSITION_LIMIT, max: LIGHT_POSITION_LIMIT, step: 1 },
          z: { min: -LIGHT_POSITION_LIMIT, max: LIGHT_POSITION_LIMIT, step: 1 },
        },
      },
      {
        collapsed: false,
        color: 'violet',
      }
    ),

    Roundness: folder(
      {
        boxRoundness: {
          disabled: !isRoundedBoxActive,
          label: 'Box Roundness',
          min: 0.1,
          max: 1,
          step: 0.1,
          value: 0.1,
        },
      },
      {
        collapsed: true,
        color: 'coral',
      }
    ),

    Wireframe: folder(
      {
        'Show Wireframe': {
          value: !wireframe,
          onChange: () => showWireframe((state) => !state),
        },
      },
      {
        collapsed: true,
        color: 'deepskyblue',
      }
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
      uAmplitude={amplitude.toFixed(1)}
      uColor={new Color(materialColor)}
      uFrequency={frequency.toFixed(1)}
      uLightPosition={lightPosition}
      uRepeats={repeats}
      uShininess={shininess}
      uTextSpeed={textSpeed}
      uTexture={texture}
      uUseDistortion={useDistortion}
      uUseLight={useLight}
      uUseTextAnimation={useTextAnimation}
      wireframe={wireframe}
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

      <directionalLight
        castShadow
        color={0xffffff}
        intensity={1.0}
        position={[-1, 2, -1]}
      />

      <SwitchGeometry active={activeComponent}>
        <Box
          args={[geometrySize, geometrySize, geometrySize]}
          name="Box"
          receiveShadow
          ref={mesh}
        >
          {material}
        </Box>

        <Circle
          args={[geometryRadius, geometryDetail]}
          name="Circle"
          receiveShadow
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
          receiveShadow
          ref={mesh}
        >
          {material}
        </Cylinder>

        <Icosahedron
          args={[geometryRadius, geometryDetail]}
          name="Icosahedron"
          receiveShadow
          ref={mesh}
        >
          {material}
        </Icosahedron>

        <Octahedron
          args={[geometryRadius, geometryDetail]}
          name="Octahedron"
          receiveShadow
          ref={mesh}
        >
          {material}
        </Octahedron>

        <Plane
          args={[geometrySize, geometrySize]}
          name="Plane"
          receiveShadow
          ref={mesh}
        >
          {material}
        </Plane>

        <RoundedBox
          args={[geometrySize, geometrySize, geometrySize]}
          name="RoundedBox"
          radius={boxRoundness}
          receiveShadow
          smoothness={4}
          ref={mesh}
        >
          {material}
        </RoundedBox>

        <Sphere
          args={[geometryRadius, geometryDetail, geometryDetail]}
          name="Sphere"
          receiveShadow
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
          castShadow
          name="Torus"
          receiveShadow
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
