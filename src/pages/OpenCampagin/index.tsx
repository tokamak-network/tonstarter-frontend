import {Flex, useTheme, Button} from '@chakra-ui/react';
import OpenStepOne from '@OpenCampagin/components/OpenStepOne';

const OpenCampagin = () => {
  const theme = useTheme();

  return (
    <Flex mt={theme.headerMargin.mt} flexDir="column">
      <Flex justifyContent={'center'} mb={50}>
        <Button bg={'red.100'} color={'white.100'} _hover={{}}>
          Save(server)
        </Button>
      </Flex>
      <Flex>
        <OpenStepOne></OpenStepOne>
      </Flex>
      <Flex></Flex>
      <Flex></Flex>
    </Flex>
  );
};

export default OpenCampagin;
