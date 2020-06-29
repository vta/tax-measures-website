/* global window */

export const GA_TRACKING_ID = 'UA-44426936-13'

export const pageview = url => {
  if (!window.ga) {
    return
  }

  window.ga('create', GA_TRACKING_ID, 'auto')
  window.ga('send', {
    hitType: 'pageview',
    page: url
  })
}

export const trackEvent = ({ action, category, label, value }) => {
  if (!window.ga) {
    return
  }

  window.ga('send', {
    hitType: 'event',
    eventAction: action,
    eventCategory: category,
    eventLabel: label,
    eventValue: value,
    transport: 'beacon'
  })
}
