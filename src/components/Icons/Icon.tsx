import {Image} from '@chakra-ui/react';
import websiteImg from 'assets/svgs/website-s-icon.svg';
import discordImg from 'assets/svgs/discord-s-icon.svg';
import telegramImg from 'assets/svgs/telegram-s-icon.svg';
import twitterImg from 'assets/svgs/Twitter-s-icon_2.svg';
import mediumImg from 'assets/svgs/medium-s-icon.svg';

import hover_discordImg from 'assets/svgs/hover/discord-s-hover-icon.svg';
import hover_mediumImg from 'assets/svgs/hover/medium-s-hover-icon.svg';
import hover_telegramImg from 'assets/svgs/hover/telegram-s-hover-icon.svg';
import hover_twitterImg from 'assets/svgs/hover/twitter-s-hover-icon.svg';
import hover_websiteImg from 'assets/svgs/hover/website-s-hover-icon.svg';

import {IconsSort} from 'types';
import {useEffect, useRef, useState} from 'react';

type IconsProp = {
  name: IconsSort;
  w?: number;
  h?: number;
  mouseOver: boolean;
};

const iconType = {
  website: websiteImg,
  discord: discordImg,
  telegram: telegramImg,
  twitter: twitterImg,
  medium: mediumImg,
};

const iconType_Hover = {
  website: hover_websiteImg,
  discord: hover_discordImg,
  telegram: hover_telegramImg,
  twitter: hover_twitterImg,
  medium: hover_mediumImg,
};

export const Icons = (prop: IconsProp) => {
  const {name, w, h, mouseOver} = prop;
  const imgRef = useRef(null);
  const [img, setImg] = useState(iconType[name]);

  useEffect(() => {
    if (mouseOver === true) {
      setImg(iconType_Hover[name]);
    } else {
      setImg(iconType[name]);
    }
  }, [mouseOver, name]);

  return <Image src={img} alt={'icon'} w={w} h={h} ref={imgRef}></Image>;
};
