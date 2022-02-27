import {Button, Flex, useColorMode} from '@chakra-ui/react';
import useValues from '@Launch/hooks/useValues';
import saveProject from '@Launch/utils/saveProject';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {Box} from 'rebass';

type StepTitleProp = {
  title: string;
  fontSize?: number;
  isSaveButton?: boolean;
  lineHeight?: number;
};

const StepTitle: React.FC<StepTitleProp> = (prop) => {
  const {title, fontSize, isSaveButton, lineHeight} = prop;
  const {colorMode} = useColorMode();
  const {account} = useActiveWeb3React();

  const {initialValues} = useValues();

  return (
    <Flex
      justifyContent={'space-between'}
      h={'100%'}
      textAlign="center"
      verticalAlign={'middle'}
      lineHeight={lineHeight || '36px'}>
      <Box fontSize={fontSize || 20} color={'black.300'} fontWeight={600}>
        {title}
      </Box>
      {isSaveButton && (
        <Button
          w={'120px'}
          h={'38px'}
          fontSize={14}
          color={'white.100'}
          _hover={{}}
          bg={colorMode ? 'blue.500' : 'blue.500'}
          // disabled={isDisable || isSubmitting}
          onClick={() => account && saveProject(initialValues, account)}>
          Save
        </Button>
      )}
    </Flex>
  );
};

export default StepTitle;
