import React from 'react'

const Footer = props => (
  <div className='row footer'>
    <div className='col bg-light-blue text-white pb-4 pt-5'>
      <div className='row'>
        <div className='col-md-2 offset-md-1'>
          <img src="/images/logo.png" alt="2016 Measure B" className="footer-logo" />
        </div>
        <div className='col-md-4'>
          Downtown Customer Service Center<br />
          55-A West Santa Clara Street<br />
          San Jose, CA 95113<br />
          Weekdays: 9 a.m. - 6 p.m.<br />
          Closed weekends and most holidays
        </div>
        <div className='col-md-4'>
          River Oaks Administrative Offices<br />
          3331 North First Street<br />
          San Jose, CA 94134<br />
          Weekdays: 8 a.m. - 4:30 p.m.<br />
          Closed weekends and most holidays
        </div>
      </div>
      <div className='row'>
        <div className='col text-center'>
          <ul className="footer-menu">
            <li>
              <a href="https://www.vta.org//about/contact">Contact</a>
            </li>
            <li>
              <a href="https://www.vta.org//about/careers">Careers</a>
            </li>
            <li>
              <a href="https://www.vta.org//business-center">Business Center</a>
            </li>
            <li>
              <a href="http://santaclaravta.iqm2.com/Citizens/default.aspx">Board Agendas</a>
            </li>
            <li>
              <a href="https://www.vta.org//go/accessibility">Accessibility</a>
            </li>
            <li>
              <a href="https://www.vta.org//about/title-vi">Title VI</a>
            </li>
          </ul>
        </div>
      </div>
      <div className='row'>
        <div className='col'>
          <div className='copyright text-center'>
            Copyright 2018 Santa Clara Valley Transportation Authority (VTA). All Rights Reserved.
          </div>
        </div>
      </div>
    </div>

    <style jsx>{`
      .footer-logo {
        height: 105px;
      }

      .footer-menu {
        list-style-type: none;
        display: block;
        padding: 40px 0 10px;
        margin: 0;
      }

      .footer-menu li {
        display: inline-block;
        padding: 0 12px;
        border-right: 1px solid #FFFFFF;
      }

      .footer-menu li:last-child {
        border-right: none;
      }

      .footer-menu li a {
        color: #FFFFFF;
        text-transform: uppercase;
        font-size: 18px;
      }

      .copyright {
        text-transform: uppercase;
        font-size: 14px;
      }
    `}</style>
  </div>
)

export default Footer
