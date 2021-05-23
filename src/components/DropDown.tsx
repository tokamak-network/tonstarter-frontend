import {useState, useEffect} from 'react';
import {
  Box,
  Text,
  Button,
  Stack,
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
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [unfolded, setUnfolded] = useState<Boolean>(false);

  useEffect(() => {
    if (selectedItem === '') {
      setSelectedItem(hint);
    }
  }, [selectedItem]);
  const selected = (item: string) => {
    setSelectedItem(item);
    setUnfolded(false);
    select(item)
    console.log(item);
  };
  return (
    <Box
      w={'xs'}>
      <Flex
      onMouseDown={() => {
        unfolded ? setUnfolded(false) : setUnfolded(true);
      }}
        direction={'row'}
        py={3}
        px={3}
        alignItems={'center'}
        justifyContent={'space-between'}
        borderWidth={1}
        className={`dropdown-btn ${
          selectedItem === hint ? 'dropdown-btn-hint' : ''
        } ${unfolded ? 'dropdown-btn-unfolded' : ''}`}>
        {selectedItem}
        {unfolded ? (
          <Image src={arrowFolded} w={3} h={2} alt="arrow folded" />
        ) : (
          <Image src={arrowUnfolded} w={3} h={2} alt="arrow unfolded" />
        )}
      </Flex>
      <Box
        py={3}
        className={`dropdown-content ${
          unfolded ? 'dropdown-content-unfolded' : 'dropdown-content'
        }`}
        w={'xs'}>
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
            height: 32px;
            font-family: Roboto;
            font-size: 12px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            letter-spacing: 0.2px;
            text-align: left;
            color: #86929d;
            border-radius: 4px;
            outline: none;
            padding-left: 16px;
          }
          .dropdown-btn-hint {
            color: #86929d;
          }
          .dropdown-btn:hover {
            cursor: pointer;
          }
          .dropdown-btn-a:active,
          dropdown-btn-b:active {
            color: #3e495c;
          }
          .dropdown-btn-hint {
            color: #86929d;
          }
          .dropdown-btn-unfolded {
            color: #3e495c;
          }
          .dropdown-btn-disabled {
            border: solid 1px #dfe4ee;
            background-color: #e9edf1;
          }
          .dropdown-btn-disabled:hover {
            cursor: not-allowed;
          }
          .dropdown-content {
            display: none;
            position: absolute;
            background: #ffffff;
            border-radius: 4px;
            box-shadow: 0 2px 4px 0 rgba(96, 97, 112, 0.14);
            margin-top: 5px;
          }
          .dropdown-content-unfolded {
            display: flex;
            flex-direction: column;
          }
          .dropdown-content-disabled {
            color: #8f96a1;
          }

          .dropdown-item {
            height: 32px;
            font-family: Roboto;
            font-size: 12px;
            font-weight: lighter;
            font-stretch: normal;
            font-style: normal;
            letter-spacing: 0.2px;
            text-align: left;
            color: #3e495c;
            background: #ffffff;
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
            color: #2a72e5;
          }
        `}
      />
    </Box>
  );
};
