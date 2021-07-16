import {useAppDispatch} from 'hooks/useRedux';
import {closeModal} from 'store/modal.reducer';

export const useModal = (
  setValue: React.Dispatch<React.SetStateAction<any>>,
) => {
  const dispatch = useAppDispatch();
  const handleCloseModal = () => {
    console.log('???');
    setValue('0');
    dispatch(closeModal());
  };
  return {handleCloseModal};
};
