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
              <Text>xxx TON</Text>
            </Box>
            <Box textAlign={'center'}>
              <Text>Total: xxxx TON</Text>
              <Text>Staked in Layer 2: xxxx TON</Text>
            </Box>
          </Stack>

          <Grid templateColumns={'repeat(2, 1fr)'} gap={6}>
            <Button colorScheme="blue" onClick={() => onOpenStakeOptionModal()}>
              Stake in Layer2 
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => onOpenUnstakeOptionModal()}>
              Unstake from Layer2
            </Button>
            <Button colorScheme="blue" onClick={() => onOpenClaimOptionModal()}>
              Withdraw
            </Button>
            <Button colorScheme="blue" onClick={() => onEndSale()}>
             Swap
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
