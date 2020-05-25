import styled from '@emotion/styled';
import React from 'react';

import {
  AuthorInfoWrapper,
  AuthorIconWrapper,
} from '../Search/Authors/AuthorInfo';

import SkeletonBar from './Bar';

const SkeletonAuthorIcon = styled(AuthorIconWrapper)`
  background: linear-gradient(334.91deg, #f8f9fb 1.42%, #f1f1f3 49.17%, #f8f9fb 100%);
`;

const SkeletonAuthorBar = styled(SkeletonBar)<{ barType: 'short' | 'long' }>`
  margin-bottom: 0;
  width: ${(props) => ({ short: 68, long: 129 }[props.barType])}px;
  height: 14px;
`;

interface Props {
  barType: 'short' | 'long';
}

export default function SkeletonAuthorInfo(props: Props) {
  const { barType } = props;
  return (
    <AuthorInfoWrapper>
      <SkeletonAuthorIcon />
      <SkeletonAuthorBar barType={barType} />
    </AuthorInfoWrapper>
  );
}
