import {FC} from 'react';
import {AbstractConnector} from '@web3-react/abstract-connector';
import {Box, Button, Flex, Text, Spinner} from '@chakra-ui/react';
import {useLocalStorage} from 'hooks/useStorage';

type WalletPendingProps = {
  connector?: AbstractConnector;
  error?: boolean;
  setPendingError: (error: boolean) => void;
  tryActivation: (connector: AbstractConnector) => void;
};
export const WalletPending: FC<WalletPendingProps> = ({
  error,
  connector,
  setPendingError,
  tryActivation,
}) => {
  /*eslint-disable */
  const [accountValue, setAccountValue] = useLocalStorage('account', {});
  return (
    <Box>
      {error ? (
        <Flex alignItems="center">
          <Text>Error connecting to wallet.</Text>
          <Button
            size="xs"
            colorScheme={'blue'}
            ml={2}
            onClick={() => {
              setPendingError(false);
              // setAccountValue({signIn: false});
              connector && tryActivation(connector);
            }}>
            Try Again
          </Button>
        </Flex>
      ) : (
        <Flex alignItems="center">
          <Spinner size={'sm'} color="red.500" />
          <Text ml={3}>Connecting to a wallet</Text>
        </Flex>
      )}
    </Box>
  );
};
