import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Heading,
  Text,
  Button,
  Flex,
  useTheme,
  useColorMode,
  Link,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal';
import Line from '../common/Line';
import {LoadingComponent} from 'components/Loading';
import {selectApp} from 'store/app/app.reducer';
import {setTwoMinutes,selectLaunch, setTempHash} from '@Launch/launch.reducer';
import moment from 'moment';
import {Contract} from '@ethersproject/contracts';
import InitialLiquidityComputeAbi from 'services/abis/Vault_InitialLiquidityCompute.json';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {getSigner} from 'utils/contract';
import store from 'store';
import {toastWithReceipt} from 'utils';
import {setTxPending} from 'store/tx.reducer';
import {openToast} from 'store/app/toast.reducer';
import {DEPLOYED} from 'constants/index';
import {addPool} from 'pages/Admin/actions/actions';

const ConfirmTx = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const {btnStyle} = theme;
  const {data: appConfig} = useAppSelector(selectApp);

  const [deployStep, setDeployStep] = useState<
    'Ready' | 'Deploying' | 'Done' | 'Error'
  >('Ready');
  const [poolCreated, setPoolCreated] = useState(false);
  const {
    data: {tempHash},
  } = useAppSelector(selectLaunch);
  const dispatch = useAppDispatch();
  const {account, library, chainId} = useActiveWeb3React();
  const {TOS_ADDRESS, UniswapV3Factory, NPM_Address} = DEPLOYED;


  if (!data?.data?.vaultInfo) {
    return <></>;
  }

  const {
    vaultInfo: {vault, project},
    func,
  } = data.data;

