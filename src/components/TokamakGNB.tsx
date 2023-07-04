import {Flex, Link, Text, useTheme} from '@chakra-ui/react';
import '@fontsource/titillium-web';

function TokamakGNB() {
  function Menu(props: any) {
    const theme = useTheme();
    return (
      <Text
        h={'45px'}
        lineHeight={'45px'}
        textAlign={'center'}
        cursor={'pointer'}
        bg={props.activetab ? '#FFFFFF' : ''}
        color={props.activetab ? '#353C48' : ''}
        fontFamily={'Titillium Web, sans-serif'}
        target={props.title === 'Bridge & Swap' ? '_blank' : '_self'}
        // fontWeight="bold"
        {...props}>
        <Link
          outline={'none'}
          _hover={{
            outline: 'none',
          }}
          _focus={{
            outline: 'none',
          }}
          href={props.url}>
          {props.title}
        </Link>
      </Text>
    );
  }

  return (
    <Flex
      w={'100%'}
      minW={'100vh'}
      h={'45px'}
      bg={'#2775ff'}
      color={'#ffffff'}
      fontSize={15}
      fontWeight={'bold'}
      justifyContent={'center'}>
      <Menu
        title={'Tokamak Network'}
        w={'158px'}
        url={'https://tokamak.network/#/'}></Menu>
      <Menu
        title={'L2 Mainnet'}
        w={'112px'}
        url={'https://titan.tokamak.network'}></Menu>
      <Menu
        title={'Bridge & Swap'}
        w={'136px'}
        url={'https://bridge.tokamak.network/#/'}></Menu>
      <Menu
        title={'Staking'}
        w={'90px'}
        url={'https://simple.staking.tokamak.network/'}></Menu>
      <Menu
        title={'DAO'}
        w={'68px'}
        url={'https://dao.tokamak.network/#/'}></Menu>
      <Menu
        title={'Launchpad'}
        activetab={'true'}
        w={'110px'}
        url={'https://tonstarter.tokamak.network/'}></Menu>
    </Flex>
  );
}

export default TokamakGNB;
