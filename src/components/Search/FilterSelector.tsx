import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { slateGray20, slateGray60 } from '@ridi/colors';
import { CARET_DOWN_ICON_URL } from 'src/constants/icons';

const Select = styled.select`
  flex: none;
  appearance: none;
  height: 2.8em;
  width: 93px;
  padding: 7px;
  font-size: 12px;
  font-weight: bold;
  background-size: 10px 6px;
  background: white url("${CARET_DOWN_ICON_URL}") no-repeat 93% 50%;
  color: ${slateGray60};
  border: 1px solid ${slateGray20};
  border-radius: 3px;
  outline: none;
  ::-ms-expand {
    display: none;
  }
  :active, :focus {
    background: rgba(0, 0, 0, 0.05) url("${CARET_DOWN_ICON_URL}") no-repeat 93% 50%;
  }
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.05);
`;

export function FilterSelector() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState(router.query?.order ?? 'score');
  function applyFilter(e: React.ChangeEvent<HTMLSelectElement>) {
    const searchParams = new URLSearchParams(
      (router.query as Record<string, string>) || {},
    );
    searchParams.set('order', e.target.value);
    setSelectedFilter(e.target.value);
    router.push(`/search?${searchParams.toString()}`);
  }
  return (
    <label>
      <Select
        value={selectedFilter}
        onChange={applyFilter}
        // Enforce usage of onBlur over onChange for accessibility.
        // https://github.com/reactjs/react-a11y/blob/master/docs/rules/no-onchange.md
        onBlur={applyFilter}
      >
        <option value="score">인기순</option>
        <option value="recent">최신순</option>
        <option value="review_cnt">리뷰 많은순</option>
        <option value="price">낮은 가격순</option>
        <option value="similarity">정확도순</option>
      </Select>
    </label>
  );
}
