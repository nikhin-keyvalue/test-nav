import React from 'react';

const If = ({
  condition,
  children,
}: {
  condition: boolean;
  children: React.ReactNode;
}) => (condition ? children : null);

export default If;
