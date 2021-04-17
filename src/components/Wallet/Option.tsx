import {Box, Text, Image, Flex} from '@chakra-ui/react';
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
  icon,
}) => {
  console.log(icon);
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
      <Flex align="center">
        <Image mr={2} w={5} height={5} src={icon} alt={header} />
        <Text fontSize="md">{header}</Text>
      </Flex>
      <Text fontSize="sm">{subheader}</Text>
    </Box>
  );
};
