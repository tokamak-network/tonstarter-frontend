import {Flex, Image, Text,useColorMode} from '@chakra-ui/react';
import {useAppDispatch} from 'hooks/useRedux';
import {openModal} from 'store/modal.reducer';
import PlusIcon from 'assets/launch/vault-plus-inactive-button.svg';
import BluePlusIcon from 'assets/launch/vault-plus-active-button.svg';
import {useState} from 'react';

const AddVaultCard = () => {
  const {colorMode} = useColorMode();
  const dispatch = useAppDispatch();
  const [isHover, setIsHover] = useState<boolean>(false);
  function open() {
    dispatch(
      openModal({
        type: 'Launch_CreateVault',
        data: {},
      }),
    );
  }
  return (
    <Flex
      w={'150px'}
      h={'196px'}
      flexDir={'column'}
      boxShadow={' 0 2px 5px 0 rgba(61, 73, 93, 0.1)'}
      border={
        isHover
          ? '1px solid #0070ed'
          : colorMode === 'light'
          ? ''
          : '1px solid #373737'
      }>
      <Text
        fontSize={16}
        fontWeight={'bold'}
        h={'21px'}
        mt={'44px'}
        textAlign="center"
        mb={'51px'}>
        Public
      </Text>
      <Flex alignItems={'center'} justifyContent="center">
        <Image
          w={'50px'}
          h={'50px'}
          onMouseOver={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          src={isHover ? BluePlusIcon : PlusIcon}
          cursor="pointer"
          onClick={() => open()}></Image>
      </Flex>
    </Flex>
  );
};

export default AddVaultCard;
