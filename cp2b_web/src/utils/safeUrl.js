// Links que vêm do painel (banco) antes de irem para um href. O React 18 ainda
// renderiza "javascript:..." (só avisa no console), então um link gravado
// assim viraria script ao clicar. Passam http(s), mailto, tel e caminhos do
// próprio site; um endereço sem esquema ("www.exemplo.org") ganha https://.
const SAFE = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i;
const BARE_DOMAIN = /^(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/|$)/i;

export const safeHref = (url) => {
  const value = String(url ?? '').trim();
  if (!value) return undefined;
  if (SAFE.test(value)) return value;
  if (BARE_DOMAIN.test(value)) return `https://${value}`;
  return undefined;
};
