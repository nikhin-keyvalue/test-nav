'use server';

import { JwtDecode } from '@AM-i-B-V/jwt-decoder';
import { JWTPayload, JWTVerifyResult } from 'jose';
import { cookies } from 'next/headers';

import {
  AWS_JWE_PRIVATE_KEY_SECRET_NAME,
  AWS_REGION,
  META_FACTORY_BASE_URL,
} from '@/constants/env';

const jwtDecoder = new JwtDecode(
  META_FACTORY_BASE_URL!,
  AWS_REGION!,
  AWS_JWE_PRIVATE_KEY_SECRET_NAME!
);

type tokenKeyType = 'tenantId' | 'userId' | 'userRoles' | 'tenantUserIdHeader';

type decodedValueType<T extends tokenKeyType> = T extends 'tenantUserIdHeader'
  ? object
  : string;

export const verifyToken = async (
  token: string
): Promise<JWTVerifyResult<JWTPayload> | null> => {
  const verifyResponse = await jwtDecoder.verifyToken(token);
  return verifyResponse;
};

export const getDecryptedToken = async (encryptedToken: string) => {
  const decryptedToken = await jwtDecoder.decryptToken(encryptedToken);
  return decryptedToken;
};

const getEncryptedToken = async () => {
  try {
    const cookieStore = cookies();
    const encryptedToken = cookieStore.get('webdealerami')?.value;
    if (encryptedToken) return encryptedToken;
    throw Error();
  } catch (error) {
    throw new Error('401: Unauthorized', { cause: { status: 401 } });
  }
};

export async function getTokenDecodedValues<T extends tokenKeyType>(key: T) {
  const encryptedToken = await getEncryptedToken();
  if (encryptedToken) {
    switch (key) {
      case 'tenantId': {
        const tenantId = await jwtDecoder.getTenantId(encryptedToken);
        return tenantId as decodedValueType<T>;
      }

      case 'userId': {
        const userId = await jwtDecoder.getUserId(encryptedToken);
        return userId as decodedValueType<T>;
      }

      case 'userRoles': {
        const userRoles = await jwtDecoder.getUserRoles(encryptedToken);
        return userRoles as decodedValueType<T>;
      }

      case 'tenantUserIdHeader': {
        const tenantUserIdHeader =
          await jwtDecoder.getTenantAndUserIdHeader(encryptedToken);
        return tenantUserIdHeader as decodedValueType<T>;
      }

      default:
        return '' as decodedValueType<T>;
    }
  }
  return '' as decodedValueType<T>;
}
