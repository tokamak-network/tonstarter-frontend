import {
  Flex,
  useColorMode,
  Text,
  useTheme,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import CountDown from './openStepThree/CountDown';
import {useFormikContext} from 'formik';
import {Projects, VaultAny} from '@Launch/types';
import {useEffect, useState, useMemo} from 'react';
import {Dispatch, SetStateAction} from 'react';
import {useBlockNumber} from 'hooks/useBlock';
import type {LaunchMode, StepNumber, VaultCommon} from '@Launch/types';
import {useContract} from 'hooks/useContract';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {
  selectLaunch,
  setTempHash,
  setCurrentDeployStep,
} from '@Launch/launch.reducer';


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
  const dispatch: any = useAppDispatch();
  const [steps, setSteps] = useState(0);
  const ERC20_CONTRACT = useContract(values?.tokenAddress, ERC20.abi);
  const {
    data: {currentDeployStep},
  } = useAppSelector(selectLaunch);


  useEffect(() => {    
    let temp = 0;
    if (values.isTokenDeployed) {
      temp += 1
     dispatch( setCurrentDeployStep({
      data: temp,
    }))
      // setSteps(steps => steps + 1);
     ;
    }
    values.vaults.map((vault: VaultCommon) => {
      if (vault.isDeployed === true) {
        temp += 1;
        dispatch( setCurrentDeployStep({
          data: temp,
        }))
        // setSteps(steps => steps + 1);
      }

      if (vault.isSet === true) {
        // setSteps(steps => steps + 1);
        temp += 1;
        dispatch( setCurrentDeployStep({
          data: temp,
        }))
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
          dispatch( setCurrentDeployStep({
            data: temp,
          }))
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
      fontWeight={600}
      borderColor={colorMode === 'dark' ? '#373737' : '#f4f6f8'}>
      <GridItem justifyContent={'center'}>
        <Flex alignItems={'center'}>
          <Text
            lineHeight={'20px'}
            fontSize={'20px'}
            color={colorMode === 'dark' ? 'white.100' : 'black.300'}>
            {title}
          </Text>
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
