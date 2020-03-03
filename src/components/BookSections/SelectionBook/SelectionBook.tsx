import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import styled from '@emotion/styled';
import {
  AIRecommendationBook,
  DisplayType,
  MdBook,
  SectionExtra,
} from 'src/types/sections';
import { View, WindowWidthQuery } from 'libreact/lib/WindowWidthQuery';
import SelectionBookList, {
  loadingItemCSS,
} from 'src/components/BookSections/SelectionBook/SelectionBookList';
import SelectionBookCarousel from 'src/components/BookSections/SelectionBook/SelectionBookCarousel';
// import BookMeta from 'src/components/BookMeta/BookMeta';
import { css } from '@emotion/core';
import { ThumbnailWrapper } from 'src/components/BookThumbnail/ThumbnailWrapper';
import {
  SectionTitle,
  SelectionOption,
} from 'src/components/BookSections/BookSectionContainer';
import { PortraitBook } from 'src/components/Book/PortraitBook';
import ArrowV from 'src/svgs/ArrowV.svg';
import { useBookDetailSelector } from 'src/hooks/useBookDetailSelector';
import BookMeta from 'src/components/BookMeta/BookMeta';
import BookBadgeRenderer from 'src/components/Badge/BookBadgeRenderer';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import FreeBookRenderer from 'src/components/Badge/FreeBookRenderer';
import SetBookRenderer from 'src/components/Badge/SetBookRenderer';
import ThumbnailRenderer from 'src/components/BookThumbnail/ThumbnailRenderer';
import { sendClickEvent, useEventTracker } from 'src/hooks/useEventTracker';
import { getMaxDiscountPercentage } from 'src/utils/common';
import { flexRowStart, scrollBarHidden } from 'src/styles';
import { AdultBadge } from 'src/components/Badge/AdultBadge';

const SectionWrapper = styled.section`
  max-width: 1000px;
  margin: 0 auto;
  padding-top: 24px;
  padding-bottom: 24px;
  ${orBelow(
    999,
    css`
      padding-top: 16px;
      padding-bottom: 16px;
    `,
  )};
  -webkit-overflow-scrolling: touch;
`;

interface SelectionBookProps {
  items: MdBook[];
  title: string;
  option: SelectionOption;
  genre: string;
  type: DisplayType;
  categoryId?: number;
  extra?: SectionExtra;
  selectionId?: number;
  slug: string;
}

interface SelectionBookItemProps {
  book: MdBook | AIRecommendationBook;
  genre: string;
  isAIRecommendation: boolean;
  aiRecommendationCallback?: {
    exclude: (bId: string, rcmd_id: string, genre: string) => void;
    excludeCancel: (bId: string, genre: string) => void;
  };
  width: number;
  type: DisplayType;
  slug: string;
  order?: number;
  excluded?: boolean;
}

export const SelectionBookItem: React.FC<SelectionBookItemProps> = React.memo((props) => {
  const {
    book,
    isAIRecommendation,
    genre,
    type,
    slug,
    order,
    aiRecommendationCallback,
    excluded,
  } = props;

  // 추천제외 여부
  const [localExcluded, setLocalExcluded] = useState(excluded);
  const [isFetching, setFetching] = useState(false);
  const [tracker] = useEventTracker();
  const requestExclude = useCallback(
    async (bId, rcmdId) => {
      try {
        setFetching(true);
        const result = await aiRecommendationCallback.exclude(bId, rcmdId, props.genre);
        // @ts-ignore
        if (result) {
          setLocalExcluded(true);
        }
      } finally {
        setFetching(false);
      }
    },
    [aiRecommendationCallback],
  );

  const requestCancelExclude = useCallback(
    async (bId) => {
      try {
        setFetching(true);
        const result = await aiRecommendationCallback.excludeCancel(bId, props.genre);
        // @ts-ignore
        if (result) {
          setLocalExcluded(false);
        }
      } finally {
        setFetching(false);
      }
    },
    [aiRecommendationCallback],
  );

  return (
    <>
      <a
        css={css`
          display: block;
        `}
        onClick={sendClickEvent.bind(null, tracker, book, slug, order)}
        href={`/books/${book.b_id}`}
      >
        <ThumbnailWrapper
          css={[
            localExcluded
              && css`
                opacity: 0.2;
                pointer-events: none;
              `,
            css`
              transition: opacity 0.2s;
            `,
          ]}
        >
          <ThumbnailRenderer
            className={slug}
            order={order}
            slug={slug}
            responsiveWidth={[
              css`width: 140px;`,
              orBelow(999, css`width: 100px;`),
            ]}
            sizes="(max-width: 999px) 100px, 140px"
            book={{ b_id: book.b_id, detail: book.detail }}
            imgSize="large"
          >
            <div
              css={css`
                position: absolute;
                display: block;
                top: -7px;
                left: -7px;
                z-index: 2;
              `}
            >
              <BookBadgeRenderer
                type={type}
                isRentable={
                  (!!book.detail?.price_info?.rent
                    || !!book.detail?.series?.price_info?.rent)
                  && ['general', 'romance', 'bl'].includes(genre)
                }
                isWaitFree={book.detail?.series?.property.is_wait_free}
                discountPercentage={getMaxDiscountPercentage(book.detail)}
              />
            </div>
            <FreeBookRenderer
              freeBookCount={
                book.detail?.series?.price_info?.rent?.free_book_count
                || book.detail?.series?.price_info?.buy?.free_book_count
                || 0
              }
              unit={book.detail?.series?.property.unit || '권'}
            />
            <SetBookRenderer setBookCount={book.detail?.setbook?.member_books_count} />
            {book.detail?.property?.is_adult_only && <AdultBadge />}
          </ThumbnailRenderer>
        </ThumbnailWrapper>
      </a>

      {book.detail && (
        <BookMeta
          showTag={['bl', 'bl-serial'].includes(genre)}
          book={book.detail}
          width={`${props.width || 140}px`}
          showRating={type === DisplayType.HomeMdSelection}
          isAIRecommendation={false}
          ratingInfo={(book as MdBook).rating}
          wrapperCSS={
            localExcluded
            && css`
              opacity: 0.2;
              pointer-events: none;
            `
          }
        />
      )}

      {isAIRecommendation && (
        <button
          css={[
            css`
              margin-top: 8px;
              margin-left: 7px;
              border-radius: 4px;
              border: solid 1px #d6d6d6;
              padding: 6px 7px;
              font-size: 10px;
              font-weight: bold;
              line-height: 1;
              color: #aaaaaa;
              outline: none;
            `,
            isFetching
              && css`
                opacity: 0.3;
                cursor: not-allowed;
              `,
          ]}
          onClick={
            localExcluded
              ? requestCancelExclude.bind(null, book.b_id)
              : requestExclude.bind(
                null,
                book.b_id,
                (book as AIRecommendationBook).rcmd_id,
              )
          }
          aria-label={localExcluded ? '다시 보기' : '추천 제외'}
        >
          {localExcluded ? '다시 보기' : '추천 제외'}
        </button>
      )}
    </>
  );
});

