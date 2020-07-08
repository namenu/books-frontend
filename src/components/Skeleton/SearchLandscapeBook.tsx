import React from 'react';
import { css } from '@emotion/core';

import MetaWrapper from '../Search/SearchLandscapeBook/MetaWrapper';
import SkeletonBook from './Book';
import SkeletonBar from './Bar';

const longBar = css`width: 100%;`;
const shortBar = css`width: 130px;`;

export default function Skeleton() {
  return (
    <>
      <SkeletonBook />
      <MetaWrapper>
        <SkeletonBar css={longBar} />
        <SkeletonBar css={shortBar} />
      </MetaWrapper>
    </>
  );
}
