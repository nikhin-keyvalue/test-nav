import { NextRequest } from 'next/server';

export const getCorsHeaders = (
  baseUrl: string,
  origin: string,
  methods: string
) => {
  // Default options
  const headers = {
    'Access-Control-Allow-Methods': methods, // 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': baseUrl,
  };

  let allowedOrigins = [`${process.env.EXTERNAL_BASE_URL}`];
  if (process.env.APP_ENV === 'dev') {
    allowedOrigins = [
      ...allowedOrigins,
      'http://localhost:3000',
      'http://classic.dealer.localhost:9000',
      'http://new.dealer.localhost:3000',
    ];
  }
  // If no allowed origin is set to default server origin
  if (!origin) return headers;

  // Validate server origin
  if (allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  // Return result
  return headers;
};

export const getHeaders = (request: NextRequest, methods: string) =>
  getCorsHeaders(
    request.nextUrl.origin,
    request.headers.get('origin') ?? '',
    methods
  );
