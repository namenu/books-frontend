import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import * as Cookies from 'js-cookie';

import { GNBContext } from 'src/components/GNB';
import cookieKeys from 'src/constants/cookies';

interface Props {
  passHref?: boolean;
}

const legacyCookieMap = {
  comic: 'comics',
  romance_serial: 'romance-serial',
  fantasy_serial: 'fantasy-serial',
  bl_serial: 'bl-serial',
};

const HomeLink: React.FC<Props> = (props) => {
  const {
    passHref = false,
    children,
  } = props;

  const { origin } = useContext(GNBContext);
  const [genre, setGenre] = useState('');

  useEffect(() => {
    const cookie = Cookies.get(cookieKeys.main_genre);
    setGenre(legacyCookieMap[cookie] ?? cookie);
  }, []);

  if (!process.env.USE_CSR) {
    return React.cloneElement(
      children as React.ReactElement,
      { href: `${origin}/` },
    );
  }
  return (
    <Link
      href={{ pathname: '/[genre]', query: { genre: genre || 'general' } }}
      as={`/${genre}`}
      passHref={passHref}
    >
      {props.children}
    </Link>
  );
};

export default HomeLink;
