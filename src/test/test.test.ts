import {getToken} from 'pages/Pools/utils/simulator';
import {tryParseTick} from 'pages/Pools/utils/tick';

export declare enum FeeAmount {
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000,
}

test('**GET TOKEN**', async () => {
  const token1 = getToken(4, '0x73a54e5c054aa64c1ae7373c2b5474d8afea08bd', 6);
  const token2 = getToken(4, '0x709bef48982bbfd6f2d4be24660832665f53406c', 6);

  const res = tryParseTick(
    token1,
    token2,
    3000,
    '1000000000000000000000000000',
  );
});
