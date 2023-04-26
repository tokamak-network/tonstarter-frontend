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
  useTheme,
  useColorMode,
  textDecoration,
} from '@chakra-ui/react';
import React, {useState, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {setMode} from '@Launch/launch.reducer';
import {CloseButton} from 'components/Modal';
import Line from '@Launch/components/common/Line';
import ConfirmTermsModal from '@Launch/components/modals/ConfirmTerms';
import {Link, useRouteMatch} from 'react-router-dom';

const ListConfirm = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const dispatch: any = useAppDispatch();
  const [isHovered, setIsHovered] = useState(false);

  const closeModal = () => {
    handleCloseModal();
  };


  return (
    <Modal
      isOpen={data.modal === 'Launch_ListConfirm' ? true : false}
      isCentered
      onClose={() => closeModal()}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        maxW="350px"
        h='312px'
        
        >
        <CloseButton closeFunc={closeModal}></CloseButton>
        <ModalBody p={0}>
          <Box
          
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Heading
            display='flex'
            alignItems='center'
             justifyContent='center'
            h='74px'
          
              fontSize={'20px'}
              fontWeight={'bold'}
              fontFamily={'Titillium Web, sans-serif'}
              color={colorMode === 'light' ? '#3d495d' : 'white.100'}
              textAlign={'center'}>
              {data?.data?.name}
            </Heading>
          </Box>
          <Flex flexDir={'row'} h='148px' w={'100%'} p={'25px'} textAlign={'center'}>
            <Text fontSize={13} w='300px'>
              Above is your project name. After Listing the project on
              TONStarter, it is not possible to change it. If you would like to edit
              it before listing, please click{' '}
              <Link
                to={`${data.data.url}/${data.data.key}/`}
                onClick={() => closeModal()}>
                <span
                  style={{color: '#2a72e5', textDecoration: isHovered? 'underline':''}}
                  onMouseOver={() => setIsHovered(true)}
                  onMouseOut={() => setIsHovered(false)}>
                  here
                </span>
              </Link>
              .
            </Text>
          </Flex>
          <Flex alignSelf={'center'} w={'320px'}>
            <Line />
          </Flex>
          <Flex alignItems={'center'} mx={'18px'}  h='88px'>
            <Button
              w={'150px'}
              h={'38px'}
              color={'#fff'}
              fontSize='13px'
              border-radius={'4px'}
              _hover={{bg: 'blue.100'}}
              bg={'#257eee'}
              onClick={() => {
                data.data.func()
                closeModal();
              }}>
              List on TONStarter
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button
              w={'150px'}
              h={'38px'}
              fontSize='14px'
              color={'#3e495c'}
              variant={'outline'}
              border-radius={'4px'}
              _hover={{bg: '#fff'}}
              onClick={() => closeModal()}>
              Cancel
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
      <ConfirmTermsModal />
    </Modal>
  );
};

export default ListConfirm;
