# SEO and AI-discovery readiness audit

Audited: 2026-09-07

## Verdict

**The local production build has a solid technical foundation for search and AI retrieval. Public launch is still blocked by domain and repository availability.** Indexing, rankings, AI inclusion, and citations are not guaranteed and have not been verified.

Scope: source review, the local production build, HTTP/browser regressions, social-image visual inspection, and unauthenticated checks of the configured public domain and repository. No Search Console, Bing Webmaster Tools, production hosting, CDN, or analytics account was accessed or modified.

## Launch blockers

| Priority | Finding                                                         | Evidence                                                                                                                                                               | Required action                                                                                                                                                                                                               |
| -------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Critical | The canonical domain was not reachable from the audit browser.  | Opening `https://opencadence.app` returned `net::ERR_NAME_NOT_RESOLVED`.                                                                                               | Configure DNS, deploy the site, and verify a publicly accessible HTTPS response. Retest from outside your network.                                                                                                            |
| Critical | The configured Community repository is not publicly accessible. | An unauthenticated visit to `https://github.com/OpenCadence/opencadence` showed GitHub’s “Page not found” page. The sibling app’s Git origin still points to this URL. | Publish the intended repository or correct `src/lib/site.ts`. Check its default branch, README, installation anchor, MCP guide, self-hosting guide, and license. This affects the primary CTAs as well as source credibility. |
| High     | Production crawlability and ownership are unverified.           | Only the local server was tested.                                                                                                                                      | Verify Search Console and Bing ownership, submit the sitemap, and inspect the deployed HTML and response headers.                                                                                                             |

A private repository, an unpublished repository, and an incorrect URL can all produce GitHub’s public not-found page. This audit did not attempt authenticated access or change repository visibility.

## Findings and changes

| Area                                | Before                                                                                  | Current state                                                                                                                                                                                                                                                                            |
| ----------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Search titles                       | Homepage slogan did not identify the product category.                                  | Descriptive homepage title: “OpenCadence \| Open-source workspace for freelancers”. Cloud identifies managed hosting and pre-launch status.                                                                                                                                              |
| Social metadata                     | Cloud inherited the homepage’s Open Graph/Twitter copy; there was no explicit `og:url`. | Each page defines its own title, description, canonical URL, Open Graph URL, and Twitter metadata through `pageMetadata()`.                                                                                                                                                              |
| Social images                       | A square app icon was the only sharing image.                                           | Separate branded, server-generated 1200×630 PNGs for home and Cloud. Both visually reviewed; no external font or image requests.                                                                                                                                                         |
| Product definition                  | Important facts were available, but the hero did not explicitly define OpenCadence.     | Hero names the product, category, audience, and local storage. The first FAQ answer is a concise definition.                                                                                                                                                                             |
| Direct answers                      | FAQs were embedded JSX with no shared machine-readable source.                          | A shared factual FAQ source powers visible HTML, structured data, and the optional text summary. Installation requirements and the full name “Model Context Protocol” are included.                                                                                                      |
| Structured data                     | None.                                                                                   | Organization, WebSite, SoftwareApplication, WebPage/FAQPage, and Cloud breadcrumb data are rendered in initial HTML with stable entity IDs.                                                                                                                                              |
| Truthfulness                        | Fictional preview records and planned Cloud capabilities were labelled.                 | Those labels remain. The two example containers also use Google’s `data-nosnippet` control to keep fictional records out of Google snippets. This is not a universal AI exclusion mechanism. No fabricated reviews, ratings, customer claims, dates, Cloud offers, or prices were added. |
| Search preview permissions          | Browser defaults.                                                                       | Explicit indexing/following plus large Google image previews and unrestricted snippet/video length on public pages.                                                                                                                                                                      |
| Crawl controls                      | A wildcard allow rule and sitemap already existed.                                      | Preserved. Local tests confirm public HTML for Googlebot, bingbot, OAI-SearchBot, Claude-SearchBot, and PerplexityBot. No bot-specific cloaking.                                                                                                                                         |
| JavaScript dependence               | Prerendered Next.js pages.                                                              | Preserved. Main product copy, FAQ answers, links, and JSON-LD are in the initial response. The decorative WebGL canvas is not the content source.                                                                                                                                        |
| Ownership verification              | No integration.                                                                         | Optional real Google/Bing verification tokens are supported through `.env.example`. No tokens were invented and no ownership verification has been completed.                                                                                                                            |
| AI-readable summary                 | None.                                                                                   | `/llms.txt` is a small optional summary using the same FAQ facts. It is not an access-control mechanism or a Google ranking requirement.                                                                                                                                                 |
| Error handling                      | Default Next.js not-found handling.                                                     | Tested: unknown URLs return an actual 404 with a noindex directive.                                                                                                                                                                                                                      |
| Accessibility and responsive layout | Existing regression coverage.                                                           | All coverage still passes, including 320–1280px layouts, keyboard navigation, enlarged fonts, and axe WCAG A/AA checks.                                                                                                                                                                  |

## What “AEO / AI visibility” means here

The useful foundations are the same as SEO: accessible pages, clear product facts, stable URLs, consistent entities, useful answers, credible public sources, and a fast, usable site. These changes do not introduce hidden keyword blocks, bot-only content, fake reviews, or unsupported product claims.

### Google AI features

Google’s official guidance says there are **no additional technical requirements or special schema types** for AI Overviews or AI Mode. A supporting page needs to be indexed and eligible to show a snippet. Google also explicitly says new AI text files are not required.

Google’s current documentation update states that **FAQ rich results are no longer shown in Google Search**. The FAQ schema retained here describes the visible questions and answers; it is not a promise of a FAQ search enhancement. SoftwareApplication markup also does not automatically qualify this site for an application rich result. Do not invent ratings, reviews, or offers to satisfy eligibility rules.

