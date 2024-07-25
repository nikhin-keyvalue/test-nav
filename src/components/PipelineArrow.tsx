import React from 'react';

const PipelineArrow = ({
  colorOne,
  colorTwo,
}: {
  colorOne: React.CSSProperties['color'];
  colorTwo: React.CSSProperties['color'];
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='26'
    height='56'
    viewBox='0 0 26 56'
    fill='none'
  >
    <path d='M26 56V28V0H7.5L19.5 28L7.5 56H26Z' fill={colorTwo} />
    <path d='M4.5 56L16.5 28L4.5 0H0V28V56H4.5Z' fill={colorOne} />
  </svg>
);

export default PipelineArrow;
