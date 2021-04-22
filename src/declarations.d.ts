declare module '*.glsl' {
  const value: string; // Add better type definitions here if desired.
  export default value;
}

declare module JSX {
  interface IntrinsicElements {
    kineticMaterial: any;
    kineticMaterialImpl: KineticMaterialType;
  }
}
