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
  Input,
  Stack,
  useTheme,
  useColorMode,
  Select,
} from '@chakra-ui/react';
import React from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {onKeyDown, useInput} from 'hooks/useInput';
import {useModal} from 'hooks/useModal';
import {useState, useEffect, useRef} from 'react';

type SelectPeriod = '1month' | '6months' | '1year' | '3year';

export const DaoUnstakeModal = () => {
  const {data} = useAppSelector(selectModalType);

  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {btnStyle} = theme;
  const {value, setValue, onChange} = useInput();
  const {handleCloseModal, handleOpenConfirmModal} = useModal(setValue);

  const [btnDisabled, setBtnDisabled] = useState(false);

  useEffect(() => {}, []);

  return (
    <Modal
      isOpen={data.modal === 'dao_unstake' ? true : false}
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
              Stake
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              You can earn sTOS
            </Text>
          </Box>

          <Box as={Flex} justifyContent={'center'}>
            <Button
              {...(btnDisabled === true
                ? {...btnStyle.btnDisable({colorMode})}
                : {...btnStyle.btnAble()})}
              w={'150px'}
              fontSize="14px"
              _hover={{...theme.btnHover}}
              disabled={btnDisabled}
              onClick={() => {
                handleOpenConfirmModal({
                  type: 'confirm',
                  data: {
                    amount: value,
                    // period,
                    action: () => {},
                  },
                });
              }}>
              Stake
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
