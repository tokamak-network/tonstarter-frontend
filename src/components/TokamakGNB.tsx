import {Flex, Link, Text} from '@chakra-ui/react';

function TokamakGNB() {
  function Menu(props: any) {
    return (
      <Text
        h={'45px'}
        lineHeight={'45px'}
        textAlign={'center'}
        cursor={'pointer'}
        _hover={{bg: '#ffffff', color: '#353c48'}}
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
        url={'https://rinkeby.tonstarter.tokamak.network/'}></Menu>
      <Menu
        title={'Staking'}
        w={'90px'}
        url={'https://simple.staking.tokamak.network/'}></Menu>
      <Menu
        title={'DAO'}
        w={'68px'}
        url={'https://dao.tokamak.network/#/'}></Menu>
      <Menu
        title={'Swap'}
        w={'76px'}
        url={'https://tonswapper.vercel.app/'}></Menu>
    </Flex>
  );
}

export default TokamakGNB;
