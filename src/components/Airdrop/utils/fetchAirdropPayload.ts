import { getTokamakContract } from '../../../utils/contract';

export const fetchAirdropPayload = async () => {
  const AirdropVault = getTokamakContract('Airdrop');
  
  const tgeCount = await AirdropVault.totalTgeCount();
  let roundInfo: any = [];
  for (let i=1; i <= tgeCount; i++) {
    await Promise.all([
      AirdropVault.getTgeInfos(i)
    ]).then((result) => {
      const airdropInfo = {
        roundNumber: i,
        allocatedAmount: result[0].allocatedAmount.toString(),
        amount: result[0].amount.toString(),
      }
      roundInfo.push(airdropInfo);
    });
  }
  return roundInfo
  // try {
    //   unclaimedInfos = await AirdropVault.unclaimedInfos();
    //   tgeInfo = await AirdropVault.getTgeInfos(1);
    //   totalAmount = await AirdropVault.totalAllocatedAmount();
    //   const tgeCount = await AirdropVault.totalTgeCount();
    //   const startTime = await AirdropVault.startTime();
    //   const periodTimesPerClaim = await AirdropVault.periodTimesPerCliam();
    //   const endTime = await AirdropVault.endTime();
      
    //   console.log(tgeCount.toString())
    //   console.log(totalAmount.toString())

    //   console.log(periodTimesPerClaim.toString());
    //   console.log(endTime.toString())
    //   console.log(startTime.toString());
      
    //   console.log(tgeInfo.started);
    //   console.log(tgeInfo.amount.toString());
    //   console.log(tgeInfo.allocatedAmount.toString())
    //   // console.log(allocated.toString())
    // } catch (err) {
    //   console.log(err);
    // }
}
