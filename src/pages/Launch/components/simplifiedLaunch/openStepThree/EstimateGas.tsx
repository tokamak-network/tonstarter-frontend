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
import React, {useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal';
import Line from '@Launch/components/common/Line';
import {useRouteMatch} from 'react-router-dom';
import gasIcon from 'assets/svgs/gas-graphic.svg';

const EstimateGasModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const [isCheck, setIsCheck] = useState<boolean>(false);


  const match = useRouteMatch();
  const {url} = match;

  // Todo: Set Calculated Eth values
  const recommendedEth = 1.5434;
  const ownersEth = 2.4456;


  const closeModal = () => {
    setIsCheck(false);
    handleCloseModal();
  };

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
            {/* TODO: Update image. text is strange */}
            <Image src={gasIcon} px={'120px'} py={'45px'} />

            <Flex h={'45px'} pt={'14px'} pb={'13px'} px={'20px'}>
              <Text fontSize={13}>Recommended</Text>
              <Spacer />
              <Text fontSize={15}>{`${recommendedEth} ETH`}</Text>
            </Flex>
            <Flex h={'45px'} pt={'14px'} pb={'13px'} px={'20px'}>
              <Text fontSize={13}>You have</Text>
              <Spacer />
              {ownersEth <= recommendedEth ? (
                <Text
                fontSize={15}
                color={'#ff3b3b'}>{`${ownersEth} ETH`}</Text>
              ) : (
                <Text fontSize={15}>{`${ownersEth} ETH`}</Text>
              )}
            </Flex>
            {ownersEth <= recommendedEth && (
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
                bg={'#257eee'}>
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
