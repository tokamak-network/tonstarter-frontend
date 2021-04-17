import {FC} from 'react';
import {AbstractConnector} from '@web3-react/abstract-connector';
import {Box, Button, Flex} from '@chakra-ui/react';

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
  return (
    <Box>
      {error ? (
        <Flex alignItems="center">
          <div>Error connecting.</div>
          <Button
            size="sm"
            ml={2}
            onClick={() => {
              setPendingError(false);
              connector && tryActivation(connector);
            }}>
            Try Again
          </Button>
        </Flex>
      ) : (
        <>Initializing...</>
      )}
    </Box>
  );
};
