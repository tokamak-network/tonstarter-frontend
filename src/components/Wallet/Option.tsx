import {Box, Text} from '@chakra-ui/react';
import {FC} from 'react';

type WalletOptionProps = {
  onClick?: () => void;
  id: string;
  active?: boolean;
  clickable?: boolean;
  color: string;
  link?: string | null;
  header: string;
  subheader: string | null;
  icon?: string;
};

export const WalletOption: FC<WalletOptionProps> = ({
  onClick,
  id,
  header,
  subheader,
}) => {
  return (
    <Box
      id={id}
      onClick={onClick}
      cursor="pointer"
      borderWidth={1}
      rounded={5}
      px={5}
      py={3}
      mb={3}>
      <Text fontSize="md">{header}</Text>
      <Text fontSize="sm">{subheader}</Text>
    </Box>
  );
};
