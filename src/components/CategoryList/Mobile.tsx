import React, { useState } from 'react';
import { CategoryListProps } from 'src/components/CategoryList/Desktop';
import { css } from '@emotion/core';

import { ParentCategory } from 'src/pages/category/list';
import ArrowDown from 'src/svgs/Arrow_Down_9.svg';
import { RIDITheme } from 'src/styles';

const headerCSS = css`
  background-color: #fff;
  padding: 10px 15px;
  border-bottom: 2px solid #1f8ce6;
  font-size: 14px;
`;

const listCSS = css`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
  background-color: #fff;
`;

const parentCategoryNameCSS = css`
  font-weight: 700;
  color: #636c73;
  font-size: 14px;
`;

const categoryItemCSS = css`
  padding: 10px 10px 10px 15px;
  text-indent: 5px;
  color: #636c73;
  font-size: 14px;
`;

const categoryCollapsedItem = css`
  :first-of-type {
    border-top: 0;
  }
  width: 50%;
  height: 100%;
  border-left: 1px solid #e6e8eb;
  border-bottom: 1px solid #e6e8eb;

  transition: background 0.15s ease-in-out, color 0.15s ease-in-out;
  span {
    transition: background 0.15s ease-in-out, color 0.15s ease-in-out;
  }
`;

interface CategoryCollapseProps {
  categories: ParentCategory[];
  selectedCategory: ParentCategory | null;
  handleSelectCategory: (category: ParentCategory) => void;
}

const CategoryCollapse: React.FC<CategoryCollapseProps> = (props) => {
  const { categories, selectedCategory, handleSelectCategory } = props;
  return (
    <ul css={listCSS}>
      {categories.map((item, index) => (
        <React.Fragment key={index}>
          <li
            css={[
              categoryCollapsedItem,
              selectedCategory
                && selectedCategory.name === item.name
                && css`
                  span {
                    color: #fff;
                  }
                  background: #636c73;
                  color: #fff;
                `,
            ]}
          >
            <button
              type="button"
              css={css`
                display: flex;
                justify-content: space-between;
                padding: 10px 5px 10px 15px;
                height: 100%;
                width: 100%;
              `}
              onClick={handleSelectCategory.bind(null, item)}
            >
              <span css={parentCategoryNameCSS}>{item.name}</span>
              <ArrowDown
                css={(theme: RIDITheme) => css`
                  width: 16px;
                  height: 16px;
                  fill: ${selectedCategory && selectedCategory.name === item.name
                  ? 'white'
                  : theme.primaryColor};
                  ${selectedCategory && selectedCategory.name === item.name
                    ? css`
                        transform: rotate(180deg) translate(0, 0);
                      `
                    : ''};
                  transition: all 0.15s;
                `}
              />
            </button>
          </li>
          {selectedCategory
            && index !== 0
            && index % 2 === 1
            && (selectedCategory.name === item.name
              || selectedCategory.name === categories[index - 1].name) && (
              <li
                css={css`
                  width: 100%;
                  background-color: #ebf6ff;
                  border-top: 1px solid #e6e8eb;
                  border-bottom: 1px solid #e6e8eb;
                `}
              >
                <ul
                  css={css`
                    overflow: hidden;
                    display: flex;
                    flex-wrap: wrap;
                    ${selectedCategory.name === item.name
                    ? css`
                          display: flex;
                          max-height: 500px;
                        `
                    : 'max-height: 0;'};
                  `}
                >
                  <li
                    css={[
                      categoryItemCSS,
                      css`
                        width: 100%;
                      `,
                    ]}
                  >
                    {`${item.name} 전체`}
                  </li>
                  {item.subCategory?.map((subItem, subIndex) => (
                    <li
                      css={[
                        categoryItemCSS,
                        css`
                          width: 50%;
                        `,
                      ]}
                      key={subIndex}
                    >
                      {subItem.name}
                    </li>
                  ))}
                </ul>
                <ul
                  css={css`
                    overflow: hidden;
                    display: flex;
                    flex-wrap: wrap;

                    ${selectedCategory.name === categories[index - 1].name
                    ? css`
                          display: flex;
                          max-height: 500px;
                        `
                    : 'max-height: 0;'};
                  `}
                >
                  <li
                    css={[
                      categoryItemCSS,
                      css`
                        width: 100%;
                      `,
                    ]}
                  >
                    {`${categories[index - 1].name} 전체`}
                  </li>
                  {categories[index - 1].subCategory?.map((subItem, subIndex) => (
                    <li
                      css={[
                        categoryItemCSS,
                        css`
                          width: 50%;
                        `,
                      ]}
                      key={subIndex}
                    >
                      {subItem.name}
                    </li>
                  ))}
                </ul>
              </li>
          )}
        </React.Fragment>
      ))}
    </ul>
  );
};

const Mobile: React.FC<CategoryListProps> = ({ categoryList }) => {
  const [selectedCategory, setCategory] = useState<ParentCategory| null>({
    id: 1,
    name: '전체',
    subCategory: [],
  });
  const handleSelectCategory = (category: ParentCategory) => {
    setCategory(
      selectedCategory?.name === category.name ? null : category,
    );
  };
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        background-color: #f2f4f5;
      `}
    >
      <section css={css``}>
        <h3 css={headerCSS}>일반</h3>
        <CategoryCollapse
          selectedCategory={selectedCategory}
          handleSelectCategory={handleSelectCategory}
          categories={categoryList.general}
        />
      </section>
      <section>
        <h3 css={headerCSS}>로맨스/판타지/만화/BL</h3>
        <CategoryCollapse
          selectedCategory={selectedCategory}
          handleSelectCategory={handleSelectCategory}
          categories={categoryList.curatedCategory}
        />
      </section>
    </div>
  );
};

export default Mobile;
