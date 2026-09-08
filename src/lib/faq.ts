import { site } from "@/lib/site";

// One source for the visible answers, JSON-LD, and optional machine-readable summary.
export const faqs = [
  {
    id: "what-is-opencadence",
    question: "What is OpenCadence?",
    answer:
      "OpenCadence is a free, open-source, local-first workspace for freelancers and independent workers. It combines projects, tasks, plain-text notes, and client relationship management in a single-user app that runs on your machine.",
  },
  {
    id: "community-price",
    question: "Is the Community edition really free?",
    answer:
      "Yes. OpenCadence Community is free and open source under the GNU AGPL v3.0. All core workspace features are included. No subscription is required.",
  },
  {
    id: "install-opencadence",
    question: "How do I install OpenCadence Community?",
    answer:
      "Install Node.js 22.13 or newer, clone the Community repository, then run pnpm install followed by pnpm dev in the project directory. Open the local address printed in your terminal, normally http://127.0.0.1:3000. No cloud account or separate database service is required.",
    link: { href: site.setup, label: "Community installation instructions" },
  },
  {
    id: "data-and-privacy",
    question: "Where does my data live?",
    answer:
      "Community stores your workspace in a SQLite database on your machine. The app doesn’t require a cloud account and makes no runtime third-party requests. If you connect an AI assistant through MCP, the data you ask it to access is shared with your chosen AI client or model.",
  },
  {
    id: "self-hosting",
    question: "Can I run it on my own server?",
    answer:
      "Yes, with the right setup. The current app is single-user and has no built-in authentication. It’s designed for a trusted local machine; don’t expose it directly to the internet or your network. Remote deployment requires external authentication, authorization, TLS, and a reverse proxy.",
    link: { href: site.selfHosting, label: "Self-hosting and security guide" },
  },
  {
    id: "mcp-connection",
    question: "How does it work with AI assistants?",
    answer:
      "The optional local Model Context Protocol (MCP) server lets a compatible assistant work with your tasks, projects, clients, and notes in the same database. You choose the client and model, and can use read-only mode. An AI assistant is not required to use OpenCadence.",
    link: { href: site.mcp, label: "MCP connection guide" },
  },
  {
    id: "cloud-availability",
    question: "When will OpenCadence Cloud be available?",
    answer:
      "OpenCadence Cloud is in development, with no announced launch date or pricing. Managed hosting, synchronization, collaboration, integrations, and support are planned services, not current Community features. Community remains a complete, useful local app in its own right.",
  },
] as const;
