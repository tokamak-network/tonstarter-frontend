import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Heading,
  Text,
  Button,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import {useState, FC, useCallback} from 'react';

type StakeOptionModalProps = {
  isOpen: boolean;
  onClose: Function;
  stakeOption: {
    title: string;
    subtitle?: string;
  };
};

export const StakeOptionModal: FC<StakeOptionModalProps> = ({
  isOpen,
  onClose,
  stakeOption: {subtitle, title},
}) => {
  const [value, setValue] = useState<number>(0);

  const handleChange = useCallback(value => setValue(value), []);
  return (
    <Modal isOpen={isOpen} isCentered onClose={() => onClose()}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Box textAlign="center">
            <Heading
              fontWeight={'normal'}
              fontSize={'2xl'}
              textAlign={'center'}>
              {title}
            </Heading>
            <Text>{subtitle}</Text>
          </Box>

          <Box>
            <NumberInput
              maxW="100px"
              mr="2rem"
              value={value}
              borderWidth={0}
              borderColor={'transparent'}
              _focus={{
                borderColor: 'transparent',
                borderWidth: 0,
              }}
              _active={{
                borderColor: 'transparent',
                borderWidth: 0,
              }}
              onChange={handleChange}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Box>

          <Box></Box>

          <Button>Claim</Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
