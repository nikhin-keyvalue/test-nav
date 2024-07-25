import { getDecryptedToken, verifyToken } from '@/utils/tokenDecodeAction';

export const POST = async (request: Request) => {
  try {
    const { token } = await request.json();
    const decryptedToken = await getDecryptedToken(token);
    const verifiedToken = await verifyToken(decryptedToken);
    return new Response(
      JSON.stringify({
        ...verifiedToken?.payload,
      }),
      {
        status: 200,
      }
    );
  } catch {
    return new Response(null, {
      status: 401,
      statusText: 'Unauthorized: Token verification failed',
    });
  }
};
