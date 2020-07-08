import React, { useEffect, useState } from 'react';
import { ConnectedInitializeProps } from 'src/types/common';
import Head from 'next/head';
import { GenreTab } from 'src/components/Tabs';
import PageTitle from 'src/components/PageTitle/PageTitle';
import { css } from '@emotion/core';
import Desktop from 'src/components/CategoryList/Desktop';
import Mobile from 'src/components/CategoryList/Mobile';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import useIsTablet from 'src/hooks/useIsTablet';

export interface Category {
  id: number;
  name: string;
}

export interface ParentCategory extends Category {
  subCategory: Category[];
}

export interface CategoryList {
  general: ParentCategory[];
  curatedCategory: ParentCategory[];
}

export const categoryMock: CategoryList = {
  general: [
    {
      id: 1,
      name: '소설',
      subCategory: [
        { id: 20, name: '한국 소설' },
        { id: 21, name: '영미 소설' },
        { id: 22, name: '일본 소설' },
        { id: 23, name: '중국 소설' },
        { id: 24, name: '북유럽 소설' },
        { id: 25, name: '독일 소설' },
        { id: 26, name: '프랑스 소설' },
        { id: 27, name: '기타 국가 소설' },
        { id: 28, name: '추리/미스터리/스릴러' },
        { id: 29, name: 'SF 소설' },
        { id: 30, name: '국내 판타지 소설' },
        { id: 31, name: '해외 판타지 소설' },
        { id: 32, name: '국내 역사 소설' },
        { id: 32, name: '해외 역사 소설' },
        { id: 32, name: '대체 역사 소설' },
        { id: 32, name: '동양 고전문학' },
        { id: 32, name: '서양 고전문학' },
      ],
    },
    {
      id: 2,
      name: '경영/경제',
      subCategory: [
        { id: 33, name: '경영 일반' },
        { id: 34, name: '경제 일반' },
        { id: 35, name: '마케팅/세일즈' },
        { id: 36, name: '재테크/금융/부동산' },
        { id: 37, name: 'CEO/리더십' },
      ],
    },
    {
      id: 3,
      name: '인문/사회/역사',
      subCategory: [
        { id: 40, name: '인문' },
        { id: 41, name: '정치/사회' },
        { id: 42, name: '예술/문화' },
        { id: 43, name: '역사' },
      ],
    },
    {
      id: 4,
      name: '자기계발',
      subCategory: [
        { id: 50, name: '성공/삶의자세' },
        { id: 51, name: '기획/창의/리더십' },
        { id: 52, name: '설득/화술/협상' },
        { id: 53, name: '취업/창업' },
        { id: 54, name: '여성' },
        { id: 55, name: '인간관계' },
      ],
    },
    {
      id: 5,
      name: '에세이/시',
      subCategory: [{ id: 60, name: '에세이' }, { id: 61, name: '시' }],
    },
    {
      id: 6,
      name: '여행',
      subCategory: [{ id: 70, name: '국내 여행' }, { id: 71, name: '해외 여행' }],
    },
    {
      id: 7,
      name: '종교',
      subCategory: [
        { id: 80, name: '종교일반' },
        { id: 81, name: '가톨릭' },
        { id: 82, name: '가톨릭(개신교)' },
        { id: 83, name: '불교' },
        { id: 84, name: '기타' },
      ],
    },
    {
      id: 8,
      name: '외국어',
      subCategory: [
        { id: 90, name: '비즈니스영어' },
        { id: 91, name: '일반영어' },
        { id: 92, name: '제2외국어' },
        { id: 93, name: '어학시험' },
      ],
    },
    {
      id: 9,
      name: '과학',
      subCategory: [
        { id: 20, name: '과학일반' },
        { id: 21, name: '수학' },
        { id: 22, name: '자연과학' },
        { id: 23, name: '응용과학' },
      ],
    },
    {
      id: 10,
      name: '진로/교육/교재',
      subCategory: [
        { id: 20, name: '공부법' },
        { id: 21, name: '특목고/자사고' },
        { id: 22, name: '대입 수시' },
        { id: 23, name: '대입 논술' },
        { id: 24, name: '대입 합격수기' },
        { id: 25, name: '진로 탐색' },
        { id: 26, name: '유학/MBA' },
        { id: 27, name: '교재/수험서' },
      ],
    },
    {
      id: 11,
      name: '컴퓨터/IT',
      subCategory: [
        { id: 20, name: 'IT 비즈니스' },
        { id: 21, name: '개발/프로그래밍' },
        { id: 22, name: '컴퓨터/앱 활용' },
        { id: 23, name: 'IT자격증' },
        { id: 24, name: 'IT 해외원서' },
      ],
    },
    {
      id: 12,
      name: '건강/다이어트',
      subCategory: [
        { id: 20, name: '다이어트/운동/스포츠' },
        { id: 21, name: '스타일/뷰티' },
        { id: 22, name: '건강' },
      ],
    },
    {
      id: 13,
      name: '가정/생활',
      subCategory: [
        { id: 20, name: '결혼/임신/출산' },
        { id: 21, name: '육아/자녀교육' },
        { id: 22, name: '취미/요리/기타' },
      ],
    },
    {
      id: 14,
      name: '어린이/청소년',
      subCategory: [
        { id: 20, name: '유아' },
        { id: 21, name: '어린이' },
        { id: 22, name: '청소년' },
      ],
    },
    {
      id: 15,
      name: '해외도서',
      subCategory: [],
    },
    {
      id: 16,
      name: '잡지',
      subCategory: [
        { id: 20, name: '경영/재테크' },
        { id: 21, name: '문학/교양' },
        { id: 22, name: '여성/패션/뷰티' },
        { id: 23, name: '디자인/예술' },
        { id: 24, name: '건강/스포츠' },
        { id: 25, name: '취미/여행/요리' },
        { id: 26, name: '과학/IT' },
        { id: 27, name: '종교' },
        { id: 28, name: '만화' },
        { id: 28, name: '성인(19+)' },
      ],
    },
  ],
  curatedCategory: [
    {
      id: 100,
      name: '로맨스 단행본',
      subCategory: [
        { id: 20, name: '현대물' },
        { id: 21, name: '역사/시대물' },
        { id: 22, name: '판타지물' },
        { id: 23, name: '할리퀸 소설' },
        { id: 24, name: '19+' },
        { id: 25, name: 'TL 소설' },
        { id: 26, name: '섹슈얼 로맨스' },
        { id: 27, name: '하이틴' },
      ],
    },
    {
      id: 200,
      name: '로맨스 연재',
      subCategory: [
        { id: 20, name: '현대물' },
        { id: 21, name: '역사/시대물' },
        { id: 22, name: '판타지물' },
      ],
    },
    {
      id: 300,
      name: '판타지 단행본',
      subCategory: [
        { id: 20, name: '정통 판타지' },
        { id: 21, name: '퓨전 판타지' },
        { id: 22, name: '현대 판타지' },
        { id: 23, name: '게임 판타지' },
        { id: 24, name: '대체 역사물' },
        { id: 25, name: '스포츠물' },
        { id: 26, name: '신무협' },
        { id: 27, name: '전통무협' },
      ],
    },
    {
      id: 400,
      name: '판타지 연재',
      subCategory: [
        { id: 20, name: '정통 판타지' },
        { id: 21, name: '퓨전 판타지' },
        { id: 22, name: '현대 판타지' },
        { id: 22, name: '무협 소설' },
      ],
    },
    {
      id: 500,
      name: '만화',
      subCategory: [
        { id: 20, name: '국내 순정' },
        { id: 21, name: '해외 순정' },
        { id: 22, name: '드라마' },
        { id: 23, name: '성인' },
        { id: 24, name: '할리퀸' },
        { id: 25, name: '무협' },
        { id: 26, name: '학원' },
        { id: 27, name: '액션' },
        { id: 27, name: '판타지/SF' },
        { id: 27, name: '스포츠' },
        { id: 27, name: '코믹' },
        { id: 27, name: '공포/추리' },
        { id: 27, name: '만화잡지' },
      ],
    },
    {
      id: 600,
      name: 'BL 단행본',
      subCategory: [
        { id: 20, name: '국내 소설' },
        { id: 21, name: '해외 소설' },
        { id: 22, name: '국내 만화' },
        { id: 23, name: '해외 만화' },
      ],
    },
    {
      id: 700,
      name: 'BL 연재',
      subCategory: [{ id: 20, name: '소설' }, { id: 27, name: '만화' }],
    },
    {
      id: 800,
      name: '라노벨',
      subCategory: [
        { id: 20, name: '남성향 라노벨' },
        { id: 21, name: '여성향 라노벨' },
        { id: 22, name: 'TL' },
      ],
    },
  ],
};

