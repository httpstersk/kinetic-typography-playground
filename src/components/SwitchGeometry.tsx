import React from 'react';

type PropsWithChildren<P> = P & { children?: React.ReactNode };
type ComponentProps = PropsWithChildren<{ active: string }>;

const SwitchGeometry: React.FC<ComponentProps> = ({ active, children }) => {
  return React.Children.toArray(children).filter(
    (node: any) => node?.props.name == active
  );
};

export default SwitchGeometry;
