import { Helmet } from 'react-helmet-async';

const DOMAIN = 'https://cp2b.unicamp.br';
const DEFAULT_IMAGE = `${DOMAIN}/assets/logos/cp2b-logo-og.png`;
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
  // Normalize the trailing slash so /forum-paulista/ and /forum-paulista emit the
  // same canonical. Google had indexed both forms and reported "duplicate without
  // user-selected canonical"; the no-slash form is what the prerenderer writes.
  const normalizedPath = path.length > 1 ? path.replace(/\/+$/, '') : '/';
  const canonical = `${DOMAIN}${normalizedPath}`;
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

      <meta property="og:type" content={type} />
      <meta property="og:locale" content={language === 'en' ? 'en_US' : 'pt_BR'} />
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
