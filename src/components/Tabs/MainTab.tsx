import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { a11y } from 'src/styles';
import * as labels from 'src/labels/menus.json';
import Cookies from 'universal-cookie';
import HomeLink from 'src/components/GNB/HomeLink';
import Home from 'src/svgs/Home.svg';
import HomeSolid from 'src/svgs/Home_solid.svg';
import Notification_solid from 'src/svgs/Notification_solid.svg';
import Notification_regular from 'src/svgs/Notification_regular.svg';
import Cart_regular from 'src/svgs/Cart_regular.svg';
import Cart_solid from 'src/svgs/Cart_solid.svg';
import MyRIDI_solid from 'src/svgs/MyRIDI_solid.svg';
import MyRIDI_regular from 'src/svgs/MyRIDI_regular.svg';
import cookieKeys from 'src/constants/cookies';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { LoggedUser } from 'src/types/account';
import { useCartCount } from 'src/hooks/useCartCount';
import { GNBContext } from 'src/components/GNB';
import useNotification from 'src/hooks/useNotification';

const StyledAnchor = styled.a`
  height: 100%;
  display: block;
`;

const Tabs = styled.ul`
  display: flex;
  flex-direction: row;

  padding: 0 20px;
  ${orBelow(
    BreakPoint.LG,
    'padding: 0;',
  )};
`;

const TabButton = styled.button`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 0 5px 3px 4px;
  outline: none;
  position: relative;
  top: -1px;
  margin: 0 auto;
  overflow: visible;
`;

const iconStyle = () => css`
  margin-right: 10px;
  fill: white;
  width: 20px;
  height: 20px;
  // top: 3px;

  ${orBelow(
    BreakPoint.LG,
    `
      width: 24px;
      height: 24px;
      margin-right: 0;
    `,
  )};
`;

const labelStyle = css`
  height: 16px;
  font-size: 16px;
  font-weight: 600;
  margin-left: 5px;
  line-height: 1;
  top: 1px;
  text-align: center;
  color: #ffffff;

  @media (max-width: ${BreakPoint.LG}px) {
    ${a11y}
  }
`;

const BottomLine = styled.span`
  display: block;
  background: transparent;
  height: 3px;
  width: 0;
`;

const TabItemWrapper = styled.li`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 37px;
  overflow: visible;
  :not(:last-of-type) {
    margin-right: 50px;
  }

  ${orBelow(
    BreakPoint.LG,
    `
      height: 40px;
      width: 25%;
      :not(:last-of-type) {
        margin-right: 0;
      }
    `,
  )};
  transition: opacity 0.2s;

  @media (hover: hover) {
    :hover {
      ${BottomLine} {
        background-color: #99d1ff;
        position: relative;
        top: 1px;
        opacity: 0.7;
        width: 100%;
      }
      opacity: 0.7;
    }
  }
  :hover {
    ${BottomLine} {
      background-color: #99d1ff;
      position: relative;
      top: 1px;
      opacity: 0.7;
      width: 100%;
    }
    opacity: 0.7;
  }
  @media (hover: none) {
    :hover {
      opacity: 1;
    }
  }
  padding-bottom: 4px;
`;

const currentTab = css`
  background-color: #99d1ff;
  width: 100%;
  position: relative;
  top: 1px;
`;

const NotificationAddOn = styled.div`
  position: absolute;
  left: 13.5px;
  top: 4px;
  border: 2px solid #1f8ce6;
  width: 11px;
  height: 11px;
  background: #ffde24;
  border-radius: 11px;
  background-clip: padding-box;
  ${orBelow(BreakPoint.LG, 'left: 17.5px;')};
`;

const CartAddOnWrapper = styled.div`
  position: absolute;
  justify-content: flex-end;
  margin-left: auto;
  width: 100%;
  max-width: 30px;
  align-items: center;
  top: -10px;
  left: 10px;
  display: flex;
  max-height: 31px;
  height: 100%;
  ${orBelow(BreakPoint.LG, 'left: 12.5px;')};
`;

const CartAddOnBackground = styled.div`
  align-items: center;
  border-radius: 6px;
  border: 2px solid #1f8ce6;
  background: white;
  height: 20px;
  display: flex;
  ${orBelow(BreakPoint.LG, 'margin-left: 4px;')};
  background-clip: padding-box;
`;

const CartAddOnCount = styled.span`
  font-weight: bold;
  padding: 1.5px 2.4px;
  font-size: 11.5px;
  line-height: 11.5px;
  color: #1f8ce6;
`;


interface MainTabProps {
  loggedUserInfo: null | LoggedUser;
}

interface TabItemProps {
  replace?: boolean;
  shallow?: boolean;
  path: string;
  activeIcon: React.ReactNode;
  normalIcon: React.ReactNode;
  label: string;
  pathRegexp: RegExp;
  addOn?: React.ReactNode;
}

