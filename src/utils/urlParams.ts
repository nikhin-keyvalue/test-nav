import { parse } from 'url';

export const buildParams = (
  urlParams: URLSearchParams,
  key: string,
  value: string[] | string
) => {
  if (!value?.length) {
    urlParams.delete(key);
  } else {
    urlParams.set(key, value.toString());
  }
  return urlParams;
};

export const parseUrlQueryParams = (url: string) => {
  const parsedUrl = parse(`?${url}`, true);
  const queryParams = parsedUrl.query;
  return queryParams;
};
