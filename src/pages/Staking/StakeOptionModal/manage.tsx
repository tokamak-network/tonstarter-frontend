import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Stack,
  Grid,
} from '@chakra-ui/react';
import {FC} from 'react';

type ManageModalProps = {
  onOpenStakeOptionModal: Function;
  onOpenClaimOptionModal: Function;
  onOpenUnstakeOptionModal: Function;
  onEndSale: Function;
  onClose: Function;
  isOpen: boolean;
  balance: string;
};

export const ManageModal: FC<ManageModalProps> = ({
  onEndSale,
  onOpenClaimOptionModal,
  onOpenStakeOptionModal,
  onOpenUnstakeOptionModal,
  isOpen,
  onClose,
  balance,
}) => {
  return (
    <Modal isOpen={isOpen} isCentered onClose={() => onClose()}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Box my={3} textAlign="center">
            <Heading
              fontWeight={'normal'}
              fontSize={'3xl'}
              textAlign={'center'}>
              Manage
            </Heading>
            <Text>You can manage tokens</Text>
          </Box>

          <Stack
            p={5}
            as={Flex}
            justifyContent={'center'}
            alignItems={'center'}>
            <Box textAlign={'center'}>
              <Text>Available balance</Text>
              <Text>{balance} TON</Text>
            </Box>
          </Stack>

          <Grid templateColumns={'repeat(2, 1fr)'} gap={6}>
            <Button colorScheme="blue" onClick={() => onOpenStakeOptionModal()}>
              Stake
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => onOpenUnstakeOptionModal()}>
              Unstake
            </Button>
            <Button colorScheme="blue" onClick={() => onOpenClaimOptionModal()}>
              Claim
            </Button>
            <Button colorScheme="blue" onClick={() => onEndSale()}>
              End Sale
            </Button>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
