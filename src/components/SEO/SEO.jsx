import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title = 'NeighborlyUnion - Find Community Resources',
    description = 'Discover free community resources across the UK. Food banks, legal aid, housing support, mental health services and more. Connecting people with local help.',
    keywords = 'community resources, food bank, legal aid, housing support, UK charities, free help, local services',
    image = '/og-image.jpg', // Ensure you have a default image in public folder
    url = 'https://neighborlyunion.com', // Updated to match your domain
    type = 'website',
    structuredData = null
}) => {
    const siteTitle = title.includes('NeighborlyUnion') ? title : `${title} | NeighborlyUnion`;
    const currentUrl = typeof window !== 'undefined' ? window.location.href : url;

    // Default Structured Data if none provided
    const defaultStructuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "NeighborlyUnion",
        "url": "https://neighborlyunion.com",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://neighborlyunion.com/resources?search={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{siteTitle}</title>
            <meta name="title" content={siteTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={currentUrl} />
            <meta property="twitter:title" content={siteTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData || defaultStructuredData)}
            </script>

            {/* Canonical URL */}
            <link rel="canonical" href={currentUrl} />
        </Helmet>
    );
};

export default SEO;