export interface SelectionBookCarouselProps {
  items: MdBook[]; // Fixme Md 타입 말고 comics UserPreferredSection 타입이 API 결과로 오는데 이 부분 확인해야 함
  isAIRecommendation: boolean;
  genre: string;
  type: DisplayType;
  bookFetching?: boolean;
  slug?: string;
}

export const SelectionBookLoading: React.FC<SelectionBookCarouselProps> = React.memo(
  (props) => {
    const { genre, type } = props;

    return (
      <div
        css={css`
          position: relative;
          width: 1005px;
          max-width: 1005px;
          margin: 0 auto;
          margin-top: 6px;
          height: 100%;
          margin-left: -2px;
        `}
      >
        <ul
          css={[
            flexRowStart,
            scrollBarHidden,
            loadingItemCSS,
            css`
              justify-content: space-between;
              padding-left: 16px;
              ${orBelow(
              BreakPoint.LG,
              css`
                  padding-left: 16px;
                  justify-content: start;
                `,
            )}
            `,
          ]}
        >
          {props.items.map((book, index) => (
            <PortraitBook key={index}>
              <ThumbnailWrapper>
                <ThumbnailRenderer
                  book={{ b_id: book.b_id, detail: book.detail }}
                  imgSize="large"
                  responsiveWidth={[
                    css`width: 140px;`,
                    orBelow(999, css`width: 100px;`),
                  ]}
                  sizes="(max-width: 999px) 100px, 140px"
                />
              </ThumbnailWrapper>
              {book.detail && (
                <BookMeta
                  showTag={['bl', 'bl-serial'].includes(genre)}
                  book={book.detail}
                  showRating={type === DisplayType.HomeMdSelection}
                  ratingInfo={book.rating}
                />
              )}
            </PortraitBook>
          ))}
        </ul>
      </div>
    );
  },
  (prev, next) => {
    if (prev.genre === next.genre && prev.items.length === next.items.length) {
      return true;
    }
    return false;
  },
);

const SelectionBook: React.FC<SelectionBookProps> = React.memo((props) => {
  const {
    genre, type, slug, title, extra, selectionId,
  } = props;
  const [, setMounted] = useState(false);

  const [books, isFetching] = useBookDetailSelector(props.items) as [MdBook[], boolean];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Todo
  // const handleExceptAIRecommendation = (bId: string) => {
  //
  // }
  const targetRef = useRef(null);
  return (
    <SectionWrapper ref={targetRef}>
      <SectionTitle aria-label={title}>
        {extra?.detail_link || (type === DisplayType.HomeMdSelection && selectionId) ? (
          // Todo Refactor
          <a
            css={css`
              display: flex;
            `}
            href={
              extra?.detail_link ?? `/selection/${selectionId}`
            }
          >
            <span>{title}</span>
            <span
              css={css`
                margin-left: 7.8px;
              `}
            >
              <ArrowV />
            </span>
          </a>
        ) : (
          <span>{title}</span>
        )}
      </SectionTitle>
      <WindowWidthQuery>
        <View maxWidth={1000}>
          <div>
            <SelectionBookList
              slug={slug}
              type={type}
              genre={genre}
              isAIRecommendation={props.option.isAIRecommendation}
              items={books}
            />
          </div>
        </View>
        <View>
          <div>
            <SelectionBookCarousel
              type={type}
              slug={slug}
              genre={genre}
              isAIRecommendation={props.option.isAIRecommendation}
              items={books}
              bookFetching={isFetching}
            />
          </div>
        </View>
      </WindowWidthQuery>
    </SectionWrapper>
  );
});

export default SelectionBook;
