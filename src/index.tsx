import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { OOOFFFScene } from './components/Scene';

function App() {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <OOOFFFScene position={[0, 0, 0]} />
      </Suspense>

      <OrbitControls />
    </Canvas>
  );
}

ReactDOM.render(<App />, document.getElementById('ooofff'));
