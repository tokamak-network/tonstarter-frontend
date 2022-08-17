import {FC, useEffect, useState} from 'react';
import {
  Flex,
  Text,
  useTheme,
  useColorMode,
  Link,
  Grid,
  GridItem,
} from '@chakra-ui/react';
// import ReactMarkdown from 'react-markdown'
import ReactQuill from 'react-quill';
import {fetchTosPriceURL} from 'constants/index';

import {shortenAddress} from 'utils';
import {BASE_PROVIDER} from 'constants/index';

import 'react-quill/dist/quill.bubble.css';
import {important} from 'polished';

type ProjectTokenProps = {
  project: any;
};

export const MobileProjectToken: FC<ProjectTokenProps> = ({project}) => {
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const network = BASE_PROVIDER._network.name;
  const [salePrice, setSalePrice] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const modules = {
    toolbar: [
      [{header: [1, 2, 3, 4, 5, 6, false]}],
      ['bold', 'italic', 'underline', 'strike'],

      ['blockquote', 'code-block'],
      [{list: 'ordered'}, {list: 'bullet'}],
      [{indent: '-1'}, {indent: '+1'}, {align: []}],
      ['link', 'image', 'video', 'color'],
      ['clean'],
    ], // options here
  };

  useEffect(() => {
    const setTos = async () => {
      const tosPrices = await fetch(fetchTosPriceURL)
        .then((res) => res.json())
        .then((result) => result);
      const projectTokenPrice = project.tosPrice;
      const tosInToken = 1 / Number(projectTokenPrice);
      const tokenInDollars = tosInToken * tosPrices;
      setCurrentPrice(tokenInDollars);
    };

    setTos();
  }, [project]);

  const quillStyle =
    colorMode === 'light'
      ? `.ql-editor span {
      color: #000000 !important
  }
  .ql-bubble .ql-editor a {
    color: #2a72e5 !important
  }`
      : `.ql-editor span {
    color: #ffffff !important
}
.ql-bubble .ql-editor a {
  color: #2a72e5 !important
}`;
  const themeDesign = {
    border: {
      light: 'solid 1px #e6eaee',
      dark: 'solid 1px #373737',
    },
    font: {
      light: 'black.300',
      dark: 'gray.475',
    },
    tosFont: {
      light: 'gray.250',
      dark: 'black.100',
    },
    borderDashed: {
      light: 'dashed 1px #dfe4ee',
      dark: 'dashed 1px #535353',
    },
    buttonColorActive: {
      light: 'gray.225',
      dark: '#fff',
    },
    buttonColorInactive: {
      light: '#c9d1d8',
      dark: '#777777',
    },
  };

  const gridItemStyle = {
    display: 'flex',
    flexDire: 'row',
    justifyContent: 'space-between',
    paddingLeft: '20px',
    paddingRight: '20px',
    height: '60px',
    alignItems: 'center',
  };

  const leftText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    color: colorMode === 'light' ? '#7e8993' : '#9d9ea5',
  };
  const rightText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    fontWeight: 'bold',
    color: colorMode === 'light' ? '#353c48' : '#fff',
  };
  return (
    <Grid
      mt={'20px'}
      boxShadow={
        colorMode === 'light' ? '0 1px 1px 0 rgba(96, 97, 112, 0.16)' : 'none'
      }
      h={'100%'}
      bg={colorMode === 'light' ? '#ffffff' : 'transparent'}
      borderRadius={'15px'}
      border={colorMode === 'light' ? 'none' : 'solid 1px #373737'}>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText}>Project Name</Text>
        <Text style={rightText}>{project.projectName}</Text>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText}>Owner</Text>
        <Link
          style={rightText}
          isExternal
          href={
            project.owner && network === 'rinkeby'
              ? `https://rinkeby.etherscan.io/address/${project.owner}`
              : project.owner && network !== 'rinkeby'
              ? `https://etherscan.io/address/${project.owner}`
              : ''
          }>
          {project.owner ? shortenAddress(project.owner) : 'NA'}
        </Link>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText}>Token Name</Text>
        <Text style={rightText}>{project.tokenName}</Text>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText}>Token Symbol</Text>
        <Text style={rightText}>
          {project.tokenSymbol.toString().toUpperCase()}
        </Text>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText}> Token Supply</Text>
        <Text style={rightText}>
          {project.totalSupply
            ? Number(project.totalSupply).toLocaleString(undefined, {
                minimumFractionDigits: 0,
              })
            : 'NA'}
        </Text>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText}>Token Exchange Rate</Text>
        <Flex flexDir={'column'}>
          <Text style={rightText} textAlign="left">
            1 TON = {Number(project.projectTokenPrice)}
            {` ${project.tokenSymbol}`}
          </Text>
          <Text style={rightText} textAlign="left">
            1 TOS = {Number(project.tosPrice)}
            {` ${project.tokenSymbol}`}
          </Text>
        </Flex>
      </GridItem>
      {/* <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText}>Sale Price</Text>
        <Text style={rightText}>NA</Text>
      </GridItem> */}
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText}>Current Price</Text>
        <Text style={rightText}>
          {' '}
          ${' '}
          {currentPrice.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      </GridItem>
      <GridItem
        display={'flex'}
        justifyContent={'center'}
        flexDir="column"
        fontFamily={theme.fonts.fld}
        px={'5px'}>
        <Text
          mt={'30px'}
          textAlign={'center'}
          fontSize="17px"
          fontWeight={'bold'}
          color={colorMode==='light'? '#353c48': '#fff'}>
          Description
        </Text>
        <style>{quillStyle}</style>
        <ReactQuill
          // placeholder="Input the project description"
          readOnly={true}
          modules={modules}
          value={project.description}
          theme={'bubble'}
          style={{color: '#ffffff !important', wordBreak: 'break-word'}}
        />
      </GridItem>
    </Grid>
  );
};