// Todo
// Anchor, StyledAnchor ->
// GNB/Footer 캐싱 때문에 생긴 파편화.
// 반응형 레거시 코드 작업이 종료되면 이 부분 개선 해야 함.
const TabItem: React.FC<TabItemProps> = (props) => {
  const {
    path,
    pathRegexp,
    label,
    activeIcon,
    normalIcon,
    addOn,
  } = props;

  const router = useRouter();
  const { origin } = useContext(GNBContext);

  const [isActiveTab, setIsActiveTab] = useState(false);

  useEffect(() => {
    const pathname = Array.isArray(router.query.pathname) ? router.query.pathname[0] : router.query.pathname || router.asPath;
    setIsActiveTab(pathRegexp.test(pathname));
  }, [pathRegexp, router]);

  const TabButtonWithLine = () => (
    <>
      <TabButton>
        {isActiveTab ? activeIcon : normalIcon}
        {addOn}
        <span css={labelStyle}>{label}</span>
      </TabButton>
      <BottomLine css={isActiveTab && currentTab} />
    </>
  );

  return (
    <TabItemWrapper
      css={
        isActiveTab
          ? css`
              :hover {
                opacity: 1;
                ${BottomLine} {
                  opacity: 1;
                }
              }
            `
          : ''
      }
    >
      {/* eslint-disable-next-line no-nested-ternary */}
      {!process.env.USE_CSR ? (
        <StyledAnchor href={`${origin}${path}`} aria-label={label}>
          <TabButtonWithLine />
        </StyledAnchor>
      ) : path === '/' ? (
        <HomeLink passHref>
          <StyledAnchor aria-label={label}>
            <TabButtonWithLine />
          </StyledAnchor>
        </HomeLink>
      ) : (
        <Link href={path} passHref>
          <StyledAnchor aria-label={label}>
            <TabButtonWithLine />
          </StyledAnchor>
        </Link>
      )}
    </TabItemWrapper>
  );
};

// Fixme 레거시 쿠키 값 때문에 존재함. 장르 분리되면 분리해야 한다.
const genreValueReplace = (visitedGenre: string) => {
  if (visitedGenre === 'comic') {
    return 'comics';
  }
  if (visitedGenre.includes('_')) {
    return visitedGenre.replace('_', '-');
  }
  return visitedGenre;
};

export const MainTab: React.FC<MainTabProps> = (props) => {
  const { loggedUserInfo } = props;
  const { unreadCount, items, requestFetchUnreadCount } = useNotification();
  const router = useRouter();
  const [, setHomeURL] = useState('/');
  const cartCount = useCartCount(loggedUserInfo);
  useEffect(() => {
    const cookies = new Cookies();
    const visitedGenre = cookies.get(cookieKeys.main_genre);
    setHomeURL(
      visitedGenre && visitedGenre !== 'general' ? genreValueReplace(visitedGenre) : '/',
    );
  }, [router.asPath]);

  useEffect(() => {
    // Notification Page에서는 호출 X
    if (loggedUserInfo && router.pathname !== '/notification') {
      requestFetchUnreadCount();
    }
  }, [requestFetchUnreadCount, loggedUserInfo, router.asPath]);

  return (
    <>
      <Tabs>
        <TabItem
          activeIcon={<HomeSolid css={iconStyle} />}
          normalIcon={<Home css={iconStyle} />}
          label={labels.mainTab.home}
          path="/"
          pathRegexp={/^\/(romance|romance-serial|fantasy|fantasy-serial|bl|bl-serial|comics)?\/?$/}
        />
        <TabItem
          activeIcon={<Notification_solid css={iconStyle} />}
          normalIcon={<Notification_regular css={iconStyle} />}
          label={labels.mainTab.notification}
          path="/notification"
          pathRegexp={/^\/notification\/?$/g}
          addOn={Boolean(unreadCount) && !items && (
            <NotificationAddOn />
          )}
        />
        <TabItem
          activeIcon={<Cart_solid css={iconStyle} />}
          normalIcon={<Cart_regular css={iconStyle} />}
          label={labels.mainTab.cart}
          path="/cart"
          pathRegexp={/^\/cart\/?$/gu}
          addOn={
            cartCount > 0 && (
              <CartAddOnWrapper>
                <CartAddOnBackground>
                  <CartAddOnCount>
                    {cartCount}
                  </CartAddOnCount>
                </CartAddOnBackground>
              </CartAddOnWrapper>
            )
          }
        />
        <TabItem
          activeIcon={<MyRIDI_solid css={iconStyle} />}
          normalIcon={<MyRIDI_regular css={iconStyle} />}
          label={labels.mainTab.myRidi}
          path="/account/myridi"
          pathRegexp={/^\/account\/myridi\/?$/gu}
        />
      </Tabs>
    </>
  );
};

export default MainTab;
