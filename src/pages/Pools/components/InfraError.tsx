import {Text, Flex} from '@chakra-ui/react';

export const InfraError = () => {
  return (
    <Flex
      w="100%"
      h={'38px'}
      bg={'#ff3b3b'}
      borderRadius={4}
      alignContent="center"
      alignItems="center">
      <Text w="100%" textAlign="center" fontSize={'14px'} color="white.100">
        <span style={{fontWeight: 'bold'}}>Notice!</span> Failed to index data
        from The Graph, Please try to connect later{' '}
        <span
          style={{
            fontWeight: 'bold',
            textDecoration: 'underline',
            cursor: 'pointer',
            marginLeft: '10px',
          }}
          onClick={() => window.location.reload()}>
          Click to Reload
        </span>
      </Text>
    </Flex>
  );
};
