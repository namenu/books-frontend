import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import Arrow from 'src/components/Carousel/Arrow';
import { getArrowVerticalCenterPosition } from 'src/components/Carousel';
import { BreakPoint, greaterThanOrEqualTo } from 'src/utils/mediaQuery';
import BooksCarousel from 'src/components/Carousel/BooksCarousel';

import ListItem from './RecommendedBookItem';
import { RecommendedBookProps } from './types';

const arrowWrapperCSS = css`
  position: absolute;
  top: calc(50% - 9px);
`;

const CarouselWrapper = styled.div`
  width: 1005px;
  margin: 0 auto;
  position: relative;
  margin-top: 20px;
`;

function RecommendedBookCarousel(props: Omit<RecommendedBookProps, 'title'>) {
  const {
    theme, type, slug, genre,
  } = props;

  const { items } = props;
  const totalItems = items.length;

  const [currentIdx, setCurrentIdx] = React.useState(0);
  const handleLeftArrow = React.useCallback(() => {
    setCurrentIdx((idx) => {
      const page = Math.ceil(idx / 6);
      if (page === 0) {
        return totalItems - 6;
      }
      return (page - 1) * 6;
    });
  }, [totalItems]);
  const handleRightArrow = React.useCallback(() => {
    setCurrentIdx((idx) => {
      if (idx + 6 === totalItems) {
        return 0;
      }
      if (idx + 12 > totalItems) {
        return totalItems - 6;
      }
      return idx + 6;
    });
  }, [totalItems]);

  return (
    <CarouselWrapper>
      <BooksCarousel
        totalItems={items.length}
        itemsInPage={6}
        currentIdx={currentIdx}
        itemWidth={140}
        itemMargin={22}
      >
        {({ index }) => (
          <ListItem
            key={index}
            book={items[index]}
            index={index}
            type={type as any /* FIXME do some type circus */}
            genre={genre}
            theme={theme}
            slug={slug}
            css={css`height: 100%;`}
          />
        )}
      </BooksCarousel>
      {items.length > 6 && (
        <form key="arrows">
          <Arrow
            onClickHandler={handleLeftArrow}
            label="이전"
            color={theme}
            side="left"
            wrapperStyle={css`
              ${arrowWrapperCSS};
              ${greaterThanOrEqualTo(
              BreakPoint.XL + 1,
              'left: -31px;',
            )};
              left: 5px;
              top: ${getArrowVerticalCenterPosition()};
            `}
          />
          <Arrow
            label="다음"
            onClickHandler={handleRightArrow}
            color={theme}
            side="right"
            wrapperStyle={css`
              ${arrowWrapperCSS};
              ${greaterThanOrEqualTo(
              BreakPoint.XL + 1,
              'right: -27px;',
            )};
              right: 5px;
              top: ${getArrowVerticalCenterPosition()};
            `}
          />
        </form>
      )}
    </CarouselWrapper>
  );
}

export default React.memo(RecommendedBookCarousel);
