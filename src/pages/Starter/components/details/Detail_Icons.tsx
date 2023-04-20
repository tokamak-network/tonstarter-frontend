import {Flex, Text, useColorMode} from '@chakra-ui/react';
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

  const [mouseOver, setMouseOver] = useState<string | boolean>(false);
  const handleMouseOut = () => {
    setMouseOver(false);
  };
  const handleMouseOver = (e: any) => {
    if (e.target.parentNode.id) {
      setMouseOver(e.target.parentNode.id);
    }
    // setMouseOver(name);
  };
  return (
    <Flex>
      {linkInfo.map((link) => {
        if (link.url === '' || link.url === 'undefined') {
          return null;
        }
        return (
          <Flex
            cursor="pointer"
            alignItems="center"
            mr={'23px'}
            _hover={{}}
            id={link.sort}
            onMouseLeave={handleMouseOut}
            onMouseEnter={handleMouseOver}
            onClick={(e) => {
              e.preventDefault();
              window.open(`${link.url}`);
            }}>
            <Icons name={link.sort} mouseOver={mouseOver}></Icons>
            <Text
              ml={'5px'}
              fontSize={13}
              fontWeight={600}
              color={
                colorMode === 'light'
                  ? mouseOver === link.sort
                    ? 'blue.100'
                    : 'gray.375'
                  : mouseOver === link.sort
                  ? 'blue.100'
                  : 'white.100'
              }>
              {link.sort}
            </Text>
          </Flex>
        );
      })}
    </Flex>
  );
};
