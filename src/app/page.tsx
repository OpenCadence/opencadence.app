import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Infinity,
  Code2,
  FolderOpen,
  Laptop,
  ListTodo,
  LockKeyhole,
  MessageSquare,
  Plus,
  Sparkles,
  StickyNote,
  Terminal,
  Users,
} from "lucide-react";
import { Header } from "@/components/header";
import { HeroBackground } from "@/components/hero-background";
import { GitHubLogo } from "@/components/github-logo";
import { Footer } from "@/components/footer";
import { WorkspacePreview } from "@/components/workspace-preview";
import { site } from "@/lib/site";
import { faqs } from "@/lib/faq";
import { homeStructuredData, pageMetadata } from "@/lib/seo";
import { StructuredData } from "@/components/structured-data";

export const metadata = pageMetadata("/", site.title, site.description);
const features = [
  {
    icon: ListTodo,
    title: "Today",
    text: "See your due tasks, client follow-ups, and active projects in one place.",
  },
  {
    icon: FolderOpen,
    title: "Projects",
    text: "Organize tasks and notes by project, set target dates, and track progress.",
  },
  {
    icon: Users,
    title: "Client relationships",
    text: "Manage leads and clients with linked projects, conversation history, and follow-up dates.",
  },
  {
    icon: StickyNote,
    title: "Notes",
    text: "Save meeting notes and ideas. Link them to projects or clients, and search them when you need them.",
  },
];

