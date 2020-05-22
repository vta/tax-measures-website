/* global window */
import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faCopy, faEnvelope, faShare } from '@fortawesome/free-solid-svg-icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const ShareButton = ({ className }) => {
  const shareTitle = '2016 Measure B'
  const shareUrl = window.location.href
  const emailShareUrl = `mailto:?subject=2016%20Measure%20B&body=${encodeURIComponent(shareUrl)}`
  const twitterShareUrl = `https://twitter.com/intent/tweet/?text=${encodeURIComponent(shareTitle)}&amp;url=${encodeURIComponent(shareUrl)}`
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
        <FontAwesomeIcon icon={faShare} title="Share" /> Share
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item>
          <CopyToClipboard text={shareUrl}>
            <span><FontAwesomeIcon icon={faCopy} title="Copy" /> Copy URL</span>
          </CopyToClipboard>
        </Dropdown.Item>
        <Dropdown.Item href={emailShareUrl} onClick={triggerShare} target="_blank"><FontAwesomeIcon icon={faEnvelope} title="Email" /> Email</Dropdown.Item>
        <Dropdown.Item href={twitterShareUrl} target="_blank"><FontAwesomeIcon icon={faTwitter} title="Twitter" /> Twitter</Dropdown.Item>
        <Dropdown.Item href={facebookShareUrl} target="_blank"><FontAwesomeIcon icon={faFacebook} title="Facebook" /> Facebook</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default ShareButton
