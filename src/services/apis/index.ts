import {API_URL} from 'utils';
import {sleep} from 'utils/sleep';

type Options = {
  method: 'POST' | 'GET' | 'DELETE' | 'PUT';
  token?: string;
  headers?: {[key: string]: string};
  body?: object;
  timeout?: number;
};

export const fetchAPI = (
  uri: string,
  {method, headers, body, token, timeout = 8000}: Options,
) => {
  const abortController =
    // eslint-disable-next-line no-undef
    typeof AbortController !== 'undefined' && new AbortController();

  return Promise.race([
    /**
     * handle timeout
     */
    sleep(timeout).then(() => {
      if (abortController) {
        setTimeout(() => abortController.abort(), 0);
      }
      const error = new Error('request timeout');
      throw error;
    }),

    fetch(API_URL + uri, {
      method,
      headers: {
        ...(headers || {}),
        accept: 'application/json',
        ...(body && {'content-type': 'application/json'}),
        ...(token && {authorization: `Bearer ${token}`}),
      },
      body: JSON.stringify(body),
      ...(abortController && {signal: abortController.signal}),
    }).then(async res => {
      const contentType = res.headers.get('content-type');
      if (res.ok) {
        if (contentType && contentType.indexOf('application/json') !== -1) {
          return res.json();
        }
        return res.text();
      }

      const error = new Error(res.statusText);

      try {
        const data = await res.text();

        // @ts-ignore
        error.body = JSON.parse(data);
      } catch (parsingErr) {
        // we can ignore the parsing error here
        // it was just about trying to parse the error after all
      }

      throw error;
    }),
  ]);
};
