import {Grid} from '@chakra-ui/react';
import {changeVault} from '@Launch/launch.reducer';
import {Projects, VaultAny} from '@Launch/types';
import {saveProject} from '@Launch/utils/saveProject';
import {useFormikContext} from 'formik';
import {useAppDispatch} from 'hooks/useRedux';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect} from 'react';
import DeployToken from './DeployToken';
import DeployVault from './DeployVault';

const DeployContainer = () => {
  const {values} = useFormikContext<Projects['CreateProject']>();
  const vaultsList = values.vaults;
  const {account} = useActiveWeb3React();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('gogogo');
    // saveProject(values, account as string);
  }, [values, account]);

  return (
    <Grid templateColumns="repeat(3, 1fr)" rowGap={'8px'} px={'35px'}>
      <DeployToken></DeployToken>
      {vaultsList.map((vault: VaultAny) => {
        return (
          <div onClick={() => dispatch(changeVault({data: vault.vaultName}))}>
            <DeployVault vault={vault}></DeployVault>
          </div>
        );
      })}
    </Grid>
  );
};

export default DeployContainer;
