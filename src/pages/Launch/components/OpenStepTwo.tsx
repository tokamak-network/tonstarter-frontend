import {Flex, Box, useColorMode} from '@chakra-ui/react';
import Line from '@Launch/components/common/Line';
import Vaults from '@Launch/components/stepTwo/Vaults';
import Middle from '@Launch/components/stepTwo/Middle';
import LaunchVaultPropModal from '@Launch/components/modals/VaultProps';
import PieChartModal from '@Launch/components/modals/PieChartModal';
import CreateVaultModal from '@Launch/components/modals/CreateVault';
import VaultBasicSetting from '@Launch/components/modals/VaultBasicSetting';
import TopTitle from '@Launch/components/stepTwo/TopTitle';
import ClaimRound from '@Launch/components/stepTwo/ClaimRound';
import Overview from '@Launch/components/stepTwo/Overview';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {useFormikContext} from 'formik';
import validateFormikValues from '@Launch/utils/validate';
import {Projects,VaultPublic} from '@Launch/types';
import {setUncompletedVaultIndex,setProjectStep,saveTempProjectData} from '@Launch/launch.reducer';
import {useAppDispatch} from 'hooks/useRedux';
import VestingRound from './stepTwo/VestingRound';
import useSelectVault from 'hooks/launch/useSelectVault';
import {fetchUsdPriceURL, fetchTonPriceURL} from 'constants/index';
import truncNumber from 'utils/truncNumber';

const OpenStepTwo = (props: {
  setDisableForStep2: Dispatch<SetStateAction<boolean>>;
}) => {
  const {setDisableForStep2} = props;
  const {colorMode} = useColorMode();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const {values,setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const dispatch = useAppDispatch();
  const {selectedVaultIndex} = useSelectVault();
  const {vaults} = values;
  const publicVault = vaults[0] as VaultPublic;
  const [tonInDollars, setTonInDollars] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(setProjectStep({data:2}))
    setFieldValue('isSimplified',false )
  },[dispatch])

  useEffect(() => {
    const validation = validateFormikValues(values);
    setDisableForStep2(validation.result);
    dispatch(setUncompletedVaultIndex({data: validation}));
  }, [values, setDisableForStep2]);

  useEffect(() => {
    dispatch(saveTempProjectData({data: values}));
    setFieldValue('isSimplified',false )
  },[values])

  useEffect(() => {
    async function getTonPrice() {
      const usdPriceObj = await fetch(fetchUsdPriceURL).then((res) => {
        if (!res.ok) {
          throw new Error('error in the api');
        }

        return res.json();
      }
      );
      const tonPriceObj = await fetch(fetchTonPriceURL).then((res) =>
      {
        if (!res.ok) {
          throw new Error('error in the api');
        }

        return res.json();
      }
      );
      const tonPriceKRW = tonPriceObj[0].trade_price;
      const krwInUsd = usdPriceObj.rates.USD;

      const tonPriceInUsd = tonPriceKRW * krwInUsd;

      setTonInDollars(tonPriceInUsd);
    
    }
    getTonPrice();
  }, [ values]);

useEffect(() => {
  const funding = publicVault.hardCap? publicVault.hardCap*2*tonInDollars:0;
  setFieldValue('fundingTarget', funding);
  setFieldValue('marketCap', funding / 0.3);
  console.log('funding',funding);

  const stable = values.totalSupply? funding /(values.totalSupply*0.3):0
  setFieldValue('stablePrice', truncNumber(stable,6));  
  
},[values, tonInDollars, publicVault.hardCap])

console.log(publicVault.hardCap?publicVault.hardCap*tonInDollars: 0);


  return (
    <Flex
      w={'1100px'}
      bg={colorMode === 'light' ? 'white.100' : 'none'}
      border={colorMode === 'light' ? '' : '1px solid #373737'}
      borderRadius={'10px'}
      flexDir="column">
      <Box
        w={'100%'}
        bg={isEdit ? (colorMode === 'light' ? 'white.100' : '#222222') : 'none'}
        zIndex={5}
        opacity={isEdit ? (colorMode === 'light' ? 0.25 : 0.05) : 1}
        pointerEvents={isEdit ? 'none' : 'all'}>
        <TopTitle></TopTitle>
        <Box mb={'20px'}>
          <Line></Line>
        </Box>
        <Flex flexDir={'column'}>
          <Vaults></Vaults>
        </Flex>
      </Box>
      <Box my={'25px'}>
        <Line></Line>
      </Box>
      <Flex px={'35px'}>
        <Middle isEdit={isEdit} setIsEdit={setIsEdit}></Middle>
      </Flex>

      <Box my={'25px'}>
        <Line></Line>
      </Box>
      <Box
        w={'100%'}
        bg={isEdit ? (colorMode === 'light' ? 'white.100' : '#222222') : 'none'}
        zIndex={5}
        opacity={isEdit ? (colorMode === 'light' ? 0.25 : 0.05) : 1}
        pointerEvents={isEdit ? 'none' : 'all'}>
        {selectedVaultIndex === 0 && (
          <Flex px={'35px'}>
            <VestingRound></VestingRound>
          </Flex>
        )}
        <Box my={'25px'}>
          <Line></Line>
        </Box>
        <Flex px={'35px'}>
          <ClaimRound></ClaimRound>
        </Flex>

        <Box my={'25px'}>
          <Line></Line>
        </Box>
        <Flex px={'35px'} pb={'35px'}>
          <Overview></Overview>
        </Flex>
      </Box>
      <VaultBasicSetting></VaultBasicSetting>
      <LaunchVaultPropModal></LaunchVaultPropModal>
      <CreateVaultModal></CreateVaultModal>
      <PieChartModal></PieChartModal>
    </Flex>
  );
};

export default OpenStepTwo;
