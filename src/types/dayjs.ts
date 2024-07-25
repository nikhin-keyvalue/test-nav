import dayjs from 'dayjs';

export const getDateinDayjs = (date: string | undefined) => {
  if (date) return dayjs(date);
  return null;
};
