import { Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';

function App({ children }) {
  return (
    <Canvas concurrent>
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
}

export default App;
