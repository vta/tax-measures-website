'use client';
/* global window, document */

import { useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faFacebook,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';

export const Footer = () => {
  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        layout:
          window.google.translate.TranslateElement.FloatPosition.TOP_RIGHT,
      },
      'google_translate_element'
    );
  };

  useEffect(() => {
    const addScript = document.createElement('script');
    addScript.setAttribute(
      'src',
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    );
    document.body.append(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  return (
    <div className="row footer d-print-none">
      <div className="col bg-light-blue text-white pb-4 pt-4 pt-md-5">
        <div className="row">
          <div className="col-md-3 text-center mb-3">
            <div className="bg-white p-3 footer-logo mx-auto">
              <Image
                src="/images/vta-logo.png"
                alt="2016 Measure B"
                className="w-100"
                width="262"
                height="62"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </div>

            <div
              id="google_translate_element"
              className="google-translate-control mt-3"
            ></div>
          </div>
          <div className="col-md-3 mb-3">
            <p>
              This website provides unaudited financial information about
              VTA&apos;s 2016 Measure B, updated quarterly or as new information
              is released.
            </p>
          </div>
          <div className="col-md-3 mb-3">
            Santa Clara Valley Transportation Authority
            <br />
            Community Outreach
            <br />
            (408) 321-7575
            <br />
            community.outreach@vta.org
            <br />
            3331 N First Street
            <br />
            San Jose, CA 95134
          </div>
          <div className="col-md-3">
            <ul className="footer-menu">
              <li>
                <a href="https://www.vta.org/about">About VTA</a>
              </li>
              <li>
                <a href="https://www.vta.org/projects/funding/2016-measure-b">
                  2016 Measure B
                </a>
              </li>
              <li>
                <a href="http://santaclaravta.iqm2.com/Citizens/Board/1100-2016-Measure-B-Citizens-Oversight-Committee">
                  Oversight Committee
                </a>
              </li>
              <li>
                <a href="https://www.vta.org/about/contact">Contact</a>
              </li>
              <li>
                <a href="https://www.vta.org/privacy-policy">Privacy Policy</a>
              </li>
            </ul>

            <div className="mt-3">
              <a href="https://twitter.com/VTA" className="footer-icon">
                <FontAwesomeIcon icon={faTwitter} title="Twitter" />
              </a>
              <a href="https://www.facebook.com/scvta" className="footer-icon">
                <FontAwesomeIcon icon={faFacebook} title="Facebook" />
              </a>
              <a href="https://www.youtube.com/SCVTA" className="footer-icon">
                <FontAwesomeIcon icon={faYoutube} title="Youtube" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-logo {
          max-width: 300px;
        }

        .footer-menu {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }

        .footer-menu li a {
          color: #ffffff;
          text-transform: uppercase;
          font-size: 18px;
        }

        .footer-icon {
          color: #ffffff;
          margin-right: 15px;
          font-size: 30px;
        }
      `}</style>
    </div>
  );
};
