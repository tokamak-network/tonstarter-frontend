import {Grid} from '@chakra-ui/react';
import {VaultAny} from '@Launch/types';
import {useFormikContext} from 'formik';
import DeployToken from './DeployToken';
import DeployVault from './DeployVault';

const DeployContainer = () => {
  const {values, setFieldValue} = useFormikContext();
  //@ts-ignore
  const vaultsList = values.vaults;
  return (
    <Grid templateColumns="repeat(3, 1fr)" rowGap={'8px'} px={'35px'}>
      <DeployToken></DeployToken>
      {vaultsList.map((vault: VaultAny) => {
        return <DeployVault vault={vault}></DeployVault>;
      })}
    </Grid>
  );
};

export default DeployContainer;
