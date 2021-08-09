// import {calculateExpectedSeig} from 'tokamak-staking-lib';
// import {getTokamakContract} from 'utils/contract';
// import {BASE_PROVIDER, DEPLOYED} from 'constants/index';
// //@ts-ignore
// import {toBN, BN} from 'web3-utils';
// import {Contract} from '@ethersproject/contracts';
// import * as AutoRefactorCoinageABI from 'services/abis/AutoRefactorCoinage.json';
// import * as TonABI from 'services/abis/TON.json';

type GetEarnedTon = {
  contractAddress: string;
  library: any;
};

export const getEarnedTon = async ({
  contractAddress,
  library,
}: GetEarnedTon) => {
  return null;
  // if (library === undefined) {
  //   return;
  // }
  // const SeigManager = getTokamakContract('SeigManager', library);
  // const currentBlockNumber = await BASE_PROVIDER.getBlockNumber();
  // const {TokamakLayer2_ADDRESS, TON_ADDRESS, WTON_ADDRESS} = DEPLOYED;
  // const TON_CONTRACT = new Contract(TON_ADDRESS, TonABI.abi, library);
  // const Tot_ADDRESS = await SeigManager.tot();
  // const Tot = new Contract(Tot_ADDRESS, AutoRefactorCoinageABI.abi, library);

  // const [tonTotalSupply, totTotalSupply, tonBalanceOfWTON] = await Promise.all([
  //   TON_CONTRACT.totalSupply(),
  //   Tot.totalSupply(),
  //   TON_CONTRACT.balanceOf(WTON_ADDRESS),
  // ]);

  // const tos = toBN(tonTotalSupply)
  //   .mul(toBN('1000000000'))
  //   .add(toBN(totTotalSupply))
  //   .sub(toBN(tonBalanceOfWTON));

  // const COINAGE_ADDRESS = await SeigManager.coinages(TokamakLayer2_ADDRESS);
  // const COINAGE_CONTRACT = new Contract(
  //   COINAGE_ADDRESS,
  //   AutoRefactorCoinageABI.abi,
  //   library,
  // );

  // const totalStaked = await COINAGE_CONTRACT.balanceOf(contractAddress);

  // try {
  //   const seigniorage = calculateExpectedSeig(
  //     new BN(
  //       await SeigManager.lastCommitBlock(TokamakLayer2_ADDRESS).toString(),
  //     ),
  //     new BN(currentBlockNumber.toString()),
  //     new BN(totalStaked.toString()),
  //     new BN(await Tot.totalSupply().toString()),
  //     new BN(tos.toString()),
  //     new BN(await SeigManager.relativeSeigRate().toString()),
  //   );
  // } catch (e) {
  //   console.log(e);
  // }
};
