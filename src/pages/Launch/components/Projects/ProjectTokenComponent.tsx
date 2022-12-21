import {FC, useEffect, useState} from 'react';
import {Flex, Text, useTheme, useColorMode, Link} from '@chakra-ui/react';
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

export const ProjectTokenComponent: FC<ProjectTokenProps> = ({project}) => {
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

  return (
    <Flex
      p={'25px 35px 25px 35px'}
      flexDir={'column'}
      fontFamily={theme.fonts.fld}
      fontSize={'15px'}>
      <Flex flexDir={'row'} justifyContent={'space-between'} h={'450px'}>
        <Flex w={'498px'} flexDir={'column'}>
          <Flex
            p={'0px 20px'}
            borderBottom={themeDesign.border[colorMode]}
            h={'41px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'} fontWeight={600}>
              Project Name
            </Text>
            <Text
              fontFamily={theme.fonts.fld}
              fontSize={'15px'}
              fontWeight={'bold'}>
              {project?.projectName}
            </Text>
          </Flex>
          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={themeDesign.border[colorMode]}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}  fontWeight={600}>
              Owner
            </Text>
            <Link
              isExternal
              href={
                project.owner && network === 'rinkeby'
                  ? `https://rinkeby.etherscan.io/address/${project.owner}`
                  : project.owner && network !== 'rinkeby'
                  ? `https://etherscan.io/address/${project.owner}`
                  : ''
              }
              _hover={{color: '#2a72e5'}}>
              {project.owner ? shortenAddress(project.owner) : 'NA'}
            </Link>
          </Flex>
          {/* <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={themeDesign.border[colorMode]}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}  fontWeight={600}>
              Sale Price
            </Text>
            <Text>NA</Text>
          </Flex> */}
          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={themeDesign.border[colorMode]}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}  fontWeight={600}>
              Current Price
            </Text>
            <Text>
              ${' '}
              {currentPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </Flex>
          {/* <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={themeDesign.border[colorMode]}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Project Main Image
            </Text>
            <Link
              isExternal
              href={project.projectMainImage ? project.projectMainImage : null} 
              color={colorMode === 'light' ? '#353c48' : '#9d9ea5'}
              _hover={project.projectMainImage ? {color: '#2a72e5'} :{cursor: 'default'}}>
              {project.projectMainImage ? 'Image Link' : 'NA'}
            </Link>
          </Flex> */}
          <Flex
            p={'0px 20px'}
            borderBottom={themeDesign.border[colorMode]}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}
            alignItems={'center'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}  fontWeight={600}>
              Telegram
            </Text>
            <Link
              color={colorMode === 'light' ? '#353c48' : '#9d9ea5'}
              _hover={
                project.telegram ? {color: '#2a72e5'} : {cursor: 'default'}
              }
              isExternal
              href={project.telegram ? project.telegram : null}>
              {project.telegram ? project.telegram : 'NA'}
            </Link>
          </Flex>
          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={themeDesign.border[colorMode]}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}  fontWeight={600}>
              Website
            </Text>
            <Link
              color={colorMode === 'light' ? '#353c48' : '#9d9ea5'}
              _hover={
                project.website ? {color: '#2a72e5'} : {cursor: 'default'}
              }
              isExternal
              href={project.website ? project.website : null}>
              {project.website ? project.website : 'NA'}
            </Link>
          </Flex>
          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={themeDesign.border[colorMode]}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}  fontWeight={600}>
              Medium
            </Text>
            <Link
              color={colorMode === 'light' ? '#353c48' : '#9d9ea5'}
              _hover={project.medium ? {color: '#2a72e5'} : {cursor: 'default'}}
              isExternal
              href={project.medium ? project.medium : null}>
              {project.medium ? project.medium : 'NA'}
            </Link>
          </Flex>

          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={themeDesign.border[colorMode]}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}  fontWeight={600}>
              Twitter
            </Text>
            <Link
              color={colorMode === 'light' ? '#353c48' : '#9d9ea5'}
              _hover={
                project.twitter ? {color: '#2a72e5'} : {cursor: 'default'}
              }
              isExternal
              href={project.twitter ? project.twitter : null}>
              {project.twitter ? project.twitter : 'NA'}
            </Link>
          </Flex>
        </Flex>
        <Flex w={'498px'} flexDir={'column'}>
          <Flex
            p={'0px 20px'}
            borderBottom={themeDesign.border[colorMode]}
            h={'40px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}  fontWeight={600}>
              Token Name
            </Text>
            <Text>{project.tokenName}</Text>
          </Flex>
          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={themeDesign.border[colorMode]}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}  fontWeight={600}>
              Token Symbol
            </Text>
            <Text>{project.tokenSymbol.toString().toUpperCase()}</Text>
          </Flex>
          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={themeDesign.border[colorMode]}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}  fontWeight={600}>
              Token Address
            </Text>
            <Link
              isExternal
              href={
                project.owner && network === 'rinkeby'
                  ? `https://rinkeby.etherscan.io/address/${project.tokenAddress}`
                  : project.owner && network !== 'rinkeby'
                  ? `https://etherscan.io/address/${project.tokenAddress}`
                  : ''
              }
              _hover={
                project.tokenAddress ? {color: '#2a72e5'} : {cursor: 'default'}
              }>
              {project.tokenAddress
                ? shortenAddress(project.tokenAddress)
                : 'NA'}
            </Link>
          </Flex>
          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={themeDesign.border[colorMode]}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}  fontWeight={600}>
              Token Exchange Rate
            </Text>
            <Flex flexDir={'column'}>
              <Text>
                1 TON = {Number(project.projectTokenPrice)}
                {` ${project.tokenSymbol}`}
              </Text>
              <Text>
                1 TOS = {Number(project.tosPrice)}
                {` ${project.tokenSymbol}`}
              </Text>
            </Flex>
          </Flex>
          <Flex
            p={'0px 20px'}
            alignItems={'center'}
            borderBottom={themeDesign.border[colorMode]}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}  fontWeight={600}>
              Token Supply
            </Text>
            <Text>
              {project.totalSupply
                ? Number(project.totalSupply).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                  })
                : 'NA'}
            </Text>
          </Flex>
          <Flex
            p={'0px 20px'}
            borderBottom={themeDesign.border[colorMode]}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}
            alignItems={'center'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}  fontWeight={600}>
              Token Symbol Image
            </Text>
            <Link
              color={colorMode === 'light' ? '#353c48' : '#9d9ea5'}
              _hover={
                project.tokenSymbolImage
                  ? {color: '#2a72e5'}
                  : {cursor: 'default'}
              }
              isExternal
              href={project.tokenSymbolImage ? project.tokenSymbolImage : null}>
              {project.tokenSymbolImage ? 'Image Link' : 'NA'}
            </Link>
          </Flex>

          <Flex
            p={'0px 20px'}
            borderBottom={themeDesign.border[colorMode]}
            h={'60px'}
            w={'100%'}
            justifyContent={'space-between'}
            alignItems={'center'}>
            <Text color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'} fontWeight={600}>
              Discord
            </Text>
            <Link
              color={colorMode === 'light' ? '#353c48' : '#9d9ea5'}
              _hover={
                project.discord ? {color: '#2a72e5'} : {cursor: 'default'}
              }
              isExternal
              href={project.discord ? project.discord : null}>
              {project.discord ? project.discord : 'NA'}
            </Link>
          </Flex>
        </Flex>
      </Flex>
      <Flex flexDir={'column'} mt={'50px'} justifyContent={'center'}>
        <Text
          textAlign={'center'}
          fontSize={'20px'}
          fontWeight={600}
          color={colorMode === 'light' ? '#353c48' : '#ffffff'}
          
          mb={'15px'}>
          Description
        </Text>
        <style>{quillStyle}</style>
        <ReactQuill
          // placeholder="Input the project description"
          readOnly={true}
          modules={modules}
          value={project.description}
          theme={'bubble'}
          style={{color: '#ffffff !important'}}
        />
      </Flex>
    </Flex>
  );
};
