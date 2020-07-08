import * as React from 'react';
import { darkTheme, defaultTheme } from 'src/styles/themes';
import { ThemeProvider } from 'emotion-theming';
import { ConnectedInitializeProps } from 'src/types/common';
import GlobalNavigationBar from 'src/components/GNB';
import { PartialSeparator } from 'src/components/Misc';
import { GenreTab } from 'src/components/Tabs';

interface GNBState {
  theme?: string | boolean;
  isMounted: boolean;
}

interface GNBProps {
  type?: string;
  theme?: string;
  search?: string;
  isLogin?: string;
  pathname?: string;
  is_login?: 'true' | 'false';

  // 기존 서점의 search query params 이 'q'
  q?: string;
}
export default class PartialGNB extends React.Component<GNBProps, GNBState> {
  public static getInitialProps(initialProps: ConnectedInitializeProps) {
    if (initialProps.req) {
      return {
        ...initialProps.query,
        is_login: initialProps?.query?.is_login === 'true' ? 'true' : 'false',
      };
    }
    return { ...initialProps.query };
  }

  constructor(props: GNBProps) {
    super(props);
    this.state = {
      theme: props.theme,
      isMounted: false,
    };
  }

  public componentDidMount(): void {
    const { props } = this;
    this.setState({
      isMounted: true,
      theme: props.theme,
    });
  }

  public render() {
    const { props, state } = this;
    return (
      <ThemeProvider theme={!state.theme ? defaultTheme : darkTheme}>
        <PartialSeparator name="GNB" wrapped={!state.isMounted}>
          <GlobalNavigationBar
            id="gnb"
            pathname={props.pathname}
            isPartials
            isLoginForPartials={props.is_login}
            type={props.type}
            searchKeyword=""
          />
          {props.pathname === '/category/list' && (
            <GenreTab isPartials currentGenre="category" />
          )}

          {['/v2/Detail'].includes(props.pathname ?? '') && (
            <GenreTab isPartials currentGenre="" />
          )}

          {props.pathname?.startsWith('/books') && (
            <GenreTab isPartials currentGenre="" />
          )}

          {props.pathname?.startsWith('/event') && (
            <GenreTab isPartials currentGenre="" />
          )}
        </PartialSeparator>
      </ThemeProvider>
    );
  }
}
