import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';

const SEO = ({
  title,
  description,
  keywords,
  image = '/assets/CP2B-LOGO-COLOR-DEGRADE@8x.png',
  url,
  type = 'website',
  article = null,
  breadcrumbs = null,
  noindex = false
}) => {
  const { language } = useLanguage();

  const defaultTitle = language === 'pt'
    ? 'CP2B - Centro Paulista de Estudos em Biogás e Bioprodutos'
    : 'CP2B - São Paulo Center for Biogas and Bioproducts Studies';

  const defaultDescription = language === 'pt'
    ? 'Centro de pesquisa financiado pela FAPESP, sediado no NIPE/UNICAMP, dedicado a desenvolver soluções inovadoras para a cadeia do biogás no Estado de São Paulo.'
    : 'Research center funded by FAPESP, headquartered at NIPE/UNICAMP, dedicated to developing innovative solutions for the biogas chain in the State of São Paulo.';

  const defaultKeywords = language === 'pt'
    ? 'biogás, bioprodutos, energia renovável, pesquisa, FAPESP, UNICAMP, sustentabilidade, São Paulo'
    : 'biogas, bioproducts, renewable energy, research, FAPESP, UNICAMP, sustainability, São Paulo, Brazil';

  const siteUrl = 'https://cp2b.nipe.unicamp.br';

  const seo = {
    title: title ? `${title} | CP2B` : defaultTitle,
    description: description || defaultDescription,
    keywords: keywords || defaultKeywords,
    image: image.startsWith('http') ? image : `${siteUrl}${image}`,
    url: url ? `${siteUrl}${url}` : siteUrl
  };

  const breadcrumbJsonLd = breadcrumbs ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': crumb.name,
      'item': crumb.url.startsWith('http') ? crumb.url : `${siteUrl}${crumb.url}`
    }))
  } : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seo.title}</title>
      <meta name="title" content={seo.title} />
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <link rel="canonical" href={seo.url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Language */}
      <html lang={language === 'pt' ? 'pt-BR' : 'en'} />

      {/* hreflang alternates */}
      <link rel="alternate" hreflang="pt-BR" href={seo.url} />
      <link rel="alternate" hreflang="en" href={seo.url} />
      <link rel="alternate" hreflang="x-default" href={seo.url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:locale" content={language === 'pt' ? 'pt_BR' : 'en_US'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      {/* Article specific (for news/blog posts) */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:author" content={article.author} />
          {article.tags?.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* BreadcrumbList JSON-LD */}
      {breadcrumbJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
