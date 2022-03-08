import {Flex} from '@chakra-ui/react';
import {useAppDispatch} from 'hooks/useRedux';
import {openModal} from 'store/modal.reducer';

const AddVaultCard = () => {
  const dispatch = useAppDispatch();
  function open() {
    dispatch(
      openModal({
        type: 'Launch_CreateVault',
        data: {},
      }),
    );
  }
  return <Flex onClick={() => open()}>Plus</Flex>;
};

export default AddVaultCard;
