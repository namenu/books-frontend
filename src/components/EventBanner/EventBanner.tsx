import React from 'react';
import { EventBannerList } from 'src/components/EventBanner';
import { EventBanner as EventBannerItem } from 'src/types/sections';
import { orBelow } from 'src/utils/mediaQuery';
import styled from '@emotion/styled';

const Section = styled.section`
  margin: 0 auto;
  width: 100%;
  padding: 24px 0;
  height: 100%;
  ${orBelow(
    999,
    'padding: 16px 0;',
  )}
`;

interface EventBannerProps {
  items: EventBannerItem[];
  genre: string;
  slug: string;
}

const EventBanner: React.FC<EventBannerProps> = (props) => (
  <Section>
    <EventBannerList items={props.items} genre={props.genre} slug={props.slug} />
  </Section>
);

export default EventBanner;
