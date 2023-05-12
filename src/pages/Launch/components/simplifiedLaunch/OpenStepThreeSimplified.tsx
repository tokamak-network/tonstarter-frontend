// Simplified Launch Deploy component
import {Flex, useColorMode, useTheme} from '@chakra-ui/react';
import StepHeader from './StepHeader';
import StepThreeSteps from './openStepThree/StepThreeSteps';
import {useState, useEffect, useMemo} from 'react';
import InitialLiquidity from './openStepThree/InitialLiquidity';
import Distribute from './openStepThree/Distribute';
import ProjectToken from './openStepThree/ProjectToken';
import Vesting from './openStepThree/Vesting';
import Public from './openStepThree/Public';
import {useFormikContext} from 'formik';
import {Projects} from '@Launch/types';
import Team from './openStepThree/Team';
import Ecosystem from './openStepThree/Ecosystem';
import TokenLP from './openStepThree/TokenLp';
import TonStaker from './openStepThree/TonStaker';
import TosStaker from './openStepThree/TosStaker';
import WtonLP from './openStepThree/WtonLP';
import Custom from './openStepThree/Custom';
import ConfirmTokenSimplifiedModal from '../modals/ConfirmTokenSimplified';
import {useModal} from 'hooks/useModal';
import EstimateGasModal from './openStepThree/EstimateGas';
import * as PublicSaleVaultCreateAbi from 'services/abis/PublicSaleVaultCreateAbi.json';
import {DEPLOYED} from 'constants/index';
import {Contract} from '@ethersproject/contracts';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {
  selectLaunch,
  setProjectStep,
  saveTempProjectData,
} from '@Launch/launch.reducer';
import {convertNumber} from 'utils/number';
import {BigNumber, ethers} from 'ethers';

const VaultComp = (props: {vaultNum: number; vaults: any}) => {
  const {vaultNum, vaults} = props;
  console.log(vaultNum, vaults.length);

  if (vaultNum === 0) {
    return <ProjectToken />;
  } else if (vaultNum < 8) {
    switch (vaultNum) {
      case 1:
        return <InitialLiquidity step="Deploy" />;
      case 2:
        return <Vesting step="Deploy" />;
      case 3:
        return <Public step="Deploy" />;
      case 4:
        return <TonStaker step="Deploy" />;
      case 5:
        return <TosStaker step="Deploy" />;
      case 6:
        return <WtonLP step="Deploy" />;
      case 7:
        return <TokenLP step="Deploy" />;
      // case 8:
      //   return <Ecosystem step="Deploy" />;
      // case 9:
      //   return <Team step="Deploy" />;
      default:
        return <Flex>No vault</Flex>;
    }
  } else if (7 < vaultNum && vaultNum < vaults.length + 1) {
    return <Custom step="Deploy" index={vaultNum-1} />;
  } else if (vaultNum === vaults.length + 1) {
    return <Distribute />;
  } else if (vaults.length + 1 < vaultNum && vaultNum < vaults.length + 2 + 7) {
    switch (vaultNum) {
      case vaults.length + 2:
        return <InitialLiquidity step="Initialize" />;
      case vaults.length + 3:
        return <Vesting step="Initialize" />;
      case vaults.length + 4:
        return <Public step="Initialize" />;
      case vaults.length + 5:
        return <TonStaker step="Initialize" />;
      case vaults.length + 6:
        return <TosStaker step="Initialize" />;
      case vaults.length + 7:
        return <WtonLP step="Initialize" />;
      case vaults.length + 8:
        return <TokenLP step="Initialize" />;
      default:
        return <Flex>No vault</Flex>;
    }
  } else {
    return <Custom step="Initialize" index={vaultNum-(vaults.length + 2)} />;
  }

};

const OpenStepThreeSimplified = (props: any) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const dispatch: any = useAppDispatch();
  const {openAnyModal} = useModal();
  const [currentStep, setCurrentStep] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  const [recommended, setRecommended] = useState(0);
  const {PublicSaleVault} = DEPLOYED;
  const {library, account} = useActiveWeb3React();
  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();

  const contract = new Contract(
    PublicSaleVault,
    PublicSaleVaultCreateAbi.abi,
    library,
  );

  useEffect(() => {
    async function getGasFee() {
      if (account) {
        const feeData = await contract.provider.getFeeData();

        const {maxFeePerGas} = feeData;
        const totalGasEstimate = 2402827 * 10 + 344776 * 9 + 478876;

        if (maxFeePerGas) {
          const gasPrice = BigNumber.from(totalGasEstimate + 42000).mul(
            maxFeePerGas,
          );
          const gas = convertNumber({amount: String(gasPrice)});
          setRecommended(Number(gas) + 1);

          const eth0 = await library?.getBalance(account);
          const balance = convertNumber({amount: String(eth0)});
          setEthBalance(Number(balance));
        }
      }

      if (ethBalance < recommended && currentStep === 0) {
        openAnyModal('Launch_EstimateGas', {});
      }
    }
    getGasFee();
  }, [contract.provider, library, currentStep, ethBalance, recommended]);

  useEffect(() => {
    dispatch(setProjectStep({data: 3}));
    setFieldValue('isSimplified', true);
  }, [dispatch]);

  useEffect(() => {
    // console.log('data changes');

    dispatch(saveTempProjectData({data: values}));
  }, [values]);

  console.log(values);

  return (
    <Flex
      w="774px"
      h="100%"
      pb={'51px'}
      border={'1px solid'}
      flexDir="column"
      borderColor={colorMode === 'dark' ? '#373737' : 'transparent'}
      bg={colorMode === 'light' ? 'white.100' : 'transparent'}
      boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}
      borderRadius="10px"
      alignItems={'center'}>
      <StepHeader
        deploySteps={true}
        deployStep={currentStep + 1}
        setCurrentStep={setCurrentStep}
        title={'Deploy'}
      />
      <StepThreeSteps
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
      <VaultComp vaultNum={currentStep} vaults={values.vaults} />
      <ConfirmTokenSimplifiedModal />
      <EstimateGasModal recommended={recommended} ethBalance={ethBalance} />
    </Flex>
  );
};

export default OpenStepThreeSimplified;
