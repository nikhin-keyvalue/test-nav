import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const ProgressBar = ({
  progress,
  color,
  className,
  testId,
}: {
  progress: number;
  color?: string;
  testId?: string;
  className?: string;
}) => (
  <div
    data-testid={testId}
    className={twMerge('h-2 w-full rounded bg-[#DEE0E2]', className)}
  >
    <motion.div
      className={`h-full w-1/2 ${progress >= 95 ? 'rounded' : 'rounded-l'}`}
      animate={{ width: `${progress}%`, backgroundColor: color }}
      initial={{ backgroundColor: color, width: '0%' }}
    />
  </div>
);

export default ProgressBar;
