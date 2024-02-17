'use client';

import Image from 'next/image';
import { Menu } from '#/ui/Menu';

export function Header() {
  /* eslint-disable @next/next/no-html-link-for-pages */
  const LogoLink = () => (
    <a href="/">
      <h1 className="p-1 p-md-2 m-0 h-100" style={{ width: '120px' }}>
        <Image
          src="/images/logo.png"
          alt="2016 Measure B"
          className="logo"
          width="738"
          height="598"
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </h1>
    </a>
  );
  /* eslint-enable @next/next/no-html-link-for-pages */

  return (
    <div className="row bg-white no-gutters d-block d-lg-flex justify-content-between">
      <div className="col col-md-auto bg-light-blue text-white ">
        <LogoLink />
      </div>

      <div className="col-md-1"></div>
      <Menu />
    </div>
  );
}