//   const {vaultInfo: {vault,project} , func} = data.data;


  const InitialLiquidityCompute = new Contract(
    vault.vaultAddress,
    InitialLiquidityComputeAbi.abi,
    library,
  );

  const createPool = async () => {
    const now = moment().unix();
    dispatch(setTwoMinutes({data: now + 120}));

    if (account === null || account === undefined || library === undefined) {
      return;
    }
    const signer = getSigner(library, account);

    const computePoolAddress = await InitialLiquidityCompute.connect(
      signer,
    ).computePoolAddress(TOS_ADDRESS, project.tokenAddress, 3000);

    try {
      const receipt = await InitialLiquidityCompute.connect(
        signer,
      ).setCreatePool();
      store.dispatch(setTxPending({tx: true}));
      if (receipt) {
        toastWithReceipt(receipt, setTxPending, 'Launch');
        await receipt.wait();
        // const now = moment().unix();
        // const deadline = now+120
        // dispatch(setTwoMinutes({data: {deadline}}));
        if (chainId) {
          addPool({
            chainId: chainId,
            poolName: `TOS / ${project.tokenSymbol}`,
            poolAddress: computePoolAddress[0],
            token0Address: TOS_ADDRESS,
            token1Address: project.tokenAddress,
            token0Image:
              'https://tonstarter-symbols.s3.ap-northeast-2.amazonaws.com/tos-symbol%403x.png',
            token1Image: project.tokenSymbolImage,
            feeTier: 3000,
          });
          setDeployStep('Done');

        }
      }
    } catch (e) {
        setDeployStep('Error');
      store.dispatch(setTxPending({tx: false}));
      store.dispatch(
        //@ts-ignore
        openToast({
          payload: {
            status: 'error',
            title: 'Tx fail to send',
            description: `something went wrong`,
            duration: 5000,
            isClosable: true,
          },
        }),
      );
    }
  };

  function closeModal() {
    try {
      setDeployStep('Deploying');
      dispatch(
        setTempHash({
          data: undefined,
        }),
      );
      handleCloseModal();
    } catch (e) {
      console.log('--closeModal error--');
      console.log(e);
    }
  }
  if (deployStep === 'Ready') {
    return (
      <Modal
        isOpen={data.modal === 'Launch_ConfirmTx' ? true : false}
        isCentered
        onClose={() => {
          closeModal();
        }}>
        <ModalOverlay />
        <ModalContent
          fontFamily={theme.fonts.roboto}
          bg={colorMode === 'light' ? 'white.100' : 'black.200'}
          w="350px"
          pt="20px"
          pb="25px">
          <CloseButton closeFunc={() => closeModal()}></CloseButton>
          <ModalBody p={0}>
          

            <Flex
              flexDir="column"
              alignItems="center"
              mt={'30px'}
              px={'20px'}
              fontSize={15}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              >
                <Text  fontSize={16}
                color={'black.300'}
                fontWeight={600}>
                Confirm the Create Pool transaction
                </Text>
            
              </Flex>

            <Box w={'100%'} my={'25px'} px={'15px'}>
              <Line></Line>
            </Box>
            <Box as={Flex} flexDir="column" alignItems="center">
              <Button
                {...btnStyle.btnAble()}
                w={'150px'}
                fontSize="14px"
                _hover={{}}
                onClick={() => createPool() && setDeployStep('Deploying')}>
                Deploy
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  if (deployStep === 'Deploying') {
    return (
      <Modal
        isOpen={data.modal === 'Launch_ConfirmTx' ? true : false}
        isCentered
        closeOnOverlayClick={false}
        onClose={() => {
          closeModal();
        }}>
        <ModalOverlay />
        <ModalContent
          fontFamily={theme.fonts.roboto}
          bg={colorMode === 'light' ? 'white.100' : 'black.200'}
          w="350px"
          pt="20px">
          <ModalBody>
            <Flex
              pt={'40px'}
              pb={'17px'}
              flexDir={'column'}
              alignItems="center"
              justifyContent={'center'}
              textAlign={'center'}>
              <Box mb={'40px'}>
                <LoadingComponent w={'80px'} h={'80px'}></LoadingComponent>
              </Box>
              <Text
                w={'186px'}
                fontSize={16}
                color={'black.300'}
                fontWeight={600}
                textAlign={'center'}>
                Waiting to complete deploying your token
              </Text>

              <Box w={'100%'} px={'15px'} mb={'25px'} mt={'40px'}>
                <Line></Line>
              </Box>
              <Box as={Flex} flexDir="column" alignItems="center">
                <Link
                  isExternal={true}
                  href={`${appConfig.explorerTxnLink}${tempHash}`}
                  color={'blue.100'}>
                  <Button
                    {...btnStyle.btnAble()}
                    w={'150px'}
                    fontSize="14px"
                    _hover={{}}
                    isDisabled={tempHash ? false : true}>
                    View on Etherscan
                  </Button>
                </Link>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  if (deployStep === 'Done') {
    return (
      <Modal
        isOpen={data.modal === 'Launch_ConfirmTx' ? true : false}
        isCentered
        onClose={() => {
          handleCloseModal();
        }}>
        <ModalOverlay />
        <ModalContent
          fontFamily={theme.fonts.roboto}
          bg={colorMode === 'light' ? 'white.100' : 'black.200'}
          w="350px"
          pt="20px"
          pb="25px">
          <CloseButton closeFunc={handleCloseModal}></CloseButton>
          <ModalBody p={0}>
            <Flex
              pt={'36px'}
              flexDir={'column'}
              alignItems="center"
              justifyContent={'center'}>
              <Text
                w={'230px'}
               
                mb={'30px'}
                fontSize={16}
                color={'black.300'}
                fontWeight={600}
                textAlign={'center'}>
                Completed creating the pool
              </Text>
             
              <Box w={'100%'} px={'15px'} mb={'25px'}>
                <Line></Line>
              </Box>
              <Box as={Flex} flexDir="column" alignItems="center">
                <Button
                  {...btnStyle.btnAble()}
                  w={'150px'}
                  fontSize="14px"
                  _hover={{}}
                  onClick={() => closeModal()}>
                  Confirm
                </Button>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={data.modal === 'Launch_ConfirmTx' ? true : false}
      isCentered
      onClose={() => {
        handleCloseModal();
      }}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
        pt="20px"
        pb="25px">
        <CloseButton closeFunc={handleCloseModal}></CloseButton>
        <ModalBody p={0}>
          <Flex
            pt={'56px'}
            flexDir={'column'}
            alignItems="center"
            justifyContent={'center'}>
            <Text
              w={'186px'}
              mb={'55px'}
              fontSize={16}
              color={'black.300'}
              fontWeight={600}
              textAlign={'center'}>
              Your token failed to deploy :(
            </Text>
            <Box w={'100%'} px={'15px'} mb={'25px'}>
              <Line></Line>
            </Box>
            <Box as={Flex} flexDir="column" alignItems="center">
              <Button
                {...btnStyle.btnAble()}
                w={'150px'}
                fontSize="14px"
                _hover={{}}
                bg={{}}
                border={'1px solid #2a72e5'}
                color={'blue.300'}
                onClick={() => closeModal()}>
                Go back to deploy
              </Button>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmTx;
