import ReactDOM from 'react-dom';
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OOOFFFScene } from './components/OOOFFFScene';

function App() {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <OOOFFFScene position={[0, 0, 0]} />
      </Suspense>
    </Canvas>
  );
}

ReactDOM.render(<App />, document.getElementById('ooofff'));
