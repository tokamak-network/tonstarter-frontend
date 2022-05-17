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
import useValues from '@Launch/hooks/useValues';
import Line from '@Launch/components/common/Line';
import {CustomButton} from 'components/Basic/CustomButton';
import {CustomSelectBox} from 'components/Basic';
import {useToast} from 'hooks/useToast';

const CreateVaultModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const [nameVal, setNameVal] = useState('');
  const [tokenAllocatonVal, setTokenAllocatonVal] = useState(0);
  const [adminAddressVal, setAdminAddressVal] = useState(values.owner);
  const {initialVaultValue} = useValues();
  const selectOptionValues = ['C', 'DAO', 'Liquidity Incentive'];
  const selectOptionNames = ['Custom', 'DAO', 'Liquidity Incentive'];
  const [selectVaultType, setSelectVaultType] = useState<
    'C' | 'DAO' | 'Liquidity Incentive'
  >('C');
  const [btnDisable, setBtnDisable] = useState<boolean>(false);

  const {toastMsg} = useToast();

  function editVault() {
    const vaultsList = values.vaults;
    setFieldValue('vaults', [
      ...vaultsList,
      {
        ...initialVaultValue,
        vaultType: selectVaultType,
        vaultName: nameVal,
        vaultTokenAllocation: tokenAllocatonVal,
        adminAddress: adminAddressVal,
        index: vaultsList.length,
      },
    ]);
  }

  useEffect(() => {
    if (nameVal === undefined) {
      return;
    }
    const totalAllocation = values.vaults.reduce((acc, cur) => {
      if (cur.vaultName === nameVal.replaceAll('*', '').replaceAll(' ', '')) {
        return acc;
      }
      return acc + cur.vaultTokenAllocation;
    }, 0);
    if (
      values.totalSupply &&
      totalAllocation + Number(tokenAllocatonVal) > values.totalSupply
    ) {
      setBtnDisable(true);
      toastMsg({
        title: 'Token allocation is over total supply amount',
        description: 'The sum of token allocation has reached the total supply',
        duration: 2000,
        status: 'error',
        isClosable: true,
      });
    } else {
      setBtnDisable(false);
    }
  }, [tokenAllocatonVal, nameVal, values, toastMsg]);

  const closeModal = () => {
    setSelectVaultType('C');
    setNameVal('');
    setTokenAllocatonVal(0);
    setAdminAddressVal(values.owner);
    handleCloseModal();
  };

  return (
    <Modal
      isOpen={data.modal === 'Launch_CreateVault' ? true : false}
      isCentered
      onClose={() => {
        closeModal();
      }}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
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
              fontSize={'1.250em'}
              fontWeight={'bold'}
              fontFamily={theme.fonts.titil}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              textAlign={'center'}>
              Vault Register
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
                Vault Type
              </Text>
              <CustomSelectBox
                w={'290px'}
                h={'32px'}
                list={selectOptionValues}
                optionName={selectOptionNames}
                setValue={setSelectVaultType}
                fontSize={'12px'}></CustomSelectBox>
            </Flex>
            <Flex w={'100%'} flexDir={'column'} mb={'24px'}>
              <Text fontWeight={600} mb={'9px'}>
                Vault Name
              </Text>
              <Input
                w={'290px'}
                h={'32px'}
                value={nameVal}
                _focus={{}}
                onChange={(e) => setNameVal(e.target.value)}></Input>
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
                  if (isNaN(Number(e.target.value))) {
                    return;
                  }
                  setTokenAllocatonVal(Number(e.target.value));
                }}></Input>
            </Flex>
            <Flex w={'100%'} flexDir={'column'}>
              <Text fontWeight={600} mb={'9px'}>
                Admin Address
              </Text>
              <Input
                fontSize={11}
                padding={0}
                paddingLeft={'11px'}
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
              text={'Add'}
              isDisabled={btnDisable}
              func={() => {
                editVault();
                closeModal();
              }}></CustomButton>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateVaultModal;
