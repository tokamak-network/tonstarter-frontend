import {
  Flex,
  useColorMode,
  Text,
  useTheme,
  Grid,
  GridItem,
  Switch,
  Tooltip,
  Image,
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
import {useModal} from 'hooks/useModal';
import {Link, useRouteMatch} from 'react-router-dom';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import AdvanceConfirmModal from '@Launch/components/modals/AdvanceConfirmModal'

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
  const {openAnyModal} = useModal();
  const match = useRouteMatch();
  const {url} = match;
  const isExist = url.split('/')[3];
  const [switchState, setSwitchState] = useState(false);

  const handleSwitchChange = () => {
    setSwitchState(!switchState);
  };

  const handleChange = () => {
    handleSwitchChange();
    if(switchState === false) {
      openAnyModal('Launch_AdvanceSwitch', {
        from: '/launch/createproject',
      });
    }
  }


  useEffect(() => {
    let temp = 0;
    if (values.isTokenDeployed) {
      temp += 1;
      dispatch(
        setCurrentDeployStep({
          data: temp,
        }),
      );
      // setSteps(steps => steps + 1);
    }
    values.vaults.map((vault: VaultCommon) => {
      if (vault.isDeployed === true) {
        temp += 1;
        dispatch(
          setCurrentDeployStep({
            data: temp,
          }),
        );
        // setSteps(steps => steps + 1);
      }

      if (vault.isSet === true) {
        // setSteps(steps => steps + 1);
        temp += 1;
        dispatch(
          setCurrentDeployStep({
            data: temp,
          }),
        );
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
          dispatch(
            setCurrentDeployStep({
              data: temp,
            }),
          );
          setSteps(temp);
        }
      }
    }

    checkBalance();
  }, [ERC20_CONTRACT, values,blockNumber]);

  const switchStyle =
    colorMode === 'light'
      ? `
  .chakra-switch__track{
    background: #e9edf1;
    padding: 1px;
    height: 15px;
    width: 36px;
    margin-right: 6px;
    padding-bottom: 2px;
    padding-right: 2px
  }
 
  `
      : `
  .chakra-switch__track{
    background: transparent;
    border: 1px solid #535353;
    padding: 1px;
    height: 15px;
    width: 36px;
    margin-right: 6px;
    padding-bottom: 2px;
    padding-right: 2px
  }

  `;

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
            mr="15px"
            color={colorMode === 'dark' ? 'white.100' : 'black.300'}>
            {title}
          </Text>
          {/* <Tooltip
            color={theme.colors.white[100]}
            bg={'#353c48'}
            p={2}
            w='254px'
            textAlign='center'
            hasArrow
            borderRadius={3}
            placement='top'
            fontSize={'12px'}
            ml='140px'
            label="You can fine-tune your project settings in Advance Mode. But if you leave this default mode, you cannot come back here again.">
            <Flex>
              <style>{switchStyle}</style>
              <Switch style={{height: '16px'}} onChange={handleChange}
              isChecked={switchState}
              ></Switch>
              <Text
                fontSize={'13px'}
                color={colorMode === 'dark' ? '#949494' : '#848c98'}>
                Advance mode
              </Text>
           
              <Image src={tooltipIcon} ml="6px" />
            
            </Flex>
            </Tooltip> */}
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
            <Text
            fontWeight='bold' 
              color={colorMode === 'dark' ? 'white.100' : '#304156'}
              mr="2px">
              Progress
            </Text>
            <Text fontWeight='bold' >{steps}/{(values.vaults.length*2)+2}</Text>
          </Flex>
        </GridItem>
      )}
      {/* <GridItem>
        {' '}
        <Link
          to={`/launch/${isExist}`}>
          <Switch />
        </Link>
      </GridItem> */}
    <AdvanceConfirmModal handleSwitchChange={handleSwitchChange} />
    </Grid>
  );
};

export default StepHeader;
