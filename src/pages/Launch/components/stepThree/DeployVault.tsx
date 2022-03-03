import {
  Flex,
  useTheme,
  Box,
  GridItem,
  useColorMode,
  Text,
  Button,
} from '@chakra-ui/react';
import {Projects, VaultAny} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useEffect, useState} from 'react';
import {shortenAddress} from 'utils';

type DeployVaultProp = {
  vault: VaultAny;
};

const DeployVault: React.FC<DeployVaultProp> = ({vault}) => {
  const {vaultName} = vault;
  const theme = useTheme();
  const {OpenCampaginDesign} = theme;
  const {colorMode} = useColorMode();
  const [btnDisable, setBtnDisable] = useState(true);
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const [vaultState, setVaultState] = useState<
    'notReady' | 'ready' | 'finished'
  >('notReady');

  useEffect(() => {
    const isTokenDeployed = values.isTokenDeployed;
    const isVaultDeployed = false;
    setVaultState(
      isTokenDeployed && isVaultDeployed
        ? 'finished'
        : isTokenDeployed && !isVaultDeployed
        ? 'ready'
        : 'notReady',
    );
  }, [values]);

  return (
    <GridItem
      {...OpenCampaginDesign.border({colorMode})}
      bg={vaultState === 'finished' ? '#26c1c9' : 'none'}
      w={'338px'}
      h={'232px'}
      pl={'30px'}
      pr={'20px'}
      pt={'20px'}
      pb={'25px'}
      color={vaultState === 'finished' ? 'white.100' : 'gray.400'}>
      <Flex flexDir={'column'}>
        <Box d="flex" justifyContent={'space-between'}>
          <Text fontSize={13} h={'18px'}>
            Vauts
          </Text>
          <Text
            fontSize={12}
            h={'16px'}
            color={vaultState === 'notReady' ? 'gray.400' : '#03c4c6'}>
            {vaultState === 'finished'
              ? 'Completed'
              : vaultState === 'ready'
              ? 'Ready to deploy'
              : 'Status'}
          </Text>
        </Box>
        <Text
          fontSize={28}
          h={'37px'}
          color={vaultState === 'finished' ? 'white.100' : 'black.300'}
          fontWeight={600}
          mb={'48px'}>
          {vaultName}
        </Text>
        <Box d="flex" flexDir={'column'} mb={'12px'}>
          <Text fontSize={11} h={'15px'}>
            Address
          </Text>
          <Text
            color={vaultState === 'finished' ? 'white.100' : 'gray.250'}
            fontSize={15}
            h={'20px'}
            fontWeight={600}>
            {shortenAddress('0x0000000000000000')}
          </Text>
        </Box>
        <Box d="flex" justifyContent={'space-between'}>
          <Flex flexDir={'column'}>
            <Text fontSize={11} h={'15px'}>
              Total Supply
            </Text>
            <Text
              color={vaultState === 'finished' ? 'white.100' : 'gray.250'}
              fontSize={15}
              h={'20px'}
              fontWeight={600}>
              50,000,000
            </Text>
          </Flex>
          <Button
            w={'100px'}
            h={'32px'}
            bg={vaultState === 'ready' ? 'blue.500' : 'none'}
            mt={'auto'}
            color={vaultState === 'ready' ? 'white.100' : 'gray.175'}
            // color={'white.100'}
            border={vaultState === 'ready' ? '' : '1px solid #dfe4ee'}
            isDisabled={vaultState !== 'ready' ? btnDisable : false}
            fontSize={13}
            fontWeight={500}
            _hover={{}}>
            Deploy
          </Button>
        </Box>
      </Flex>
    </GridItem>
  );
};

export default DeployVault;
