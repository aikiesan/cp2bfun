import { Helmet } from 'react-helmet-async';

const DOMAIN = 'https://cp2b.unicamp.br';
const DEFAULT_IMAGE = `${DOMAIN}/assets/CP2B-LOGO-COLOR-DEGRADE@8x.png`;
const SITE_NAME = 'CP2b';

const SeoHead = ({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  jsonLd = null,
  language = 'pt',
  noIndex = false,
}) => {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} - Centro Paulista de Estudos em Biogás e Bioprodutos`;
  const canonical = `${DOMAIN}${path}`;
  const ogImage = image
    ? (image.startsWith('http') ? image : `${DOMAIN}${image}`)
    : DEFAULT_IMAGE;

  return (
    <Helmet>
      <html lang={language === 'en' ? 'en' : 'pt-br'} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow" />
      }
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="pt-BR" href={canonical} />
      <link rel="alternate" hrefLang="en" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SeoHead;
