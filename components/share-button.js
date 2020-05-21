/* global window */
import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faCopy, faEnvelope, faShare } from '@fortawesome/free-solid-svg-icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const ShareButton = ({ className }) => {
  const emailShareUrl = `mailto:?subject=2016%20Measure%20B&body=${encodeURIComponent(window.location.href)}`
  const twitterShareUrl = `https://twitter.com/intent/tweet/?text=${encodeURIComponent('2016 Measure B')}&amp;url=${encodeURIComponent(window.location.href)}`
  const facebookShareUrl = `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`

  return (
    <Dropdown>
      <Dropdown.Toggle className={className}>
        <FontAwesomeIcon icon={faShare} title="Share" /> Share
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item>
          <CopyToClipboard text={window.location.href}>
            <span><FontAwesomeIcon icon={faCopy} title="Copy" /> Copy URL</span>
          </CopyToClipboard>
        </Dropdown.Item>
        <Dropdown.Item href={emailShareUrl} target="_blank"><FontAwesomeIcon icon={faEnvelope} title="Email" /> Email</Dropdown.Item>
        <Dropdown.Item href={twitterShareUrl} target="_blank"><FontAwesomeIcon icon={faTwitter} title="Twitter" /> Twitter</Dropdown.Item>
        <Dropdown.Item href={facebookShareUrl} target="_blank"><FontAwesomeIcon icon={faFacebook} title="Facebook" /> Facebook</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default ShareButton
