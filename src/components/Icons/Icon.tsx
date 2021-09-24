import {Image} from '@chakra-ui/react';
import websiteImg from 'assets/svgs/website-s-icon.svg';
import discordImg from 'assets/svgs/discord-s-icon.svg';
import telegramImg from 'assets/svgs/telegram-s-icon.svg';
import twitterImg from 'assets/svgs/Twitter-s-icon_2.svg';
import mediumImg from 'assets/svgs/medium-s-icon.svg';

import {IconsSort} from 'types';

type IconsProp = {
  name: IconsSort;
  w?: number;
  h?: number;
};

const iconType = {
  website: websiteImg,
  discord: discordImg,
  telegram: telegramImg,
  twitter: twitterImg,
  medium: mediumImg,
};

export const Icons = (prop: IconsProp) => {
  const {name, w, h} = prop;
  return <Image src={iconType[name]} alt={'icon'} w={w} h={h}></Image>;
};
