import {
  Flex,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  useTheme,
  useColorMode,
  Link,
} from '@chakra-ui/react';
import {CloseIcon} from '@chakra-ui/icons';
import {selectModalType} from 'store/modal.reducer';
import {useAppSelector} from 'hooks/useRedux';
import {useModal} from 'hooks/useModal';
import {selectApp} from 'store/app/app.reducer';

export const ConfirmModal = () => {
  const {sub} = useAppSelector(selectModalType);
  const {from, amount, period, action} = sub.data;
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const {handleCloseConfirmModal} = useModal();
  const {data: appConfig} = useAppSelector(selectApp);

  return (
    <Modal
      isOpen={sub.type === 'confirm' ? true : false}
      isCentered
      onClose={handleCloseConfirmModal}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="390px"
        h="208px">
        <ModalBody px={0}>
          <Flex
            w="100%"
            h="30px"
            pt={'10px'}
            px={'10px'}
            justifyContent="flex-end">
            <CloseIcon
              h={15}
              w={15}
              style={{cursor: 'pointer'}}
              onClick={() => {
                handleCloseConfirmModal();
              }}
            />
          </Flex>
          {from === 'staking/stake' ? (
            <Text fontSize="14px" color="#818992" px={8} h={100} mb="15px">
              You <strong>can not withdraw</strong> this{' '}
              <strong>
                {amount}
                TON
              </strong>{' '}
              for next <strong>{period?.split('.')[1]}</strong>, and also its{' '}
              <strong>TON reward can not be given</strong> to you for this
              period(Except for TOS reward).
              <Text>Are you sure you want to stake?</Text>
            </Text>
          ) : from === 'dao/stake' ? (
            <Text fontSize="14px" color="#818992" px={8} h={100} mb="15px">
              You <strong>can not withdraw</strong> this{' '}
              <strong>
                {amount}
                TOS
              </strong>{' '}
              for next <strong>{period + ' weeks'}</strong>
              <Text>Are you sure you want to stake?</Text>
            </Text>
          ) : from === 'admin/poolDelete' ? (
            <Flex
              flexDir="column"
              fontSize="14px"
              color="#818992"
              px={8}
              h={100}
              mb="15px">
              <Text>
                Pool Name : <strong>{amount.name}</strong>
              </Text>
              <Text>Pool Address :</Text>
              <Link
                fontWeight={'bold'}
                color={'blue.200'}
                isExternal={true}
                outline={'none'}
                mb={'10px'}
                _focus={{
                  outline: 'none',
                }}
                href={`${appConfig.uniswapPoolLink}${amount.address}`}>
                {amount.address}
              </Link>
              <Text>
                Do you really want to <strong>delete</strong> this pool ?
              </Text>
            </Flex>
          ) : null}
          <Flex w="100%" alignItems="center" justifyContent="center">
            <Button
              w={110}
              h={'32px'}
              bg={colorMode === 'light' ? 'blue.200' : 'blue.200'}
              color={'white.100'}
              fontSize={'13px'}
              fontWeight={300}
              _hover={{...theme.btnHover}}
              onClick={() => {
                action();
                handleCloseConfirmModal();
              }}
              mr="15px">
              Ok
            </Button>
            <Button
              w={110}
              h={'32px'}
              color={'gray.225'}
              bg={'transparent'}
              borderWidth={1}
              fontSize={'13px'}
              _hover={{}}
              onClick={() => {
                handleCloseConfirmModal();
              }}
              fontWeight={300}>
              Close
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
