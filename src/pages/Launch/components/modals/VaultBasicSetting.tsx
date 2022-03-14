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
  Input,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal';
import {Projects, VaultAny} from '@Launch/types';
import {useFormikContext} from 'formik';

const VaultBasicSetting = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const [nameVal, setNameVal] = useState('');
  const [tokenAllocatonVal, setTokenAllocatonVal] = useState(0);
  const [adminAddressVal, setAdminAddressVal] = useState('');

  useEffect(() => {
    if (data.data) {
      const {
        data: {name, tokenAllocation, adminAddress},
      } = data;
      setNameVal(name);
      setTokenAllocatonVal(tokenAllocation);
      setAdminAddressVal(adminAddress);
    }
  }, [data]);

  if (!data.data) {
    return null;
  }

  const {
    data: {name, isMandatory},
  } = data;

  function editVault() {
    const vaultsList = values.vaults;
    setFieldValue(
      'vaults',
      vaultsList.map((vault: any) => {
        if (vault.vaultName === name) {
          return {
            ...vault,
            name: nameVal,
            vaultTokenAllocation: tokenAllocatonVal,
            adminAddress: adminAddressVal,
          };
        }
        return vault;
      }),
    );
  }

  return (
    <Modal
      isOpen={data.modal === 'Launch_VaultBasicSetting' ? true : false}
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
              Vault Basic
            </Heading>
            {/* <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              Vault Basic
            </Text> */}
          </Box>

          <Flex
            flexDir="column"
            alignItems="center"
            mt={3}
            px={5}
            fontSize={15}
            color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
            <Flex>
              <Text>Vault Name</Text>
              <Input
                value={nameVal}
                onChange={(e) =>
                  isMandatory ? null : setNameVal(e.target.value)
                }></Input>
            </Flex>
            <Flex>
              <Text>Token Allocation</Text>
              <Input
                value={tokenAllocatonVal}
                onChange={(e) =>
                  setTokenAllocatonVal(Number(e.target.value))
                }></Input>
            </Flex>
            <Flex>
              <Text>Admin Address</Text>
              <Input
                value={adminAddressVal}
                onChange={(e) => setAdminAddressVal(e.target.value)}></Input>
            </Flex>
          </Flex>

          <Box as={Flex} flexDir="column" alignItems="center" pt={5}>
            <Button onClick={() => editVault()}>Edit</Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VaultBasicSetting;
