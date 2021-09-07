type Token = {
  name: string;
  address: {
    [key: number]: string;
  };
  decimals: number;
};

type Tokens = {
  [key: string]: Token;
};

export const tokens: Tokens = {
  TON: {
    name: 'TON',
    address: {
      1: '0x2be5e8c109e2197d077d13a82daead6a9b3433c5',
      4: '',
    },
    decimals: 18,
  },
  WTON: {
    name: 'WTON',
    address: {
      1: '0xc4A11aaf6ea915Ed7Ac194161d2fC9384F15bff2',
      4: '0x709bef48982bbfd6f2d4be24660832665f53406c',
    },
    decimals: 27,
  },
  TOS: {
    name: 'TOS',
    address: {
      1: '0x409c4D8cd5d2924b9bc5509230d16a61289c8153',
      4: '0x73a54e5c054aa64c1ae7373c2b5474d8afea08bd',
    },
    decimals: 18,
  },
};
