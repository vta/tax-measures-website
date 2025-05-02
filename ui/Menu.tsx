'use client';
import { slide as SlideMenu } from 'react-burger-menu';

import { categoryCards } from '#/lib/category-cards.js';

var styles = {
  bmBurgerButton: {
    position: 'absolute',
    width: '36px',
    height: '30px',
    top: '36px',
    right: '36px',
  },
  bmBurgerBars: {
    background: '#373a47',
  },
  bmBurgerBarsHover: {
    background: '#a90000',
  },
  bmCrossButton: {
    height: '24px',
    width: '24px',
  },
  bmCross: {
    background: '#bdc3c7',
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%',
    top: 0,
  },
  bmMenu: {
    background: '#373a47',
    padding: '2.5em 1em 0',
    fontSize: '1.25em',
    color: 'white',
  },
  bmMorphShape: {
    fill: '#373a47',
  },
  bmItemList: {
    color: '#b8b7ad',
    padding: '0.8em',
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)',
  },
};

export const Menu = () => {
  return (
    <>
      <style>
        {`
            .bm-item {
              display: block !important;
              margin-bottom: 15px;
              color: white;
              text-decoration: none;
            }

            .bm-item:hover {
              text-decoration: underline;
            }
          `}
      </style>
      <SlideMenu styles={styles} right>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <div>Program Categories</div>
        {categoryCards.map(({ key }) => (
          <a
            className="ms-4"
            key={key}
            href={`/?grantee=&project=&category=${encodeURIComponent(key)}`}
          >
            {key}
          </a>
        ))}
      </SlideMenu>
    </>
  );
};
