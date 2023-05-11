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
  } from '@chakra-ui/react';
  import React, {useState, useEffect} from 'react';
  import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
  import {selectModalType} from 'store/modal.reducer';
  import {useModal} from 'hooks/useModal';
  import {setMode} from '@Launch/launch.reducer';
  import {CloseButton} from 'components/Modal';
  import Line from '@Launch/components/common/Line';
  import ConfirmTermsModal from '@Launch/components/modals/ConfirmTerms';
  
  const AdvanceConfirmModal = ({ handleSwitchChange } : any) => {
    const {data} = useAppSelector(selectModalType);
    const {colorMode} = useColorMode();
    const theme = useTheme();
    const {handleCloseModal} = useModal();
    const [isCheck, setIsCheck] = useState<boolean>(false);
    const dispatch: any = useAppDispatch();
  
    const closeModal = () => {
      setIsCheck(false);
      handleCloseModal();
      handleSwitchChange(false);
      data.data.setSwitchState(true)
    };
  
    return (
      <Modal
        isOpen={data.modal === 'Launch_AdvanceSwitch' ? true : false}
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
                Go to Advance Mode
              </Heading>
            </Box>
            <Flex flexDir={'column'} w={'100%'} p={'25px'} textAlign={'center'}>
              <Text fontSize={13}>
                You can fine-tune your project settings in Advance Mode. 
                <br />
                <br />
                Please note that if you proceed without making changes, you will not be able to return to this screen later
              </Text>
            </Flex>
            <Flex alignSelf={'center'} w={'320px'}>
              <Line />
            </Flex>
            <Flex alignItems={'center'} mx={'18px'}  mt={'25px'}>
            <Button
              w={'150px'}
              h={'38px'}
              color={'#fff'}
              border-radius={'4px'}
              _hover={{bg: 'blue.100'}}
              bg={'#257eee'}
              onClick={() => {
                data.data.setSwitchState(true)
                dispatch(setMode({
                    data: 'advanced'
                  }))
                  closeModal()
              }}
              >
              Go
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button
              w={'150px'}
              h={'38px'}
              color={'#3e495c'}
              variant={'outline'}
              border-radius={'4px'}
              _hover={{bg: '#fff'}}
              onClick={() => closeModal()}
              >
              Cancel
            </Button>
          </Flex>
          </ModalBody>
        </ModalContent>
        <ConfirmTermsModal />
      </Modal>
    );
  };
  
  export default AdvanceConfirmModal;
  