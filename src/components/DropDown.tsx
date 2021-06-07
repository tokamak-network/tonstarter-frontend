import {useState, useEffect} from 'react';
import {
  Box,
  Text,
  Flex,
  Image,
  useTheme,
} from '@chakra-ui/react';
import arrowFolded from 'assets/images/arrow-folded.png';
import arrowUnfolded from 'assets/images/arrow-unfolded.png';
import {css, Global} from '@emotion/react';

type dropDownProps = {
  items: Array<string>;
  hint: string;
  select: Function;

};

export const DropDown: React.FC<dropDownProps> = ({
  items,
  hint,
  select,
}) => {
  const theme = useTheme();
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [unfolded, setUnfolded] = useState<Boolean>(false);

  useEffect(() => {
    if (selectedItem === '') {
      setSelectedItem(hint);
    }
  }, [selectedItem, hint]);
  const selected = (item: string) => {
    setSelectedItem(item);
    setUnfolded(false);
    select(item)
  };
  return (
    <Box>
      <Flex
      onMouseDown={() => {
        unfolded ? setUnfolded(false) : setUnfolded(true);
      }}
      w={200}
      h={8}
        direction={'row'}
        py={3}
        px={3}
        shadow={'md'}
        alignItems={'center'}
        justifyContent={'space-between'}
        className={`dropdown-btn dropdown-btn-properties ${
          selectedItem === hint ? 'dropdown-btn-hint' : ''
        } ${unfolded ? 'dropdown-btn-unfolded' : ''}`}>
        {selectedItem}
        {unfolded ? (
          <Image src={arrowFolded} w={3} h={2} alt="" />
        ) : (
          <Image src={arrowUnfolded} w={3} h={2} alt="" />
        )}
      </Flex>
      <Box
        py={3}
        className={`dropdown-content ${
          unfolded ? 'dropdown-content-unfolded' : 'dropdown-content'
        }`}
        w={200}>
        {items.map((item, index) => (
          <Text
            className={'dropdown-item'}
            key={index}
            onClick={() => selected(item)}
            >
            {item}
          </Text>
        ))}
      </Box>
      <Global
        styles={css`
          .dropdown-btn {
            width: 100%;
            font-weight: normal;
            font-size: 13px;
            text-align: left;
            outline: none;
            padding-left: 16px;
          }
          .dropdown-btn:hover {
            cursor: pointer;
          }
          .dropdown-btn-disabled {
            border: solid 1px ${theme.colors.gray[125]};
            background-color: ${theme.colors.gray[25]};
          }
          .dropdown-btn-disabled:hover {
            cursor: not-allowed;
          }
          .dropdown-content {
            display: none;
            position: absolute;
            border-radius: 4px;
            box-shadow: 0 2px 4px 0 rgba(96, 97, 112, 0.14);
            margin-top: 5px;
          }
          .dropdown-content-unfolded {
            display: flex;
            flex-direction: column;
          }

          .dropdown-item {
            height: 32px;
            font-weight: normal;
            font-family: ${theme.fonts.heading};
            font-size: 13px;
            letter-spacing: 0.2px;
            text-align: left;
            border: none;
            outline: none;
            padding-left: 15px;
          }
          .dropdown-item:hover {
            cursor: pointer;
          }
          .dropdown-btn {
            border-radius: 4px;
          }
          .dropdown-item:hover {
            color: ${theme.colors.blue[300]};
          }
        `}
      />
    </Box>
  );
};
