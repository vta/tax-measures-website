/* global window, navigator */
import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faCopy, faEnvelope, faShare } from '@fortawesome/free-solid-svg-icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { isMobile } from '../lib/util.js'
import { trackEvent } from '../lib/ga.js'

const ShareButton = ({ className }) => {
  const shareTitle = '2016 Measure B'
  const shareUrl = window.location.href
  const emailShareUrl = `mailto:?subject=2016%20Measure%20B&body=${encodeURIComponent(shareUrl)}`
  const twitterShareUrl = `https://twitter.com/intent/tweet/?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`
  const facebookShareUrl = `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`

  function triggerShare(event) {
    if (navigator.share) {
      event.preventDefault()
      navigator.share({
        title: shareTitle,
        url: shareUrl
      })
        .catch(console.error)
    }
  }

  return (
    <Dropdown>
      <Dropdown.Toggle className={className}>
        <FontAwesomeIcon icon={faShare} /> Share
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item>
          <CopyToClipboard text={shareUrl}>
            <span onClick={() => trackEvent({
              action: 'click',
              category: 'share',
              label: 'copy'
            })}>
              <FontAwesomeIcon icon={faCopy} /> Copy URL
            </span>
          </CopyToClipboard>
        </Dropdown.Item>
        {isMobile(navigator.userAgent) && <Dropdown.Item
          href={emailShareUrl}
          onClick={() => {
            trackEvent({
              action: 'click',
              category: 'share',
              label: 'email'
            })
            triggerShare()
          }}
        >
          <FontAwesomeIcon icon={faEnvelope} /> Email
        </Dropdown.Item>
        }
        <Dropdown.Item
          href={twitterShareUrl}
          target="_blank"
          onClick={() => trackEvent({
            action: 'click',
            category: 'share',
            label: 'twitter'
          })}
        >
          <FontAwesomeIcon icon={faTwitter} /> Twitter
        </Dropdown.Item>
        <Dropdown.Item
          href={facebookShareUrl}
          target="_blank"
          onClick={() => trackEvent({
            action: 'click',
            category: 'share',
            label: 'facebook'
          })}
        >
          <FontAwesomeIcon icon={faFacebook} /> Facebook
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default ShareButton
