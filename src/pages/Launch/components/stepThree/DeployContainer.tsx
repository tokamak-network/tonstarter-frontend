import {Grid, GridItem} from '@chakra-ui/react';
import {changeVault} from '@Launch/launch.reducer';
import {Projects, VaultCommon} from '@Launch/types';
import {saveProject} from '@Launch/utils/saveProject';
import {useFormikContext} from 'formik';
import {useAppDispatch} from 'hooks/useRedux';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useMemo} from 'react';
import DeployToken from './DeployToken';
import DeployVault from './DeployVault';

const DeployContainer = () => {
  const {values} = useFormikContext<Projects['CreateProject']>();
  const vaultsList = values.vaults;
  const {account} = useActiveWeb3React();
  const dispatch = useAppDispatch();

  console.log('value',values);
  // console.log(values);

  useEffect(() => {
    // saveProject(values, account as string);
  }, [values, account]);

  return (
    <Grid templateColumns="repeat(3, 1fr)" rowGap={'8px'} px={'35px'}>
      <DeployToken></DeployToken>
      {vaultsList.map((vault: VaultCommon) => {
        if (vault.vaultType === 'Initial Liquidity') {
          return (
            <GridItem
              rowStart={1}
              onClick={() =>
                dispatch(
                  changeVault({
                    data: vault.vaultName,
                    vaultType: vault.vaultType,
                  }),
                )
              }>
              <DeployVault vault={vault}></DeployVault>
            </GridItem>
          );
        }

        if (vault.vaultType === 'Vesting') {
          return (
            <GridItem
              rowStart={2}
              onClick={() =>
                dispatch(
                  changeVault({
                    data: vault.vaultName,
                    vaultType: vault.vaultType,
                  }),
                )
              }>
              <DeployVault vault={vault}></DeployVault>
            </GridItem>
          );
        }

        return (
          <div
            onClick={() =>
              dispatch(
                changeVault({
                  data: vault.vaultName,
                  vaultType: vault.vaultType,
                }),
              )
            }>
            <DeployVault vault={vault}></DeployVault>
          </div>
        );
      })}
    </Grid>
  );
};

export default DeployContainer;
