import { Link, Image, Text} from '@chakra-ui/react';
import  UserGuideImage  from '../../../../../assets/svgs/sicon-user_guide.svg';
// TODO: import user guide url

export const UserGuideLink = () => {
    return (
    <>
    <Image ml={4} src={UserGuideImage} alt="sicon_user_guide" />
    <Link>
        <Text mt={2} ml={1} fontSize={13} color="gray.350">User Guide</Text>
    </Link>
    </>
    )
}