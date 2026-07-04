import { useState, useEffect } from 'react';
import { fetchSiteSettings } from '../services/api';
import { socialLinks as staticSocialLinks } from '../data/content';

// Static values shipped with the build; overridden by whatever the admin
// saved in Site Settings (Admin → Sistema → Configurações do Site).
const DEFAULTS = {
  contact: {
    institution: 'NIPE — Universidade Estadual de Campinas',
    address_line1: 'Rua Cora Coralina, 330',
    address_line2: 'Campinas - SP, Brasil, CEP 13083-896',
    phone: '+55 (19) 3521-1244',
    email: 'nipe@nipe.unicamp.br',
  },
  social: { ...staticSocialLinks },
  footer: {
    credits: 'Jornalista responsável Sofia Silva MTb 0077363/SP · Estagiário Antônio Bufalo · Estagiária Bárbara Castilho',
  },
};

const merge = (defaults, overrides) => {
  const out = { ...defaults };
  for (const [key, value] of Object.entries(overrides || {})) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      out[key] = { ...defaults[key], ...value };
    } else if (value !== undefined && value !== null && value !== '') {
      out[key] = value;
    }
  }
  return out;
};

/**
 * Site-wide settings with static fallbacks. Fetches once per session
 * (module-level cache lives in services/api).
 */
const useSiteSettings = () => {
  const [settings, setSettings] = useState(DEFAULTS);

  useEffect(() => {
    let mounted = true;
    fetchSiteSettings().then((remote) => {
      if (!mounted || !remote || Object.keys(remote).length === 0) return;
      setSettings({
        contact: merge(DEFAULTS.contact, remote.contact),
        social: merge(DEFAULTS.social, remote.social),
        footer: merge(DEFAULTS.footer, remote.footer),
      });
    });
    return () => { mounted = false; };
  }, []);

  return settings;
};

export default useSiteSettings;
export { DEFAULTS as siteSettingsDefaults };
