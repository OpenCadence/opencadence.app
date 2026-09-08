import type { Metadata } from "next";
import { site } from "@/lib/site";
import { faqs } from "@/lib/faq";

export function pageMetadata(
  path: "/" | "/cloud",
  title: string,
  description: string,
): Metadata {
  const url = path === "/" ? site.url : `${site.url}${path}`;
  const images = [
    {
      url: `${path === "/" ? "" : path}/opengraph-image`,
      width: 1200,
      height: 630,
      alt:
        path === "/"
          ? "OpenCadence: open-source workspace for freelancers"
          : "OpenCadence Cloud: managed hosting, coming soon",
    },
  ];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: site.name,
      title,
      description,
      url,
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

const organizationId = `${site.url}/#organization`;
const websiteId = `${site.url}/#website`;
const applicationId = `${site.url}/#community-application`;

export const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "Open Cadence",
      alternateName: "OpenCadence",
      url: site.url,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/brand/icon-512.png`,
        width: 512,
        height: 512,
      },
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: site.url,
      name: site.name,
      inLanguage: "en",
      publisher: { "@id": organizationId },
    },
    {
      "@type": "SoftwareApplication",
      "@id": applicationId,
      name: "OpenCadence Community",
      alternateName: "OpenCadence",
      url: `${site.url}/#community`,
      description: faqs[0].answer,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Project and client management for freelancers",
      softwareRequirements: "Node.js 22.13 or newer",
      isAccessibleForFree: true,
      license: "https://www.gnu.org/licenses/agpl-3.0.html",
      featureList: [
        "Project management",
        "Tasks and due dates",
        "Plain-text notes",
        "Client relationships and follow-ups",
        "Local SQLite storage",
        "Optional Model Context Protocol (MCP) server",
      ],
      publisher: { "@id": organizationId },
    },
    {
      "@type": ["WebPage", "FAQPage"],
      "@id": `${site.url}/#webpage`,
      url: site.url,
      name: site.title,
      description: site.description,
      inLanguage: "en",
      isPartOf: { "@id": websiteId },
      about: { "@id": applicationId },
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        "@id": `${site.url}/#${faq.id}`,
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
};

// Cloud is not yet a purchasable application. Do not imply availability,
// publish a price, or invent reviews just to qualify for a rich result.
export const cloudStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${site.url}/cloud#webpage`,
      url: `${site.url}/cloud`,
      name: site.cloudTitle,
      description: site.cloudDescription,
      inLanguage: "en",
      isPartOf: { "@id": websiteId },
      breadcrumb: { "@id": `${site.url}/cloud#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${site.url}/cloud#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "OpenCadence",
          item: site.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Cloud",
          item: `${site.url}/cloud`,
        },
      ],
    },
  ],
};
