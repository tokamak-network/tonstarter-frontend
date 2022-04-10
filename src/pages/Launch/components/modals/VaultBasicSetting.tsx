import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Heading,
  Text,
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
import {Projects} from '@Launch/types';
import {useFormikContext} from 'formik';
import Line from '@Launch/components/common/Line';
import {CustomButton} from 'components/Basic/CustomButton';

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
            py={'1.250em'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Heading
              fontSize={'1.250em'}
              fontWeight={'bold'}
              fontFamily={theme.fonts.titil}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              textAlign={'center'}>
              Vault Resister
            </Heading>
          </Box>

          <Flex
            flexDir="column"
            alignItems="center"
            mt={'30px'}
            pl={'35px'}
            fontSize={13}
            color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
            <Flex w={'100%'} flexDir={'column'} mb={'24px'}>
              <Text fontWeight={600} mb={'9px'}>
                Vault Name
              </Text>
              <Input
                w={'290px'}
                h={'32px'}
                value={nameVal}
                _focus={{}}
                onChange={(e) =>
                  isMandatory ? null : setNameVal(e.target.value)
                }></Input>
            </Flex>
            <Flex w={'100%'} flexDir={'column'} mb={'24px'}>
              <Text fontWeight={600} mb={'9px'}>
                Token Allocation
              </Text>
              <Input
                w={'290px'}
                h={'32px'}
                value={tokenAllocatonVal}
                _focus={{}}
                onChange={(e) => {
                  setTokenAllocatonVal(Number(e.target.value));
                }}></Input>
            </Flex>
            <Flex w={'100%'} flexDir={'column'}>
              <Text fontWeight={600} mb={'9px'}>
                Admin Address
              </Text>
              <Input
                w={'290px'}
                h={'32px'}
                value={adminAddressVal}
                _focus={{}}
                onChange={(e) => setAdminAddressVal(e.target.value)}></Input>
            </Flex>
          </Flex>

          <Box mt={'39px'} mb={'25px'} px={'15px'}>
            <Line></Line>
          </Box>

          <Box as={Flex} flexDir="column" alignItems="center" pt={5}>
            <CustomButton
              text={'Edit'}
              func={() => {
                editVault();
                handleCloseModal();
              }}></CustomButton>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VaultBasicSetting;
