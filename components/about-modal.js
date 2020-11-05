import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { useRouter } from 'next/router'
import { trans } from '../lib/translations'

const Faq = ({ faq }) => {
  return (
    <>
      <h4 dangerouslySetInnerHTML={{ __html: faq['faq-question'] }} />
      <p dangerouslySetInnerHTML={{ __html: faq['faq-answer'] }} />
    </>
  )
}

const AboutModal = ({ faqs, ...props }) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {trans('about-title', locale)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{trans('about-whatismeasureb-title', locale)}</h4>
        <p>
        {trans('about-whatismeasureb-text1', locale)} <a href="http://santaclaravta.iqm2.com/Citizens/Board/1100-2016-Measure-B-Citizens-Oversight-Committee">{trans('about-whatismeasureb-text2', locale)}</a> {trans('about-whatismeasureb-text3', locale)} <a href="https://www.vta.org/projects/funding/2016-measure-b">{trans('read-more', locale)} &raquo;</a>
        </p>

        <h4>{trans('about-whatiswebsite-title', locale)}</h4>
        <p>
          {trans('about-whatiswebsite-text1', locale)}
        </p>

        <h4>{trans('about-questions-title', locale)}</h4>
        <p>
          {trans('about-questions-text1', locale)} <a href="mailto:2016MeasureB@vta.org">2016MeasureB@vta.org</a> {trans('about-questions-text2', locale)} <a href="https://surveys.hotjar.com/s?siteId=1873169&surveyId=162313" target="_blank">{trans('about-questions-text3', locale)}</a> {trans('about-questions-text4', locale)}.
        </p>
        {faqs.map((faq, index) => (<Faq faq={faq} key={index} />))}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} className="btn-secondary">{trans('close', locale)}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AboutModal
