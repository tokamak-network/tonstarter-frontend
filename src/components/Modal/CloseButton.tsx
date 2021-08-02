import {Image} from '@chakra-ui/react';
import closeIcon from 'assets/svgs/popup_close_icon.svg';

export const CloseButton = (props: any) => {
  const {closeFunc} = props;
  return (
    <Image
      src={closeIcon}
      pos="absolute"
      w={'34px'}
      h={'34px'}
      right={-8}
      top={-8}
      cursor="pointer"
      onClick={() => closeFunc()}></Image>
  );
};
