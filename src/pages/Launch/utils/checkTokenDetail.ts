function checkTokenDetail(vault: any) {
  const {
    vaultTokenAllocation,
    publicRound1Allocation,
    publicRound2Allocation,
    hardCap,
  } = vault;

  if (
    vaultTokenAllocation <
    Number(publicRound1Allocation) +
      Number(publicRound2Allocation) +
      Number(hardCap)
  ) {
    return false;
  }
  return true;
}

export default checkTokenDetail;
