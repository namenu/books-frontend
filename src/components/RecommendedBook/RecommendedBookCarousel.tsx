import React, { useCallback, FormEvent, useEffect, useRef, useState } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Arrow from 'src/components/Carousel/Arrow';
import SliderCarousel from 'react-slick';
import { ThumbnailWrapper } from 'src/components/BookThumbnail/ThumbnailWrapper';
import { PortraitBook } from 'src/components/Book/PortraitBook';
import { ForwardedRefComponent } from 'src/components/Carousel/LoadableCarousel';
import { getArrowVerticalCenterPosition } from 'src/components/Carousel';
import { BreakPoint, greaterThanOrEqualTo } from 'src/utils/mediaQuery';
import { DisplayType, HotRelease, TodayRecommendation } from 'src/types/sections';
import { BookMeta } from 'src/components/RecommendedBook/RecommendedBook';
import BookBadgeRenderer from 'src/components/Badge/BookBadgeRenderer';
import FreeBookRenderer from 'src/components/Badge/FreeBookRenderer';
import SetBookRenderer from 'src/components/Badge/SetBookRenderer';
import ThumbnailRenderer from 'src/components/BookThumbnail/ThumbnailRenderer';

const recommendedBookCarouselLoadingCSS = css`
  overflow: hidden;
  left: -18px;
  .slick-slide {
    width: 162px !important;
    will-change: transform;
    .slide-item-inner {
      display: inline-block;
      width: 140px;
    }
  }
  div[aria-hidden='true'] .badge {
    //opacity: 0;
    transition: all 3s;
  }
  div[aria-hidden='false'] .badge {
    opacity: 1;
    //transition: all .3s;
  }
`;

const arrowWrapperCSS = css`
  position: absolute;
  top: calc(50% - 9px);
`;

const CarouselWrapper = styled.div`
  width: 1005px;
  margin: 0 auto;
  position: relative;
  padding-left: 36px;
  padding-bottom: 36px;
`;

interface RecommendedBookCarouselProps {
  items: TodayRecommendation[] | HotRelease[];
  type: DisplayType.HotRelease | DisplayType.TodayRecommendation;
  theme: 'dark' | 'white';
  isIntersecting: boolean;
}

const RecommendedBookCarouselLoading: React.FC<RecommendedBookCarouselProps> = props => (
  <ul
    css={css`
      display: flex;
      padding-left: 3px;
      justify-content: center;
      height: 365px;
      margin-left: -18px;
    `}>
    {props.items.map((book, index) => (
      <PortraitBook key={index}>
        <ThumbnailWrapper>
          <ThumbnailRenderer
            width={147}
            book={{ b_id: book.b_id, detail: book.detail }}
            imgSize={'xxlarge'}
            isIntersecting={props.isIntersecting}
          />
        </ThumbnailWrapper>
        {book.detail && props.type === DisplayType.HotRelease && (
          <BookMeta book={book.detail} />
        )}
        {book.detail && props.type === DisplayType.TodayRecommendation && (
          <div
            css={[
              css`
                padding-left: 14px;
                margin-top: 2px;
                font-size: 13px;
                line-height: 16px;
                text-align: center;
                font-weight: 700;
                white-space: nowrap;
              `,
              props.theme === 'dark' &&
                css`
                  color: white;
                `,
            ]}>
            <span
              dangerouslySetInnerHTML={{
                __html: (book as HotRelease).sentence.replace(
                  /(?:\r\n|\r|\n)/g,
                  '<br />',
                ),
              }}
            />
          </div>
        )}
      </PortraitBook>
    ))}
  </ul>
);

