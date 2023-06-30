import {Flex, Link} from '@chakra-ui/react';
import PrevArrowIcon from '../assets/pagenate-prev-arrow-icon-inactive_1.svg';
import NextArrowIcon from '../assets/pagenate-prev-arrow-icon-inactive_2.svg';
import {useRef, useEffect, useState} from 'react';
import '../css/gnb_mobile.css';
import styled from '@emotion/styled';
import '@fontsource/titillium-web';

const menus = [
  {
    title: "Tokamak Network",
    url: "https://tokamak.network/#/",
    isFoucsed: false,
  },
  {
    title: "L2 Mainnet",
    url: "http://titan.tokamak.network/",
    isFoucsed: false,
  },
  {
    title: "Bridge & Swap",
    url: "https://bridge.tokamak.network/#/",
    isFoucsed: false,
  },
  {
    title: "Staking",
    url: "https://simple.staking.tokamak.network/#/",
    isFoucsed: false,
  },
  {
    title: "DAO",
    url: "https://dao.tokamak.network//",
    isFoucsed: false,
  },
  {
    title: "Launchpad",
    url: "https://tonstarter.tokamak.network/",
    isFoucsed: true,
  },
];

let currentPosition = 0;
let touchStartX = 0;
const deviceWidth = window.innerWidth;

const toRightXvalue = () => {
  switch (currentPosition) {
    case 0:
      return -120;
    case 1:
      return -270;
    case 2:
      return -430;
    case 3:
      return -560;
    default:
      return null;
  }
};

const toLeftXvalue = () => {
  switch (currentPosition) {
    case 0:
      return 0;
    case 1:
      return 0;
    case 2:
      return -120;
    case 3:
      return -270;
    case 4:
      return -430;
    default:
      return null;
  }
};

const catchTouchStart = (e: any) => {
  const touchObj = e.changedTouches[0];
  touchStartX = touchObj.pageX;
};

const handleNavigation = (e: any, rightArrow?: boolean) => {
  const ref: any = document.getElementsByClassName('gnb_mobile_menu');
  const transition = '0.8s ease-in-out';

  let direction;

  if (e === undefined || rightArrow !== undefined) {
    direction = rightArrow;
  } else {
    const touchObj = e.changedTouches[0];
    const distX = touchObj.pageX - touchStartX;

    direction = touchStartX > touchObj.pageX;
  }

  try {
    if (direction) {
      const xValue = toRightXvalue();
      const traslateX = `translateX(${xValue}px)`;
      ref[0].style.transition = transition;
      ref[0].style.transform = traslateX;

      ref[1].style.transition = transition;
      ref[1].style.transform = traslateX;

      ref[2].style.transition = transition;
      ref[2].style.transform = traslateX;

      ref[3].style.transition = transition;
      ref[3].style.transform = traslateX;

      ref[4].style.transition = transition;
      ref[4].style.transform = traslateX;

      ref[5].style.transition = transition;
      ref[5].style.transform = traslateX;
      return;
    }
    const xValue = toLeftXvalue();
    // e.target.style.transition = "0.8s linear";
    // e.target.style.transform = `translateX(100px)`;

    const traslateX = `translateX(${xValue}px)`;

    ref[0].style.transition = transition;
    ref[0].style.transform = traslateX;

    ref[1].style.transition = transition;
    ref[1].style.transform = traslateX;

    ref[2].style.transition = transition;
    ref[2].style.transform = traslateX;

    ref[3].style.transition = transition;
    ref[3].style.transform = traslateX;

    ref[4].style.transition = transition;
    ref[4].style.transform = traslateX;

    ref[5].style.transition = transition;
    ref[5].style.transform = traslateX;
  } finally {
    if (-1 < currentPosition && currentPosition < 4) {
      direction ? (currentPosition += 1) : (currentPosition -= 1);
    }
    if (currentPosition === -1) {
      currentPosition = 0;
    }
    if (currentPosition === 4 && direction === false) {
      currentPosition -= 1;
    }
    // lastX = e.target.offsetLeft;
  }
};

function MobileTokamakGNB() {
  setTimeout(() => {
    handleNavigation(undefined, true);
    handleNavigation(undefined, true);
    handleNavigation(undefined, true);
    handleNavigation(undefined, true);
  }, 1000);

  return (
    <div
      className="gnb_mobile_header"
      style={{fontFamily: 'Titillium Web, sans-serif'}}>
      <img
        src={PrevArrowIcon}
        alt={''}
        height={'40px'}
        onClick={(e) => {
          handleNavigation(e, false);
        }}></img>
      <div className="gnb_mobile_menu_wrap">
        {menus.map((menu, index) => (
          <a
            className="gnb_mobile_menu"
            style={{
              minWidth:
              menu.title === "L2 Mainnet"
              ? "120px"
              : menu.title === "DAO"
              ? "90px"
              : menu.title === "Tokamak Network"
              ? "160px"
              : menu.title === "Staking"
              ? "100px"
              : menu.title === "Bridge & Swap"
              ? "136px"
              : "",
              fontWeight: menu.isFoucsed ? 600 : '',
              opacity: menu.isFoucsed ? 1 : 0.25,
              marginLeft: index === 0 ? `${(deviceWidth - 80 - 78) / 2}px` : '',
              marginRight: index === menus.length - 1 ? '31%' : '',
            }}
            href={menu.url}
            key={menu.title}
            onTouchStart={(e) => catchTouchStart(e)}
            onTouchEnd={(e) => handleNavigation(e)}>
            {menu.title}
          </a>
        ))}
      </div>
      <img
        src={NextArrowIcon}
        alt={''}
        width={'40px'}
        height={'40px'}
        onClick={(e) => {
          handleNavigation(e, true);
        }}></img>
    </div>
  );
}
export default MobileTokamakGNB;
