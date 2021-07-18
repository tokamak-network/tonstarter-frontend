import {getContract} from 'utils/contract';
import * as IERC20 from 'services/abis/IERC20.json';

type EthAddressType = '0x0000000000000000000000000000000000000000';
type TonAddressType = '0x44d4F5d89E9296337b8c48a332B3b2fb2C190CD0';

type TokenAddressTypes = EthAddressType | TonAddressType;
type TokenTypes = 'eth' | 'ton';

type MainArgsType = {
  addresses: string[];
  cap: string;
  payToken: EthAddressType | TonAddressType;
  library: any;
  stakeVault: any;
};

type CheckedBalanceType = {
  address: string;
  balance: number;
};

interface CheckedBlockType extends CheckedBalanceType {
  startBlock: number;
  endBlock: number;
  blockDiff: number;
}

interface checkedEPBType extends CheckedBlockType {
  epb: number;
}

const tokenAddresses: {eth: EthAddressType; ton: TonAddressType} = {
  eth: '0x0000000000000000000000000000000000000000',
  ton: '0x44d4F5d89E9296337b8c48a332B3b2fb2C190CD0',
};

const dividePeriod = (
  sortedProjects: CheckedBlockType[],
  earningPerblock: number,
  totalBlocks: number,
): checkedEPBType[] => {
  const result: checkedEPBType[] = [];
  let tempTotalBlocks = totalBlocks;
  for (let i = 0; i < sortedProjects.length; i++) {
    const eachEarningPerblock =
      earningPerblock /
      (sortedProjects[i].blockDiff * (sortedProjects.length - i));
    tempTotalBlocks -=
      sortedProjects[i].blockDiff * (sortedProjects.length - i);
    result.push({
      ...sortedProjects[i],
      epb: eachEarningPerblock * sortedProjects[i].blockDiff,
    } as checkedEPBType);
  }
  if (tempTotalBlocks !== 0) {
    throw new Error(
      `Something wrong in calculating APY process(func: dividePeriod)`,
    );
  }
  return result;
};

const getEarningPerBlock = async (args: CheckedBlockType[], cap: string) => {
  const numCap = Number(cap);
  const totalBlocks: number = args.reduce((acc, cur) => acc + cur.blockDiff, 0);
  const earningPerBlock: number = numCap / totalBlocks;
  const sortedProjects = args.sort((a, b) => a.blockDiff - b.blockDiff);
  const dividedEarningPerBlocks = dividePeriod(
    sortedProjects,
    earningPerBlock,
    totalBlocks,
  );
  return dividedEarningPerBlocks;
  // let blocks: number = 0
};

const getBlocks = async (
  args: CheckedBalanceType[],
  stakeVault: any,
): Promise<CheckedBlockType[]> => {
  const result: CheckedBlockType[] = [];
  await Promise.all(
    args.map(async (e) => {
      const address = e.address;
      const info = await stakeVault.stakeInfos(address);
      const startBlock = Number(info.startBlcok.toString());
      const endBlock = Number(info.endBlock.toString());
      result.push({
        ...e,
        startBlock,
        endBlock,
        blockDiff: endBlock - startBlock,
      } as CheckedBlockType);
    }),
  );
  return result;
};

const getBalance = async (
  addresses: string[],
  tokenType: TokenTypes,
  library: any,
): Promise<CheckedBalanceType[] | []> => {
  const result: CheckedBalanceType[] = [];
  await Promise.all(
    addresses.map(async (address) => {
      switch (tokenType) {
        case 'eth':
          // const ethContract = getContract(
          //   tokenAddresses['eth'],
          //   IERC20.abi,
          //   library,
          // );
          // const ethStakingBalance = await ethContract.balanceOf(address);

          break;
        case 'ton':
          const tonContract = getContract(
            tokenAddresses['ton'],
            IERC20.abi,
            library,
          );
          const tonStakingBalance = await tonContract.balanceOf(address);
          const strTonStakingBalance = tonStakingBalance.toString();
          const numTonStakingBalance = Number(strTonStakingBalance);
          if (numTonStakingBalance === 0) {
            return;
          }
          return result.push({
            address: address,
            balance: numTonStakingBalance,
          } as CheckedBalanceType);
        default:
          throw new Error(`There is no token type for ${tokenType}`);
      }
    }),
  );
  return result;
};

const checkTokenType = (payToken: TokenAddressTypes): TokenTypes => {
  const tokenType = payToken === tokenAddresses['eth'] ? 'eth' : 'ton';
  switch (tokenType) {
    case 'eth':
      return 'eth';
    case 'ton':
      return 'ton';
    default:
      throw new Error(`There is no token type for ${tokenType}`);
  }
};

export const calculateApy = async (mainArgs: MainArgsType) => {
  const {addresses, cap, payToken, library, stakeVault} = mainArgs;
  const tokenType = checkTokenType(payToken);
  const balances = await getBalance(addresses, tokenType, library);

  //Can't calculate reward cuz every project's balance is 0
  //Means nobody stakes to every projects
  if (balances.length === 0) {
    throw new Error(`any no staking balance for ${addresses}`);
  }

  const blocks = await getBlocks(balances, stakeVault);
  const earningPerBlock = await getEarningPerBlock(blocks, cap);

  return earningPerBlock;
};
