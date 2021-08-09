import {calculateExpectedSeig} from 'tokamak-staking-lib';
import {getTokamakContract} from 'utils/contract';
import {BASE_PROVIDER, DEPLOYED} from 'constants/index';
//@ts-ignore
import {toBN, BN} from 'web3-utils';
import {Contract} from '@ethersproject/contracts';
import * as AutoRefactorCoinageABI from 'services/abis/AutoRefactorCoinage.json';
import * as TonABI from 'services/abis/TON.json';
import {BigNumber} from '@ethersproject/units/node_modules/@ethersproject/bignumber';
import web3 from 'web3';

type GetEarnedTon = {
  contractAddress: string;
  library: any;
};

export const getEarnedTon = async ({
  contractAddress,
  library,
}: GetEarnedTon) => {
  const SeigManager = getTokamakContract('SeigManager', library);
  const currentBlockNumber = await BASE_PROVIDER.getBlockNumber();
  const {TokamakLayer2_ADDRESS, TON_ADDRESS, WTON_ADDRESS} = DEPLOYED;
  const TON_CONTRACT = new Contract(TON_ADDRESS, TonABI.abi, library);
  const Tot_ADDRESS = await SeigManager.tot();
  const Tot = new Contract(Tot_ADDRESS, AutoRefactorCoinageABI.abi, library);

  const [tonTotalSupply, totTotalSupply, tonBalanceOfWTON] = await Promise.all([
    TON_CONTRACT.totalSupply(),
    Tot.totalSupply(),
    TON_CONTRACT.balanceOf(WTON_ADDRESS),
  ]);

  const tos = toBN(tonTotalSupply)
    .mul(toBN('1000000000'))
    .add(toBN(totTotalSupply))
    .sub(toBN(tonBalanceOfWTON));

  const COINAGE_ADDRESS = await SeigManager.coinages(TokamakLayer2_ADDRESS);
  const COINAGE_CONTRACT = new Contract(
    COINAGE_ADDRESS,
    AutoRefactorCoinageABI.abi,
    library,
  );

  const totalStaked = await COINAGE_CONTRACT.balanceOf(contractAddress);

  console.log('***');
  console.log(await SeigManager.lastCommitBlock(TokamakLayer2_ADDRESS));
  console.log(currentBlockNumber);
  console.log(totalStaked);
  console.log(await Tot.totalSupply());
  console.log(tos);
  console.log(await SeigManager.relativeSeigRate());

  try {
    const seigniorage = calculateExpectedSeig(
      new BN(await SeigManager.lastCommitBlock(TokamakLayer2_ADDRESS)),
      new BN(currentBlockNumber),
      new BN(totalStaked),
      new BN(await Tot.totalSupply()),
      new BN(tos),
      new BN(await SeigManager.relativeSeigRate()),
    );
    console.log(seigniorage);
  } catch (e) {
    console.log(e);
  }
};
