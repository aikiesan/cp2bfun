import React, { useState } from 'react';
import { FaWhatsapp, FaLinkedin, FaTwitter, FaFacebook, FaLink, FaCheck } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const SocialShare = ({ url, title, description, compact = false }) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;
  const shareDescription = description || '';

  const labels = {
    pt: {
      share: 'Compartilhar',
      copied: 'Link copiado!'
    },
    en: {
      share: 'Share',
      copied: 'Link copied!'
    }
  }[language];

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: '#25D366',
      url: `https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n${shareUrl}`)}`
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      color: '#0A66C2',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const buttonStyle = compact ? {
    width: '36px',
    height: '36px',
    padding: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  } : {
    width: '40px',
    height: '40px',
    padding: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div className={`d-flex align-items-center gap-2 ${compact ? '' : 'flex-wrap'}`}>
      {!compact && (
        <span className="text-muted small me-1">{labels.share}:</span>
      )}

      {shareLinks.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-dark rounded-circle"
          style={buttonStyle}
          title={link.name}
          aria-label={`${labels.share} ${link.name}`}
        >
          <link.icon size={compact ? 14 : 16} />
        </a>
      ))}

      <button
        onClick={copyToClipboard}
        className={`btn ${copied ? 'btn-success' : 'btn-outline-dark'} rounded-circle`}
        style={buttonStyle}
        title={copied ? labels.copied : 'Copy link'}
        aria-label="Copy link"
      >
        {copied ? <FaCheck size={compact ? 12 : 14} /> : <FaLink size={compact ? 12 : 14} />}
      </button>
    </div>
  );
};

export default SocialShare;
