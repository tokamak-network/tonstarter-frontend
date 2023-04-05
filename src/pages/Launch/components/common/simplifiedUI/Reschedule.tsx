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
import React, {useEffect, useCallback, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal';
import Line from '@Launch/components/common/Line';
import {useRouteMatch} from 'react-router-dom';
import gasIcon from 'assets/images/gas-graphic.png';
import {DEPLOYED} from 'constants/index';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useFormikContext} from 'formik';
import {Projects, VaultPublic} from '@Launch/types';
import moment from 'moment';

const RescheduleModal = (props: any) => {
  const {time} = props;
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const history = useHistory();
  const [isCheck, setIsCheck] = useState<boolean>(false);
  const {values} = useFormikContext<Projects['CreateSimplifiedProject']>();

  const closeModal = () => {
    setIsCheck(false);
    handleCloseModal();
  };
 console.log('time to dep', time)
  return (
    <Modal
      isOpen={data.modal === 'Reschedule' && time < 30 ? true : false}
      isCentered
      onClose={() => closeModal()}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        maxW="350px"
        pt="23px"
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
              Reschedule
            </Heading>
          </Box>
          <Flex flexDir={'column'} w={'100%'} p={'25px'} textAlign={'center'}>
            <Text fontSize={13}>
              There’s less than an hour left until the deadline, which is too
              short to get through the entire launch process. <br />
              <br />
              Please click the Go button below to reschedule the Snapshot date
              so that you have more time.
            </Text>
          </Flex>
          <Flex alignSelf={'center'} w={'320px'}>
              <Line />
            </Flex>

            <Flex alignItems={'center'} w={'320px'} mx={'100px'} mt={'25px'}>
              <Button
                w={'150px'}
                h={'38px'}
                color={'#fff'}
                border-radius={'4px'}
                onClick={() => closeModal()}
                bg={'#257eee'}>
                Go
              </Button>
            </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RescheduleModal;
