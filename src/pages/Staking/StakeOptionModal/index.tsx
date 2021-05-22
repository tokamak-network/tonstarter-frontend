import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Heading,
  Text,
  Button,
  useStyleConfig,
  Flex,
} from '@chakra-ui/react';
import React, {FC, useCallback, useState} from 'react';

type StakeOptionModalProps = {
  isOpen: boolean;
  onClose: Function;
  stakeOption: {
    title: string;
    subtitle?: string;
  };
  form: {
    size: any;
    variant: any;
  };
};

export const StakeOptionModal: FC<StakeOptionModalProps> = ({
  isOpen,
  onClose,
  stakeOption: {subtitle, title},
  form: {size, variant},
}) => {
  const styles = useStyleConfig('Input', size, variant);
  const [value, setValue] = useState<number>(10);

  const handleChange = useCallback(e => setValue(e.target.value), []);
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

          <Flex py={10} justifyContent={'center'} w={'full'}>
            <Box
              as={'input'}
              sx={styles}
              value={value}
              fontSize={'4xl'}
              onChange={handleChange}
            />
          </Flex>

          <Box></Box>

          <Button alignSelf={'flex-end'}>{title}</Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