interface CategoryListPageProps {
  categoryList: CategoryList;
}

const sectionCSS = css`
  padding: 31px 50px 50px 50px;
  max-width: 1000px;
  margin: 0 auto;
  margin-top: -20px;
  ${orBelow(
    BreakPoint.LG,
    'padding: 0;',
  )}
`;
function CategoryListPage(props: CategoryListPageProps) {
  const { categoryList: categories } = props;
  const [isMounted, setMounted] = useState(false);

  const [categoryList] = useState(
    categories || { general: [], curatedCategory: [] },
  );
  const isTablet = useIsTablet();
  useEffect(() => {
    setMounted(true);
  }, []);

  function renderCategory() {
    if (!isMounted) {
      return <div />;
    }
    if (isTablet) {
      return <Mobile categoryList={categoryList}>hey...</Mobile>;
    }
    return <Desktop categoryList={categoryList} />;
  }
  return (
    <>
      <Head>
        <title>카테고리 - 리디북스</title>
      </Head>
      <GenreTab currentGenre="general" />
      <section css={sectionCSS}>
        <PageTitle title="카테고리" mobileHidden />
        {renderCategory()}
      </section>
    </>
  );
}

// Todo Remove!
CategoryListPage.getInitialProps = (props: ConnectedInitializeProps) => ({
  q: props.query.q,
  categoryList: categoryMock,
});

export default CategoryListPage;
