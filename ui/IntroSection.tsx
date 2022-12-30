'use client';

import { useState } from 'react';

import { AboutModal } from '#/ui/AboutModal';

export const IntroSection = ({ data }) => {
  const [aboutModalShow, setAboutModalShow] = useState(false);

  return (
    <div className="row mb-3">
      <div className="col-lg-6 offset-lg-3">
        <div className="card">
          <div className="card-body">
            <h3>See how 2016 Measure B has been spent</h3>
            <ul>
              <li>Filter by program categories or grantees</li>
              <li>Search for a specific project by name</li>
              <li>Visualize funding in a chart or map</li>
              <li>Download project data as a PDF or CSV</li>
            </ul>
            <div>
              <a href="#" onClick={() => setAboutModalShow(true)}>
                Read More &raquo;
              </a>
            </div>
          </div>
        </div>
      </div>

      <AboutModal
        faqs={data.faqs}
        show={aboutModalShow}
        onHide={() => setAboutModalShow(false)}
      />
    </div>
  );
};
