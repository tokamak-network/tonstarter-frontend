import {
  Flex,
  useColorMode,
  Text,
  useTheme,
  Image,
  Link,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import iconUserGuide from 'assets/images/iconUserGuide.png';
import CountDown from './openStepThree/CountDown';
import {useFormikContext} from 'formik';
import {Projects, VaultAny} from '@Launch/types';
import {useEffect, useState, useMemo} from 'react';
import {Dispatch, SetStateAction} from 'react';
import {useBlockNumber} from 'hooks/useBlock';
import type {LaunchMode, StepNumber, VaultCommon} from '@Launch/types';
import {useContract} from 'hooks/useContract';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
const StepHeader = (props: {
  deploySteps: boolean;
  deployStep?: number;
  setCurrentStep?: Dispatch<SetStateAction<any>>;

  title: string;
}) => {
  const {deploySteps, deployStep, title, setCurrentStep} = props;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const {blockNumber} = useBlockNumber();

  const [steps, setSteps] = useState(0);
  const ERC20_CONTRACT = useContract(values?.tokenAddress, ERC20.abi);

  useEffect(() => {
    let temp = 0;
    if (values.isTokenDeployed) {
      // setSteps(steps => steps + 1);
      temp += 1;
    }
    values.vaults.map((vault: VaultCommon) => {
      if (vault.isDeployed === true) {
        temp += 1;
        // setSteps(steps => steps + 1);
      }

      if (vault.isSet === true) {
        // setSteps(steps => steps + 1);
        temp += 1;
      }
    });
    setSteps(temp);
    async function checkBalance() {
      if (ERC20_CONTRACT && values.vaults[0].vaultAddress) {
        const balance = await ERC20_CONTRACT.balanceOf(
          values.vaults[0].vaultAddress,
        );
        if (Number(balance) > 0) {
          temp += 1;
          setSteps(temp);
        }
      }
    }

    checkBalance();
  }, [ERC20_CONTRACT, values]);
  return (
    <Grid
      templateColumns={deploySteps ? 'repeat(3, 1fr)' : 'repeat(1, 1fr)'}
      gap={0}
      h="73px"
      w="100%"
      alignItems={'center'}
      borderBottom={'1px'}
      px="35px"
      borderColor={colorMode === 'dark' ? '#373737' : '#f4f6f8'}>
      <GridItem justifyContent={'center'}>
        <Flex alignItems={'center'}>
          <Text
            lineHeight={'20px'}
            fontSize={'20px'}
            color={colorMode === 'dark' ? 'white.100' : 'black.300'}>
            {title}
          </Text>
          <Image ml="21px" src={iconUserGuide} w="18px" h="18px"></Image>
          <Link
            isExternal
            ml="6px"
            fontSize={'13px'}
            fontFamily={'Titillium Web, sans-serif'}
            color={colorMode === 'dark' ? 'gray.475' : 'gray.400'}
            href={
              'https://tokamaknetwork.gitbook.io/home/02-service-guide/tosv2'
            }
            cursor="pointer">
            {' '}
            User Guide
          </Link>
        </Flex>
      </GridItem>
      {deploySteps && (
        <GridItem>
          <CountDown />
        </GridItem>
      )}
      {deploySteps && (
        <GridItem>
          <Flex color="blue.200" fontSize={'13px'} justifyContent="flex-end">
            <Text color={'white.100'} mr="2px">
              Progress
            </Text>
            <Text>{steps}/20</Text>
          </Flex>
        </GridItem>
      )}
    </Grid>
  );
};

export default StepHeader;
