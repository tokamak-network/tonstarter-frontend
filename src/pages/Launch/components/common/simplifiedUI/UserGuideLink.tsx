import {Link, Image, Text} from '@chakra-ui/react';
import UserGuideImage from '../../../../../assets/svgs/sicon-user_guide.svg';

// TODO: import user guide url

export const UserGuideLink = () => {
  return (
    <>
      <Image ml={'21px'} src={UserGuideImage} alt="sicon_user_guide" />
      <Link>
        <Text
          mt={2}
          ml={'6px'}
          fontSize={13}
          color="gray.400"
          fontFamily={'Titillium Web, sans-serif'}>
          User Guide
        </Text>
      </Link>
    </>
  );
};
