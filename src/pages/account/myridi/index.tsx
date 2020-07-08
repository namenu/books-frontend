import * as React from 'react';
import Head from 'next/head';
import { ConnectedInitializeProps } from 'src/types/common';

interface MyRidiProps {
  q?: string;
}

export default class MyRidi extends React.PureComponent<MyRidiProps> {
  public static getInitialProps(props: ConnectedInitializeProps) {
    return { q: props.query.q };
  }

  public render() {
    return (
      <>
        <Head>
          <title>리디북스 - 마이리디</title>
        </Head>
        <div>마이리디</div>
      </>
    );
  }
}
