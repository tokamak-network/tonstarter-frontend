import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Image,
  useTheme,
  useColorMode,
  Spacer,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal';
import Line from '@Launch/components/common/Line';
import {useRouteMatch} from 'react-router-dom';
import gasIcon from 'assets/images/gas-graphic.png';
import {DEPLOYED} from 'constants/index';
import * as PublicSaleVaultCreateAbi from 'services/abis/PublicSaleVaultCreateAbi.json';
import {Contract} from '@ethersproject/contracts';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {BigNumber, ethers} from 'ethers';
import {convertNumber} from 'utils/number';
import {CustomTooltip} from 'components/Tooltip';

const EstimateGasModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const [isCheck, setIsCheck] = useState<boolean>(false);
  const {PublicSaleVault} = DEPLOYED;
  const {library, account} = useActiveWeb3React();
  const match = useRouteMatch();
  const {url} = match;
  const [recommended, setRecommended] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  // Todo: Set Calculated Eth values
  // const recommendedEth = 1.5434;
  // const ownersEth = 2.4456;

  const closeModal = () => {
    setIsCheck(false);
    handleCloseModal();
  };

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
    }
    getGasFee();
  }, [contract.provider, library]);

  return (
    <Modal
      isOpen={data.modal === 'Launch_EstimateGas' ? true : false}
      isCentered
      onClose={() => closeModal()}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        maxW="350px"
        pt="25px"
        pb="25px">
        <CloseButton closeFunc={closeModal}></CloseButton>
        <ModalBody p={0}>
          <Box
            pb={'1.250em'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Heading
              fontSize={'20px'}
              fontWeight={'bold'}
              fontFamily={'Titillium Web, sans-serif'}
              color={colorMode === 'light' ? '#3d495d' : 'white.100'}
              textAlign={'center'}>
              Gas Check
            </Heading>
          </Box>
          <Flex flexDir={'column'} w={'100%'} p={'25px'} textAlign={'center'}>
            <Text fontSize={13}>
              You need to have enough gas to <br />
              complete all of the launch procedures.
            </Text>
          </Flex>
          <Flex flexDir={'column'} w={'100%'} textAlign={'center'}>
            <Image src={gasIcon} px={'120px'} py={'45px'} />

            <Flex h={'45px'} pt={'14px'} pb={'13px'} px={'20px'}>
              <Text fontSize={13} mr="5px">
                Recommended
              </Text>
              <CustomTooltip
                toolTipW={200}
                toolTipH={'50px'}
                msg={[
                  `Recommended ETH amount includes a safety margin of 1ETH`,
                ]}></CustomTooltip>
              <Spacer />
              <Text fontSize={15}>{`${recommended.toLocaleString()} ETH`}</Text>
            </Flex>
            <Flex h={'45px'} pt={'14px'} pb={'13px'} px={'20px'}>
              <Text fontSize={13}>You have</Text>
              <Spacer />
              {ethBalance <= recommended ? (
                <Text
                  fontSize={15}
                  color={'#ff3b3b'}>{`${ethBalance} ETH`}</Text>
              ) : (
                <Text fontSize={15}>{`${ethBalance} ETH`}</Text>
              )}
            </Flex>
            {ethBalance <= recommended && (
              <Flex
                flexDir={'column'}
                w={'100%'}
                p={'25px'}
                textAlign={'center'}>
                <Text color={'#ff3b3b'}>warning</Text>
                <Text fontSize={13}>
                  You need to have enough gas to <br />
                  complete all of the launch procedures.
                </Text>
              </Flex>
            )}
            <Flex alignSelf={'center'} w={'320px'} mt={'25px'}>
              <Line />
            </Flex>

            <Flex alignItems={'center'} w={'320px'} mx={'100px'} mt={'25px'}>
              <Button
                w={'150px'}
                h={'38px'}
                color={'#fff'}
                border-radius={'4px'}
                onClick={() => closeModal()}
                _hover={{bg: '#2a72e5'}}
                bg={'#257eee'}
                _active={{bg: '#2a72e5'}}
                _focus={{bg: '#2a72e5'}}>
                Done
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EstimateGasModal;
