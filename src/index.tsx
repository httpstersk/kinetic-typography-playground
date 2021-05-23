import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Scene } from './components/Scene';

function App() {
  return (
    <Canvas shadows>
      <Suspense fallback={null}>
        <Scene position={[0, 0, 0]} />
      </Suspense>

      <OrbitControls />
    </Canvas>
  );
}

ReactDOM.render(<App />, document.getElementById('playground'));
