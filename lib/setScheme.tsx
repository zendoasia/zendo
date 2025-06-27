"use client";

import { ArticleSchemaProps, SchemaProps, FAQSchemaProps } from "@/types";

export function SetSchema({ title, description, url }: SchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${title} – Zendo`,
    url,
    inLanguage: "en",
    description,
    publisher: {
      "@type": "Organization",
      name: "Zendo",
      url: `https://${process.env.NEXT_PUBLIC_ORIGIN}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({ questions }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": q.type,
      name: q.name,
      acceptedAnswer: {
        "@type": q.acceptedAnswer.type,
        text: q.acceptedAnswer.text,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleSchema({
  headline,
  description,
  image,
  author,
  publisher,
  datePublished,
  dateModified,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image,
    author: {
      "@type": "Person",
      name: author.name,
    },
    publisher: {
      "@type": "Organization",
      name: publisher.name,
      logo: {
        "@type": "ImageObject",
        url: publisher.logoUrl,
      },
    },
    datePublished,
    dateModified,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Zendo",
    inLanguage: "en",
    url: `https://${process.env.NEXT_PUBLIC_ORIGIN}/`,
    logo: `https://${process.env.NEXT_PUBLIC_ORIGIN}/assets/icons/maskable-icon.png`,
    sameAs: [
      "https://x.com/zendoasia",
      "https://github.com/zendoasia",
      `https:/status.${process.env.NEXT_PUBLIC_ORIGIN}`,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SiteSearchSchema() {
  const origin = process.env.NEXT_PUBLIC_ORIGIN;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: `https://${origin}`,
    potentialAction: {
      "@type": "SearchAction",
      target: `https://${origin}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
