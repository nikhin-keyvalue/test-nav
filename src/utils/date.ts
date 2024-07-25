import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const getDateinDayjs = (date: string | undefined) => {
  if (date) return dayjs(date);
  return null;
};

export type GetCurrentDateReturn = {
  date: Date | string;
};

export const getCurrentDate = ({
  formatToISOString = false,
}: {
  formatToISOString?: boolean;
}): GetCurrentDateReturn => {
  if (formatToISOString) {
    return { date: new Date().toISOString() };
  }
  return { date: new Date() };
};

export const combineDateAndTime = (
  date: Dayjs,
  time: Dayjs,
  needTimeInUtc: boolean = true
): Dayjs => {
  const formattedDate = `${date.format('YYYY-MM-DD')}T${time.format(
    'HH:mm:ss'
  )}Z`;

  const localDate = dayjs(formattedDate);
  if (needTimeInUtc)
    return localDate.subtract(localDate.utcOffset(), 'minutes');
  return localDate;
};

export const formatDate = (date: string | undefined, format = 'DD MMM YYYY') =>
  dayjs(date).format(format);

export const formatDateTimeRange = (
  startDateTime?: string,
  endDateTime?: string
) => {
  const start = dayjs.utc(startDateTime).local();

  const end = dayjs.utc(endDateTime).local();

  return {
    start,
    end,
    formatted: `${start.format('ddd DD MMM YYYY • HH:mm')} - ${end.format(
      'HH:mm'
    )}`,
  };
};

export const convertDateFormat = (
  value?: string,
  formatOptions?: Intl.DateTimeFormatOptions,
  showTime: boolean = false
) => {
  if (!value) return '';
  const dateValue = new Date(value);

  const options: Intl.DateTimeFormatOptions = formatOptions || {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  if (showTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return dateValue.toLocaleString('en-GB', options).replace(/,/g, ' ');
};

export const dateDifferenceInDays = (first: Date, second: Date) =>
  Math.abs(
    Math.round((second.valueOf() - first.valueOf()) / (1000 * 60 * 60 * 24))
  );

export const getDateFromDateTime = (date?: string | Dayjs) =>
  typeof date === 'string'
    ? formatDate(date as string, 'YYYY-MM-DD')
    : date?.format('YYYY-MM-DD');

export const minutesToTime = (timeInMinutes?: number) => {
  if (timeInMinutes === undefined) {
    return { days: 0, hours: 0, minutes: 0 };
  }
  if (timeInMinutes <= 0) {
    return { days: 0, hours: 0, minutes: 0 };
  }
  const minutes = timeInMinutes % 60;
  const hours = Math.floor(timeInMinutes / 60) % 24;
  const days = Math.floor(timeInMinutes / (60 * 24));

  return { days, hours, minutes };
};

export const convertDateFormatToDDMMYYYY = (dateString: string) => {
  // Convert date from format YYYY-MM-DD to DD/MM/YYYY

  // Split the input date string into an array [YYYY, MM, DD]
  const [year, month, day] = dateString.split('-');

  // Return the formatted date string in DD/MM/YYYY format
  return `${day}/${month}/${year}`;
};
