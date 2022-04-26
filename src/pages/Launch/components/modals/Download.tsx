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
  Checkbox,
  useTheme,
  Select,
  useColorMode,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal';

const DownloadModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const participantList = [];
  const [selectedValue, setSelectedValue] = useState<string>('Option 1');
  return (
    <Modal
      isOpen={data.modal === 'Launch_Download' ? true : false}
      isCentered
      onClose={() => {
        handleCloseModal();
      }}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
        pt="20px"
        pb="25px">
        <CloseButton closeFunc={handleCloseModal}></CloseButton>
        <ModalBody p={0}>
          <Box
            pb={'1.250em'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Heading
              fontSize={'20px'}
              fontWeight={'bold'}
              fontFamily={theme.fonts.titil}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              textAlign={'center'}>
              Download
            </Heading>
          </Box>

          <Flex
            flexDir="column"
            px={'30px'}
            mt={'20px'}
            fontSize={13}
            color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
            <Text>Project Name</Text>
            <Select
              fontSize={13}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              mt={'12px'}
              w={'290px'}
              h={'32px'}
              mb={'30px'}
              border={'1px solid #dfe4ee'}
              _focus={{border: '1px solid #dfe4ee'}}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedValue(value);
              }}>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
            <Text mb={'5px'} fontSize={'13px'}>Participants List</Text>
            <Checkbox fontWeight={'bold'} fontSize={'14px'} h={'45px'}>Whitelisted</Checkbox>
            <Checkbox fontWeight={600} fontSize={'14px'} h={'45px'}>Public Round 1</Checkbox>
            <Checkbox fontWeight={600} fontSize={'14px'} h={'45px'}>Public Round 2</Checkbox>
          </Flex>

          <Box
            mt={'20px'}
            mb={'25px'}
            mx={'15px'}
            width={'320px'}
            height={'1px'}
            bg={colorMode === 'light' ? '#f4f6f8' : '#373737'}></Box>

          <Box
            as={Flex}
            flexDir="row"
            alignItems="center"
            justifyContent={'space-between'}
            px={'19px'}>
            <Button
              fontSize={'14px'}
              w="150px"
              h="38px"
              color={colorMode === 'light' ? '#3e495c' : '#ffffff'}
              bg={'transparent'}
              _hover={{bg: 'transparent'}}
              border={
                colorMode === 'light'
                  ? '1px solid #dfe4ee'
                  : '1px solid #535353'
              }
              onClick={() => handleCloseModal()}>
              Cancel
            </Button>
            <Button
              fontSize={'14px'}
              w="150px"
              h="38px"
              bg={'#257eee'}
              color={'#ffffff'}
              _hover={{bg: '#257eee'}}>
              Download
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DownloadModal;