export default function Home() {
  return (
    <>
      <StructuredData data={homeStructuredData} />
      <Header />
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <HeroBackground />
          <div className="container hero-content">
            <h1 id="hero-title">
              Find your flow.
              <br />
              <span>Own your work.</span>
            </h1>
            <p className="hero-description">
              OpenCadence is an open-source workspace for freelancers.
              <br className="desktop-break" /> Projects, tasks, notes, and
              clients, stored locally.
            </p>
            <div className="hero-actions">
              <a href={site.setup} className="button button-primary">
                Get OpenCadence <ArrowUpRight size={17} />
              </a>
              <a href="#workspace" className="button button-secondary">
                Meet your workspace <ArrowDown size={16} />
              </a>
            </div>
            <p className="hero-note">
              <span>
                <Check size={13} /> Free & open source
              </span>
              <span>
                <Check size={13} /> Local-first
              </span>
              <span>
                <Check size={13} /> No account needed
              </span>
            </p>
            <WorkspacePreview />
          </div>
        </section>

        <section
          className="values-strip container"
          aria-label="Built for independent work"
        >
          <span>
            <Laptop size={19} /> Runs on your machine
          </span>
          <span>
            <LockKeyhole size={19} /> Locally stored data
          </span>
          <span>
            <Code2 size={20} /> Open source
          </span>
        </section>

        <section
          className="section container"
          id="workspace"
          aria-labelledby="workspace-title"
        >
          <div className="section-heading">
            <h2 id="workspace-title">Your day-to-day work, together.</h2>
          </div>
          <div className="feature-grid">
            {features.map(({ icon: Icon, title, text }, index) => (
              <article className="feature" key={title}>
                <div className="feature-top">
                  <span className="feature-icon">
                    <Icon size={23} strokeWidth={1.5} />
                  </span>
                  <span className="feature-number">0{index + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="assistant-section container"
          aria-labelledby="assistant-title"
        >
          <div className="assistant-copy">
            <h2 id="assistant-title">
              Your workspace.
              <br />
              Meet your AI assistant.
            </h2>
            <p>
              Plan your day, capture an idea, or catch up on a client. Connect
              your preferred MCP-compatible assistant to the same workspace you
              use every day.
            </p>
            <a className="text-link" href={site.mcp}>
              Explore the MCP connection <ArrowUpRight size={16} />
            </a>
            <span className="assistant-footnote">
              Optional. You choose the client and model.
            </span>
          </div>
          <div className="assistant-demo" data-nosnippet="">
            <div className="assistant-demo-top">
              <span>
                <MessageSquare size={15} /> Example conversation
              </span>
              <span className="example-badge">MCP</span>
            </div>
            <div className="chat-user">
              <span className="chat-label">You</span>What should I focus on
              today?
            </div>
            <div className="chat-answer">
              <span className="assistant-avatar">
                <Sparkles size={17} />
              </span>
              <div>
                <span className="chat-label">Your assistant</span>
                <p>Let’s give today a little focus.</p>
                <ol className="chat-priorities">
                  <li>
                    <span className="chat-priority-number">01</span>
                    <div>
                      <strong>Send Emma the brand direction</strong>
                      <small>Studio North · Start here</small>
                    </div>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </li>
                  <li>
                    <span className="chat-priority-number">02</span>
                    <div>
                      <strong>Refine the homepage wireframes</strong>
                      <small>Forma website · Creative work</small>
                    </div>
                  </li>
                  <li>
                    <span className="chat-priority-number">03</span>
                    <div>
                      <strong>Check in with Sam</strong>
                      <small>Proposal · Client follow-up</small>
                    </div>
                  </li>
                </ol>
                <p className="chat-summary">
                  Start with Emma, then make room for focused design time.
                </p>
              </div>
            </div>
            <div className="mcp-connection">
              <LockKeyhole size={13} aria-hidden="true" />
              Your assistant. Your local workspace.
              <span className="mcp-demo-note">Illustrative example</span>
            </div>
          </div>
        </section>

        <section
          className="section container editions-section"
          id="community"
          aria-labelledby="editions-title"
        >
          <div className="section-heading centered">
            <h2 id="editions-title">Community and Cloud.</h2>
            <p>
              Run OpenCadence locally, or choose managed hosting when Cloud
              launches.
            </p>
          </div>
          <div className="edition-grid">
            <article className="edition community-edition">
              <div className="edition-top">
                <span className="edition-icon">
                  <Code2 size={25} />
                </span>
                <span className="availability">
                  <span className="status-dot" /> AVAILABLE NOW
                </span>
              </div>
              <h3>Community</h3>
              <p className="edition-intro">
                The complete local app. Free and open source.
              </p>
              <div className="edition-price">
                Free<span>No subscription required.</span>
              </div>
              <ul className="check-list">
                <li>
                  <Check size={16} /> All core workspace features
                </li>
                <li>
                  <Check size={16} /> Local storage. No cloud account.
                </li>
                <li>
                  <Check size={16} /> Optional MCP connection for AI assistants
                </li>
                <li>
                  <Check size={16} /> Inspect, modify, and share under AGPL-3.0
                </li>
              </ul>
              <a className="button button-primary" href={site.setup}>
                Get started with Community <ArrowUpRight size={16} />
              </a>
              <a className="edition-bottom-link" href={site.github}>
                <GitHubLogo size={15} /> Explore the source on GitHub{" "}
                <ArrowUpRight size={13} />
              </a>
            </article>
            <article className="edition cloud-edition">
              <div className="edition-top">
                <span className="edition-icon">
                  <Infinity size={26} />
                </span>
                <span className="coming-soon">IN THE WORKS</span>
              </div>
              <h3>Cloud</h3>
              <p className="edition-intro">
                Managed hosting and connected services. Currently in
                development.
              </p>
              <div className="edition-price">
                Coming soon<span>Launch date and pricing to be announced.</span>
              </div>
              <div className="cloud-plan">
                <ul className="check-list">
                  <li>
                    <Plus size={16} /> Managed hosting and infrastructure
                  </li>
                  <li>
                    <Plus size={16} /> Connected services and integrations
                  </li>
                  <li>
                    <Plus size={16} /> Sync and collaboration
                  </li>
                  <li>
                    <Plus size={16} /> Ongoing operations and support
                  </li>
                </ul>
              </div>
              <Link className="button button-secondary" href="/cloud">
                Meet OpenCadence Cloud <ArrowRight size={16} />
              </Link>
              <p className="edition-bottom-link">
                Coming soon. No launch date or pricing just yet.
              </p>
            </article>
          </div>
          <p className="open-promise">
            All core features are included in Community. Cloud will offer
            managed hosting and connected services.
          </p>
        </section>

        <section className="faq-section container" aria-labelledby="faq-title">
          <div>
            <h2 id="faq-title">Common questions.</h2>
            <a href={site.docs} className="text-link">
              Read the documentation <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.id} id={faq.id}>
                <summary>
                  {faq.question}
                  <Plus size={18} />
                </summary>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                  {"link" in faq && (
                    <a href={faq.link.href}>{faq.link.label}</a>
                  )}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="closing-section container">
          <div className="closing-symbol" aria-hidden="true">
            <img
              src="/brand/logo-horizontal-primary.svg"
              alt=""
              width="232"
              height="61"
            />
          </div>
          <h2>Get started with OpenCadence.</h2>
          <p>Run the Community app on your own machine.</p>
          <a className="button button-primary" href={site.setup}>
            Find your cadence <ArrowUpRight size={17} />
          </a>
          <span className="closing-note">
            <Terminal size={13} /> Runs locally · Free & open source
          </span>
        </section>
      </main>
      <Footer />
    </>
  );
}
