import { css } from '@emotion/core';
import styled from '@emotion/styled';
import {
  dodgerBlue50,
  red40,
  slateGray60,
} from '@ridi/colors';
import * as React from 'react';

import * as BookApi from 'src/types/book';
import * as SearchTypes from 'src/types/searchResults';

const PriceItem = styled.dl`
  display: flex;
  align-items: center;
  height: 18px;
`;
const priceBase = css`
  font-size: 13px;
  line-height: 18px;
`;
const PriceTitle = styled.dt`
  margin-right: 4px;
  color: ${slateGray60};
  ${priceBase}
`;

const Price = styled.span`
  color: ${dodgerBlue50};
  font-weight: bold;
  ${priceBase}
`;

const Discount = styled.span`
  color: ${red40};
  font-weight: bold;
  ${priceBase}
`;

// const OriginalPrice = styled.span`
//   text-decoration: line-through;
//   color: ${slateGray50};
//   ${priceBase}
// `;

// https://rididev.slack.com/archives/CHSBJC7U1/p1590034684168300 여기서 논의 됨
const NOT_FOR_SALE_PRICE = 999999999;

function PriceLabel(props: {
  title: string;
  price: number;
  discount?: number;
  regularPrice?: number; // 정가 구분 룰이 확실하게 정해지면 optional 제외
}) {
  const {
    title,
    price,
    discount = 0,
  } = props;
  if (price === NOT_FOR_SALE_PRICE) {
    return null;
  }
  return (
    <PriceItem>
      <PriceTitle>{title}</PriceTitle>
      <dd>
        <Price>{price === 0 ? '무료' : `${price.toLocaleString('ko-KR')}원`}</Price>
        {' '}
        {discount > 0 && (
          <>
            <Discount>
              (
              {Math.ceil(discount)}
              %↓)
            </Discount>
            {' '}
            {/* Fixme */}
            {/* 가장 낮은 가격의 정가 문제가 해결이 필요하기 때문에 일단 주석 처리 합니다. */}
            {/* <OriginalPrice> */}
            {/*  {regularPrice.toLocaleString('ko-KR')} */}
            {/*  원 */}
            {/* </OriginalPrice> */}
          </>
        )}
      </dd>
    </PriceItem>
  );
}

export default function PriceInfo(props: {
  searchApiResult: SearchTypes.SearchBookDetail;
  bookApiResult: BookApi.SimpleBook;
  genre: string;
}) {
  const { searchApiResult, bookApiResult, genre } = props;
  if (!bookApiResult) {
    return null;
  }
  const {
    isTrial,
    price: price_info,
  } = bookApiResult;
  const { price, series_prices_info } = searchApiResult;

  const seriesPriceInfo: Record<string, SearchTypes.SeriesPriceInfo> = {};
  series_prices_info.forEach((info) => {
    seriesPriceInfo[info.type] = info;
  });
  // 체험판 부터 거른다.
  if (isTrial) {
    return <PriceLabel title="구매" price={0} discount={0} regularPrice={0} />;
  }
  // 진정한 무료 책
  if (!seriesPriceInfo.normal && price === 0 && price_info?.buy?.price === 0) {
    return <PriceLabel title="구매" price={0} discount={0} regularPrice={0} />;
  }
  if (price_info && price !== 0) {
    return (
      <>
        {price_info.rent && (
          <PriceLabel
            title="대여"
            price={
              price_info.rent.price === 0 && seriesPriceInfo.rent
                ? seriesPriceInfo.rent.min_nonzero_price
                : price_info.rent.price
            }
            discount={
              price_info.rent.discount_percentage === 100
                ? 0
                : price_info.rent.discount_percentage
            }
            regularPrice={price_info.rent.regular_price}
          />
        )}
        <PriceLabel
          title="구매"
          price={
            seriesPriceInfo.normal && genre !== 'general'
              ? Math.min(price, seriesPriceInfo.normal.min_nonzero_price)
              : price
          }
          discount={price_info.buy ? price_info.buy.discount_percentage : 0}
          regularPrice={price_info.buy?.regular_price ?? 0}
        />
      </>
    );
  }
  if (seriesPriceInfo && price === 0) {
    return (
      <>
        {seriesPriceInfo.rent && (
          <PriceLabel
            title="대여"
            price={seriesPriceInfo.rent.min_nonzero_price}
            discount={0}
            regularPrice={price_info?.rent?.regular_price ?? 0}
          />
        )}
        {seriesPriceInfo.normal && (
          <PriceLabel
            title="구매"
            price={
              seriesPriceInfo.normal.min_price !== 0
                ? Math.min(
                  seriesPriceInfo.normal.min_nonzero_price,
                  seriesPriceInfo.normal.min_price,
                )
                : seriesPriceInfo.normal.min_nonzero_price
            }
            regularPrice={price_info?.buy?.regular_price ?? 0}
          />
        )}
      </>
    );
  }

  return null;
}
