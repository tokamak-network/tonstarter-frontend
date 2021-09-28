import {Flex, Link, Text, useColorMode} from '@chakra-ui/react';
import {Icons} from 'components/Icons/Icon';
import {useState} from 'react';
import {IconsSort} from 'types';

interface SocialLink {
  sort: IconsSort;
  url: string;
}

type DetailIconProp = {
  linkInfo: SocialLink[];
};

export const DetailIcons = (prop: DetailIconProp) => {
  const {linkInfo} = prop;
  const {colorMode} = useColorMode();

  const [mouseOver, setMouseOver] = useState(false);
  const handleMouseOut = () => {
    setMouseOver(false);
  };
  const handleMouseOver = () => {
    setMouseOver(true);
  };
  return (
    <Flex>
      {linkInfo.map((link) => {
        return (
          <Flex
            cursor="pointer"
            alignItems="center"
            mr={'23px'}
            _hover={{}}
            onMouseLeave={handleMouseOut}
            onMouseOver={handleMouseOver}
            onClick={(e) => {
              e.preventDefault();
              window.open(`${link.url}`);
            }}>
            <Icons name={link.sort} mouseOver={mouseOver}></Icons>
            <Text
              ml={'5px'}
              fontSize={13}
              fontWeight={600}
              color={colorMode === 'light' ? 'gray.375' : 'white.100'}>
              {link.sort}
            </Text>
          </Flex>
        );
      })}
    </Flex>
  );
};
