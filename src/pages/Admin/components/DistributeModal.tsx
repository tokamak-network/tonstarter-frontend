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
} from '@chakra-ui/react';
import React, {useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {CloseButton} from 'components/Modal';
import {CustomInput} from 'components/Basic';
import AdminActions from '../actions';

export const DistributeModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const {handleCloseModal} = useModal();
  const {btnStyle} = theme;
  const {contractAddress} = data.data;

  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [tokenAmount, setTokenAmount] = useState('');

  return (
    <Modal
      isOpen={data.modal === 'Admin_Distribute' ? true : false}
      isCentered
      onClose={() => {
        handleCloseModal();
      }}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
        pt="25px"
        pb="25px">
        <CloseButton closeFunc={handleCloseModal}></CloseButton>
        <ModalBody p={0}>
          <Box
            pb={'1.250em'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Heading
              fontSize={'1.250em'}
              fontWeight={'bold'}
              fontFamily={theme.fonts.titil}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              textAlign={'center'}>
              Reward Token
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              You can manage tokens
            </Text>
          </Box>

          <Flex
            flexDir="column"
            mt={'30px'}
            pl={'30px'}
            pr={'30px'}
            fontSize={'13px'}
            fontWeight={600}
            color={colorMode === 'light' ? 'black.300' : 'white.100'}>
            <Box d="flex" flexDir="column" mb={'24px'}>
              <Text mb={'9px'}>Token Address</Text>
              <CustomInput
                w={'290px'}
                h={'32px'}
                style={{fontSize: '12px', textAlign: 'left'}}
                value={tokenAddress}
                setValue={setTokenAddress}
                placeHolder={'Enter token address'}
                fontWeight={500}
                startWithZero={true}
                color={
                  tokenAddress !== ''
                    ? colorMode === 'light'
                      ? 'gray.225'
                      : 'white.100'
                    : 'gray.175'
                }></CustomInput>
            </Box>
            <Box d="flex" flexDir="column" mb={'29px'}>
              <Text mb={'9px'}>Token Amount</Text>
              <CustomInput
                w={'290px'}
                h={'32px'}
                border={'1px solid #dfe4ee'}
                style={{
                  fontSize: '12px',
                  textAlign: 'left',
                  border: '1px solid #dfe4ee',
                }}
                value={tokenAmount}
                setValue={setTokenAmount}
                placeHolder={'0.00'}
                fontWeight={500}
                color={
                  tokenAmount !== ''
                    ? colorMode === 'light'
                      ? 'gray.225'
                      : 'white.100'
                    : 'gray.175'
                }></CustomInput>
            </Box>
          </Flex>

          <Box
            as={Flex}
            justifyContent={'space-between'}
            pt={5}
            px={'20px'}
            borderTop={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Button
              {...btnStyle.btnAble()}
              w={'150px'}
              fontSize="14px"
              _hover={{}}
              onClick={() => {
                account &&
                  AdminActions.getERC20Approve({
                    account,
                    library,
                    amount: tokenAmount,
                    address: tokenAddress,
                  });
              }}>
              Approve
            </Button>
            <Button
              {...btnStyle.btnAble()}
              w={'150px'}
              fontSize="14px"
              _hover={{}}
              onClick={() => {
                account &&
                  AdminActions.distribute({
                    account,
                    library,
                    amount: tokenAmount,
                    address: tokenAddress,
                  });
              }}>
              Distribute
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
