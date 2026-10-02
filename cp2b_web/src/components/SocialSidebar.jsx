import { FaSpotify, FaLinkedinIn, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { socialLinks } from '../data/content';
import { motion } from 'framer-motion';

const SocialSidebar = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;
  const socials = [
    { icon: FaSpotify, url: socialLinks.spotify, label: 'Spotify', color: '#1DB954' },
    { icon: FaLinkedinIn, url: socialLinks.linkedin, label: 'LinkedIn', color: '#0A66C2' },
    { icon: FaInstagram, url: socialLinks.instagram, label: 'Instagram', color: '#E4405F' },
    { icon: FaYoutube, url: socialLinks.youtube, label: 'YouTube', color: '#FF0000' },
    { icon: FaWhatsapp, url: socialLinks.whatsapp, label: 'WhatsApp', color: '#25D366' }
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="social-sidebar d-none d-lg-flex"
    >
      {socials.map((social, idx) => {
        const Icon = social.icon;
        // Skip if URL is placeholder
        if (social.url === '#') return null;

        return (
          <motion.a
            key={idx}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="social-sidebar-item"
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            style={{ '--social-color': social.color }}
          >
            <Icon />
          </motion.a>
        );
      })}
    </motion.div>
  );
};

export default SocialSidebar;
