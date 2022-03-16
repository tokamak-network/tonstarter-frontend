import {Flex, Grid, GridItem, Text, useColorMode} from '@chakra-ui/react';
import {useTheme} from '@emotion/react';

const MainTitle = (props: {leftTitle: string; rightTitle: string}) => {
  const {leftTitle, rightTitle} = props;
  return (
    <Flex
      pl={'25px'}
      pr={'20px'}
      h={'60px'}
      alignItems="center"
      justifyContent={'space-between'}
      borderBottom={'solid 1px #e6eaee'}
      fontWeight={600}>
      <Text fontSize={14}>{leftTitle}</Text>
      <Text>{rightTitle}</Text>
    </Flex>
  );
};

const SubTitle = (props: {
  leftTitle: string;
  rightTitle: string;
  isLast?: boolean;
}) => {
  const {leftTitle, rightTitle, isLast} = props;
  return (
    <Flex
      pl={'25px'}
      pr={'20px'}
      h={'60px'}
      alignItems="center"
      justifyContent={'space-between'}
      borderBottom={isLast ? '' : 'solid 1px #e6eaee'}
      fontWeight={600}>
      <Text color={'#7e8993'}>{leftTitle}</Text>
      <Text>{rightTitle}</Text>
    </Flex>
  );
};

const TokenDetail = () => {
  const theme = useTheme();
  //@ts-ignore
  const {OpenCampaginDesign} = theme;
  const {colorMode} = useColorMode();
  return (
    <Grid
      {...OpenCampaginDesign.border({colorMode})}
      w={'100%'}
      templateColumns="repeat(3, 1fr)"
      fontSize={13}>
      <GridItem>
        <MainTitle leftTitle="Token" rightTitle="Token"></MainTitle>
        <SubTitle leftTitle="Token" rightTitle="Token"></SubTitle>
      </GridItem>
      <GridItem pl={'25px'} pr={'20px'} borderX={'solid 1px #e6eaee'}>
        <Flex h={'60px'} justifyContent={'space-between'} fontWeight={600}>
          <Text fontSize={14}>Token</Text>
          <Text>Token</Text>
        </Flex>
      </GridItem>
      <GridItem pl={'25px'} pr={'20px'}>
        <Flex h={'60px'} justifyContent={'space-between'} fontWeight={600}>
          <Text fontSize={14}>Token</Text>
          <Text>Token</Text>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default TokenDetail;
