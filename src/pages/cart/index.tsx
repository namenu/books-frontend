import * as React from 'react';
import Head from 'next/head';
import { ConnectedInitializeProps } from 'src/types/common';

interface CartPageProps {
  q?: string;
}

export default class CartPage extends React.Component<CartPageProps> {
  public static getInitialProps(props: ConnectedInitializeProps) {
    return { q: props.query.q };
  }

  public render() {
    return (
      <>
        <Head>
          <title>리디북스 - 카트</title>
        </Head>
        <div>카트</div>
      </>
    );
  }
}