### Search retrieval versus model training

OpenAI documents `OAI-SearchBot` as its search crawler and `GPTBot` as its model-training crawler. These are separate controls. `ChatGPT-User` represents user-triggered access and is not the control for search inclusion.

The existing `User-Agent: * / Allow: /` policy was preserved. It does not specifically opt out of training crawlers. Decide any future training policy separately from search visibility, and verify that hosting/CDN settings do not override your intended retrieval access. Bots that ignore robots.txt remain outside its control; robots.txt is not authentication.

### llms.txt

The file is optional and generated from shared facts to avoid conflicting descriptions. Google’s current documentation explicitly says llms.txt does not positively or negatively affect Google visibility or rankings. Other systems may choose to consume it; broad adoption and citation benefits were not verified. It does not replace HTML, robots.txt, a sitemap, or indexing.

## Verification evidence

`pnpm check` passed on the production build: formatting, TypeScript, build, and **30 Playwright tests**.

New SEO regressions verify:

- One canonical and one H1 per public page.
- Page-specific titles, descriptions, `og:url`, image URLs, and Twitter large-image cards.
- Indexing/snippet metadata and document language.
- JSON-LD present in the initial HTML and parseable as JSON.
- FAQ schema answers matching the visible answers exactly.
- Cloud schema does not invent a purchasable application or rating.
- Both social images return actual PNG bytes with 1200×630 dimensions.
- Product and installation facts present in HTML requested with search-bot user agents.
- Wildcard crawler access on the local server.
- Plain-text summary facts matching the shared FAQ source.
- Real 404 handling for unknown URLs.

Existing tests cover static rendering without JavaScript, WebGL failure/recovery, reduced motion, offscreen suspension, accessibility, navigation, and responsive reflow.

The image routes are prerendered. Next’s output traces include the local Manrope font and logo required to generate them. No Lighthouse score, production Core Web Vitals score, external structured-data validator result, or indexing status is claimed.

## Production checklist

### Before launch

1. Publish DNS and a working HTTPS deployment for `https://opencadence.app`.
2. Make the correct Community source and documentation publicly readable, then retest every outbound CTA anonymously.
3. Redirect HTTP and the alternate `www` hostname to the preferred HTTPS, non-`www` URL at the hosting layer. Avoid competing canonical domains.
4. Keep preview/staging deployments noindexed or access-controlled. Confirm production has no platform-injected `X-Robots-Tag: noindex`, password wall, or bot challenge.
5. Fetch `/`, `/cloud`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and both social-image URLs anonymously from outside the hosting network. Public HTML pages should return 200; missing pages should return 404.
6. Check the CDN/WAF against the intended search-crawler policy. Follow providers’ current verified IP/identity guidance rather than trusting arbitrary user-agent strings.
7. Create the real Google Search Console and Bing Webmaster Tools properties. Add tokens from those services as deployment environment variables if using HTML verification, rebuild, and complete verification. DNS verification is another option.
8. Submit `https://opencadence.app/sitemap.xml`. Use URL Inspection to check rendered HTML, selected canonical, robots permissions, and indexing eligibility for both pages.
9. Run Schema.org Validator and Google’s Rich Results Test against the public URLs. Distinguish valid semantic markup from eligibility for an actual Google enhancement.
10. Inspect the public share previews and run mobile/desktop PageSpeed Insights. The local automated suite is not a substitute for production performance measurement.

### After launch

- Establish a baseline in Search Console and Bing Webmaster Tools: indexed pages, queries, impressions, clicks, and crawl errors. Google AI-feature traffic is included in overall Search reporting; do not claim a precise AI Overviews attribution from that alone.
- Monitor real Core Web Vitals when sufficient field data exists. Targets at the 75th percentile: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. Check the hero on lower-powered hardware as well as desktop.
- Review referral logs for actual visits from AI/search products, while recognizing that referrers and citations are incomplete signals. No analytics vendor or tracking script was added by this audit.
- Keep the public README, site, license, installation instructions, and release notes consistent. Public documentation and independently earned references are more useful than synthetic “AI authority” pages.
- Publish substantive on-domain guides when useful: local installation, backup/restore, MCP setup, and the differences between Community and Cloud. Do not mass-produce thin keyword variants.
- Update visible copy and shared schema when Cloud availability actually changes. Retain the distinction between local Community functionality and planned connected services.
- When Clerk is integrated, keep account/auth routes out of the sitemap, apply noindex where appropriate, and use actual access controls. Review privacy/legal disclosures when collecting personal data.

## Files to maintain

- `src/lib/site.ts`: canonical domain, descriptions, page titles, repository and documentation URLs.
- `src/lib/faq.ts`: shared factual answers and stable question IDs.
- `src/lib/seo.ts`: page metadata and entity graph.
- `src/components/structured-data.tsx`: escaped JSON-LD serialization.
- `src/lib/social-image.tsx`: branded share-card rendering.
- `src/app/opengraph-image.tsx` and `src/app/cloud/opengraph-image.tsx`: page-specific social assets.
- `src/app/llms.txt/route.ts`: optional machine-readable summary.
- `src/app/layout.tsx`: default robots/snippet settings and verification tokens.
- `tests/seo.spec.ts`: SEO/AEO regression checks.

## Official references checked

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: search documentation updates, including FAQ rich-result removal and llms.txt clarification](https://developers.google.com/search/updates#removing-faq-rich-result)
- [OpenAI: Overview of OpenAI crawlers](https://developers.openai.com/api/docs/bots)

These references describe platform behaviour, not a guarantee that OpenCadence will be indexed, ranked, or cited.