const RecommendedBookCarousel: React.FC<RecommendedBookCarouselProps> = props => {
  const [carouselInitialize, setCarouselInitialized] = useState(false);
  const slider = useRef<SliderCarousel>();
  const wrapperRef = useRef<HTMLDivElement>();
  const { theme, type } = props;
  // @ts-ignore
  const [isMounted, setMounted] = useState(false);
  const [arrowPosition, setArrowPosition] = useState(
    getArrowVerticalCenterPosition(wrapperRef),
  );
  const setInitialized = useCallback(() => {
    setCarouselInitialized(true);
  }, []);

  const handleLeftArrow = (e: FormEvent) => {
    e.preventDefault();
    if (slider.current) {
      (slider.current as SliderCarousel).slickPrev();
    }
  };
  const handleRightArrow = (e: FormEvent) => {
    e.preventDefault();
    if (slider.current) {
      (slider.current as SliderCarousel).slickNext();
    }
  };

  useEffect(() => {
    setMounted(true);
    if (carouselInitialize) {
      setArrowPosition(getArrowVerticalCenterPosition(wrapperRef));
    }
  }, [carouselInitialize]);

  // @ts-ignore
  return (
    <>
      {/* Flickering 없는 UI 를 위해 추가함 */}
      {!carouselInitialize && (
        <RecommendedBookCarouselLoading
          theme={theme}
          type={props.type}
          items={props.items.slice(0, 6)}
          isIntersecting={props.isIntersecting}
        />
      )}
      <CarouselWrapper ref={wrapperRef}>
        <ForwardedRefComponent
          ref={slider}
          css={recommendedBookCarouselLoadingCSS}
          className={'slider'}
          slidesToShow={Math.min(props.items.length, 6)}
          slidesToScroll={6}
          speed={200}
          autoplay={false}
          arrows={false}
          onInit={setInitialized}
          infinite={true}>
          {props.items.map((book, index) => (
            // @ts-ignore
            <div
              key={index}
              css={css`
                display: flex;
                flex-direction: column;
                outline: none;
              `}>
              <PortraitBook
                css={css`
                  height: 100%;
                  padding-left: 0 !important;
                `}>
                <ThumbnailWrapper>
                  <ThumbnailRenderer
                    width={140}
                    book={{ b_id: book.b_id, detail: book.detail }}
                    imgSize={'xxlarge'}
                    isIntersecting={props.isIntersecting}>
                    <div
                      css={css`
                        position: absolute;
                        display: block;
                        top: -7px;
                        left: -7px;
                      `}>
                      <BookBadgeRenderer
                        type={type}
                        wrapperCSS={css``}
                        isWaitFree={book.detail?.series?.property.is_wait_free}
                        discountPercentage={
                          book.detail?.price_info?.buy.discount_percentage || 0
                        }
                      />
                    </div>
                    <FreeBookRenderer
                      freeBookCount={
                        book.detail?.series?.price_info?.buy?.free_book_count || 0
                      }
                    />
                    <SetBookRenderer
                      setBookCount={book.detail?.setbook?.member_books_count}
                    />
                  </ThumbnailRenderer>
                </ThumbnailWrapper>
                {/* Todo show sentence */}
                {book.detail && type === DisplayType.HotRelease && (
                  <BookMeta book={book.detail} />
                )}
                {book.detail && type === DisplayType.TodayRecommendation && (
                  <div
                    css={[
                      css`
                        padding-left: 14px;
                        margin-top: 2px;
                        font-size: 13px;
                        line-height: 16px;
                        text-align: center;
                        font-weight: 700;
                        white-space: nowrap;
                      `,
                      theme === 'dark' &&
                        css`
                          color: white;
                        `,
                    ]}>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: (book as HotRelease).sentence.replace(
                          /(?:\r\n|\r|\n)/g,
                          '<br />',
                        ),
                      }}
                    />
                  </div>
                )}
              </PortraitBook>
            </div>
          ))}
        </ForwardedRefComponent>
        {carouselInitialize && props.items.length > 6 && (
          <form>
            <Arrow
              onClickHandler={handleLeftArrow}
              label={'이전'}
              color={theme}
              side={'left'}
              wrapperStyle={css`
                ${arrowWrapperCSS};
                ${greaterThanOrEqualTo(
                  BreakPoint.XL + 1,
                  css`
                    left: -31px;
                  `,
                )};
                left: 5px;
                top: calc(${arrowPosition});
              `}
            />
            <Arrow
              label={'다음'}
              onClickHandler={handleRightArrow}
              color={theme}
              side={'right'}
              wrapperStyle={css`
                ${arrowWrapperCSS};
                ${greaterThanOrEqualTo(
                  BreakPoint.XL + 1,
                  css`
                    right: -27px;
                  `,
                )};
                right: 5px;
                top: calc(${arrowPosition});
              `}
            />
          </form>
        )}
      </CarouselWrapper>
    </>
  );
};

export default RecommendedBookCarousel;
