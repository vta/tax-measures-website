import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faFacebook, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { trans } from '../lib/translations'

const Footer = () => {
  const router = useRouter()
  const { locale } = router

  useEffect(() => {
    const googleTranslateElementInit = () => {
      new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.FloatPosition.TOP_RIGHT}, 'google_translate_element');
    }

    window.googleTranslateElementInit = googleTranslateElementInit
  }, [])

  return (
    <div className="row footer d-print-none">
      <div className="col bg-light-blue text-white pb-4 pt-4 pt-md-5">
        <div className="row">
          <div className="col-md-3 text-center mb-3">
            <div className="bg-white p-3 footer-logo mx-auto">
              <img src="/images/vta-logo.png" alt={trans('title', locale)} className="w-100" />
            </div>

            <div id="google_translate_element" className="google-translate-control mt-3"></div>
            <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
          </div>
          <div className="col-md-3 mb-3">
            <p>{trans('footer-info-text', locale)}</p>
            <a href="https://surveys.hotjar.com/s?siteId=1873169&surveyId=162313" target="_blank" className="text-white">{trans('footer-feedback', locale)}</a>
          </div>
          <div className="col-md-3 mb-3">
            Santa Clara Valley Transportation Authority<br />
            Community Outreach<br />
            (408) 321-7575<br />
            community.outreach@vta.org<br />
            3331 N First Street<br />
            San Jose, CA 95134
          </div>
          <div className="col-md-3">
            <ul className="footer-menu">
              <li>
                <a href="https://www.vta.org/about">{trans('footer-menu-about', locale)}</a>
              </li>
              <li>
                <a href="https://www.vta.org/projects/funding/2016-measure-b">{trans('footer-menu-measureb', locale)}</a>
              </li>
              <li>
                <a href="http://santaclaravta.iqm2.com/Citizens/Board/1100-2016-Measure-B-Citizens-Oversight-Committee">{trans('footer-menu-oversight', locale)}</a>
              </li>
              <li>
                <a href="https://www.vta.org/about/contact">{trans('footer-menu-contact', locale)}</a>
              </li>
              <li>
                <a href="https://www.vta.org/privacy-policy">{trans('footer-menu-privacy', locale)}</a>
              </li>
            </ul>

            <div className="mt-3">
              <a href="https://twitter.com/VTA" className="footer-icon"><FontAwesomeIcon icon={faTwitter} title="Twitter" /></a>
              <a href="https://www.facebook.com/scvta" className="footer-icon"><FontAwesomeIcon icon={faFacebook} title="Facebook" /></a>
              <a href="https://www.youtube.com/SCVTA" className="footer-icon"><FontAwesomeIcon icon={faYoutube} title="Youtube" /></a>
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
          color: #FFFFFF;
          text-transform: uppercase;
          font-size: 18px;
        }

        .footer-icon {
          color: #FFFFFF;
          margin-right: 15px;
          font-size: 30px;
        }
      `}</style>
    </div>
  )
}

export default Footer
