import React from 'react';
import styled from '@emotion/styled';

import { VERTICAL_RIGHT_ARROW_ICON_URL } from 'src/constants/icons';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

export const SectionTitle = styled.h2`
  max-width: 990px; // 950 + 20 + 20
  margin: 0 auto 16px;
  padding: 6px 20px 0;
  ${orBelow(BreakPoint.MD, 'padding: inherit 16px;')}

  display: flex;
  flex-direction: column;

  font-size: 19px;
  font-weight: normal;
  line-height: 26px;
  color: #000000;
  word-break: keep-all;
`;

const LinkWrapper = styled.a`
  display: flex;
  align-items: center;
  color: black;

  > * {
    flex: none;
  }
`;

const Arrow = styled.img`
  width: 11px;
  height: 14px;
  margin-left: 7.8px;
`;

interface SectionTitleLinkProps {
  title: string;
  href?: string;
}

export function SectionTitleLink(props: SectionTitleLinkProps) {
  const { title, href } = props;
  if (!href) {
    return <>{title}</>;
  }
  return (
    <LinkWrapper href={href}>
      {title}
      <Arrow src={VERTICAL_RIGHT_ARROW_ICON_URL} alt="화살표" />
    </LinkWrapper>
  );
}
