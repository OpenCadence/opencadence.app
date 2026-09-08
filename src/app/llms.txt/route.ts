import { site } from "@/lib/site";
import { faqs } from "@/lib/faq";

// Optional convenience for tools that choose to read it, not a crawler policy
// or a requirement for Google AI features. Keep facts shared with the HTML.
export const dynamic = "force-static";

export function GET() {
  const text = [
    `# ${site.name}`,
    "",
    `> ${faqs[0].answer}`,
    "",
    "## Official pages",
    `- [Product overview and frequently asked questions](${site.url}/): Features, installation requirements, privacy, and limitations.`,
    `- [Cloud status](${site.url}/cloud): Planned managed service. Not yet available; no announced pricing or launch date.`,
    "",
    "## Community source and documentation",
    `- [Community repository](${site.github})`,
    `- [Installation](${site.setup})`,
    `- [Self-hosting and security](${site.selfHosting})`,
    `- [MCP connection](${site.mcp})`,
    `- [License](${site.license})`,
    "",
    "## Product facts",
    ...faqs.flatMap((faq) => [`### ${faq.question}`, faq.answer, ""]),
    "## Examples",
    "The marketing site's workspace records are fictional. Its assistant conversation is illustrative, not a live integration or a customer testimonial.",
    "",
  ].join("\n");
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
