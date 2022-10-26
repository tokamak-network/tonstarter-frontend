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
        bg={props.active ? '#FFFFFF' : ''}
        color={props.active ? '#353C48' : ''}
        _hover={{bg: '#ffffff', color: '#353c48'}}
        fontFamily={'Titillium Web, sans-serif'}
        fontWeight="bold"
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
      <Menu title={'Vision'} w={'100px'} url={''}></Menu>
      <Menu
        title={'Tokamak Network'}
        w={'158px'}
        url={'https://tokamak.network/#/'}></Menu>
      <Menu
        title={'TONStarter'}
        w={'114px'}
        url={'https://ico2-0-frontend.vercel.app/'}
        active={true}></Menu>
      <Menu
        title={'Staking'}
        w={'90px'}
        url={'https://rinkeby.simple.staking.tokamak.network/'}></Menu>
      <Menu
        title={'DAO'}
        w={'68px'}
        url={'https://rinkeby.dao.tokamak.network/#/'}></Menu>
      <Menu
        title={'Swap'}
        w={'76px'}
        url={'https://tonswapper.vercel.app/'}></Menu>
    </Flex>
  );
}

export default TokamakGNB;
