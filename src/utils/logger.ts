import { LOCAL_DEVELOPMENT_MODE } from '@/constants/env';

/* eslint-disable no-console */
const NODE_CONSOLE_COLORS = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',

  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',
  FgGray: '\x1b[90m',

  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m',
  BgGray: '\x1b[100m',
};

export const apiLogger = async ({
  url,
  fetchOptions,
  extraOptions = { format: true, throwError: true },
  response = undefined,
  error = undefined,
  logResponse = false,
}: {
  url: string;
  fetchOptions: RequestInit;
  extraOptions: { format?: boolean; throwError?: boolean };
  response?: Response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  logResponse?: boolean;
}) => {
  if (!LOCAL_DEVELOPMENT_MODE) return;
  const lineBreak = '----------------------\n';
  const time = Date.now();
  const timeStr = new Date(time).toLocaleString();
  console.log(
    `${NODE_CONSOLE_COLORS.FgGray}[%s] ${NODE_CONSOLE_COLORS.FgGreen}%s ${NODE_CONSOLE_COLORS.FgBlue}%s ${NODE_CONSOLE_COLORS.Reset}`,
    timeStr,
    fetchOptions.method ?? 'GET',
    url
  );
  if (fetchOptions?.body) {
    console.log(
      `${NODE_CONSOLE_COLORS.BgMagenta}%s${NODE_CONSOLE_COLORS.Reset} ${NODE_CONSOLE_COLORS.FgMagenta}%s${NODE_CONSOLE_COLORS.Reset}`,
      ' REQUEST BODY ',
      fetchOptions.body
    );
  }
  if (response) {
    const statusBG = response.ok
      ? NODE_CONSOLE_COLORS.BgGreen
      : NODE_CONSOLE_COLORS.BgRed;
    const statusFG = response.ok
      ? NODE_CONSOLE_COLORS.FgGreen
      : NODE_CONSOLE_COLORS.FgRed;
    console.log(
      `${statusBG}%s${NODE_CONSOLE_COLORS.Reset} ${statusFG}%s${NODE_CONSOLE_COLORS.Reset}`,
      ' STATUS CODE ',
      response.status
    );

    if (logResponse || !response.ok) {
      let data;
      try {
        data = await response.json();
      } catch (err) {
        data = null;
      }
      console.log(
        `${statusBG}%s${NODE_CONSOLE_COLORS.Reset}\n\n%s\n`,
        ' RESPONSE ',
        JSON.stringify(data, undefined, 4)
      );
    }
  }

  console.log(lineBreak);
};
