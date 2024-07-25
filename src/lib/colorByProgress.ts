const colorByProgress = (amount: number) => {
  if (amount >= 80) {
    return '#6E9C6D';
  }
  if (amount >= 60) {
    return '#323C49';
  }
  return '#DA212C';
};

export default colorByProgress;
