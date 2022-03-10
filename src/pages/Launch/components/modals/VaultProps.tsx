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
import React, {useMemo} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal';
import {selectLaunch} from '@Launch/launch.reducer';
import {PublicPropsSetting} from '@Launch/components/common/VaultPropsSetting';

const LaunchVaultPropModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {
    data: {selectedVault},
  } = useAppSelector(selectLaunch);

  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const {btnStyle} = theme;

  const VaultSetting = useMemo(() => {
    switch (selectedVault) {
      case 'Public':
        return <PublicPropsSetting></PublicPropsSetting>;
      case 'LP':
        return <Flex>go</Flex>;
      case 'TON Staker':
        return <Flex>go</Flex>;
      case 'TOS Staker':
        return <Flex>go</Flex>;
      case 'WTON-TOS LP Reward':
        return <Flex>go</Flex>;
      default:
        return <>no container for this vault :(</>;
    }
  }, [selectedVault]);

  return (
    <Modal
      isOpen={data.modal === 'Launch_VaultProps' ? true : false}
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
              Starter
            </Heading>
          </Box>

          <Flex
            flexDir="column"
            alignItems="center"
            mt={3}
            px={5}
            fontSize={15}
            color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
            {VaultSetting}
          </Flex>

          <Box as={Flex} flexDir="column" alignItems="center" pt={5}>
            <Button
              {...btnStyle.btnAble()}
              w={'150px'}
              fontSize="14px"
              _hover={{}}>
              Approve
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LaunchVaultPropModal;
