import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import {
  slateGray20, slateGray30,
  slateGray40, slateGray50,
  slateGray60,
} from '@ridi/colors';
import Link from 'next/link';

import ScrollContainer from 'src/components/ScrollContainer';
import { useSearchQueries } from 'src/hooks/useSearchQueries';
import * as SearchTypes from 'src/types/searchResults';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { defaultHoverStyle } from 'src/styles';

interface SearchCategoryProps {
  categories: SearchTypes.Aggregation[];
  currentCategoryId: number;
}

const CategoryList = styled.ul`
  display: flex;
  height: 45px;
  ${orBelow(BreakPoint.LG, 'padding-left: 16px; padding-right: 16px;')};
`;

const CategoryItem = styled.li<{ active: boolean }>`
  flex: none;
  display: flex;
  justify-content: space-between;
  :not(:first-of-type) {
    margin-left: 10px;
  }
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.05);
  ${(props) => (props.active && `box-shadow: inset 0px -3px 0px ${slateGray40};`)}
`;

const CategoryAnchor = styled.a`
  padding: 15px 4px;
  :active, :focus {
    background: rgba(0, 0, 0, 0.05);
    outline: none;
  }
  ${defaultHoverStyle}
`;

const CategoryName = styled.span<{ active: boolean }>`
  color: ${slateGray60};
  font-size: 14px;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  ${(props) => (!props.active && 'opacity: 0.7;')}
`;

const CategoryCount = styled(CategoryName)`
  font-size: 13px;
`;

function Category(props: {
  currentCategoryId: number;
  category: SearchTypes.Aggregation;
  focusElementRef: React.Ref<HTMLElement>;
}) {
  const {
    currentCategoryId, category, focusElementRef,
  } = props;
  const active = currentCategoryId === category.category_id;
  const { calculateUpdateQuery } = useSearchQueries();
  const href = `/search?${calculateUpdateQuery({ categoryId: String(category.category_id), page: 1 })}`;
  return (
    <CategoryItem
      ref={active ? focusElementRef as React.Ref<HTMLLIElement> : undefined}
      active={active}
    >
      <Link href={href} passHref>
        <CategoryAnchor>
          <CategoryName active={active}>{category.category_name}</CategoryName>
          {' '}
          <CategoryCount active={active}>
            (
            {category.doc_count.toLocaleString('ko-KR')}
            )
          </CategoryCount>
        </CategoryAnchor>
      </Link>
    </CategoryItem>
  );
}

const arrowStyle = css`
  button {
    border-radius: 0;
    box-shadow: none;
    position: relative;
    top: 0;
    width: 40px;
    height: 44px;

    :hover {
      opacity: .95;
      :first-of-type, :last-of-type {
        > svg {
          fill: ${slateGray50};
        }
      }
    }
    :first-of-type {
      background: linear-gradient(270deg, rgba(255, 255, 255, 0.0001) 0%, rgba(255, 255, 255, 0.5) 27.6%, #FFFFFF 53.65%);
      > svg {
        fill: ${slateGray30};
        position: relative;
        left: -15px;
        right: inherit;
      }
    }
    :last-of-type {
      background: linear-gradient(90deg, rgba(255, 255, 255, 0.0001) 0%, rgba(255, 255, 255, 0.5) 27.6%, #FFFFFF 53.65%);
      > svg {
        fill: ${slateGray30};
        position: relative;
        left: inherit;
        right: -15px;
      }
    }
  }
`;

const Border = styled.div`
  top: -1px;
  position: relative;
  height: 1px;
  width: 100%;
  background: ${slateGray20};
  z-index: -1;
`;

// ScrollContainer 기본 padding: 0 4px; 무시
const containerStyle = css`
  div + div { padding: 0; }
`;

function SearchCategoryTab(props: SearchCategoryProps) {
  const { currentCategoryId = 0, categories } = props;
  return (
    <>
      <ScrollContainer
        css={containerStyle}
        arrowType="bold"
        arrowStyle={arrowStyle}
      >
        {(focusElementRef) => (
          <CategoryList>
            {categories.map((category) => (
              <Category
                key={category.category_id}
                focusElementRef={focusElementRef}
                currentCategoryId={currentCategoryId}
                category={category}
              />
            ))}
          </CategoryList>
        )}
      </ScrollContainer>
      <Border />
    </>
  );
}

export default SearchCategoryTab;
