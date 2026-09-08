import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Infinity,
  Code2,
  Server,
  Unplug,
  Users,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site } from "@/lib/site";

import { cloudStructuredData, pageMetadata } from "@/lib/seo";
import { StructuredData } from "@/components/structured-data";

export const metadata = pageMetadata(
  "/cloud",
  site.cloudTitle,
  site.cloudDescription,
);

export default function CloudPage() {
  return (
    <>
      <StructuredData data={cloudStructuredData} />
      <Header />
      <main id="main" className="cloud-page container">
        <Link href="/" className="back-link">
          <ArrowLeft size={15} /> Back to OpenCadence
        </Link>
        <section className="cloud-hero">
          <span className="cloud-hero-icon">
            <Infinity size={36} strokeWidth={1.4} />
          </span>
          <h1>
            Your work.
            <br />
            <span>Without the setup.</span>
          </h1>
          <p>
            OpenCadence Cloud is a planned managed hosting service for
            OpenCadence.
          </p>
          <div className="cloud-status">
            <h2>Cloud is in development.</h2>
            <p>
              Managed hosting and connected services are planned, but Cloud
              isn’t available yet. We haven’t announced a launch date, pricing,
              or a final feature set.
            </p>
            <p>
              Registration and sign-in will open when the service is ready. For
              now, you can get started with the complete Community app.
            </p>
            <a href={site.setup} className="button button-primary">
              Start with Community <ArrowUpRight size={16} />
            </a>
          </div>
        </section>
        <section
          className="cloud-directions"
          aria-labelledby="cloud-directions-title"
        >
          <h2 id="cloud-directions-title">Planned services</h2>
          <div className="cloud-direction-grid">
            {[
              {
                icon: Server,
                title: "Managed hosting",
                text: "Infrastructure and ongoing operations, handled for you.",
              },
              {
                icon: Unplug,
                title: "Connected services",
                text: "Integrations that help your workspace fit into your day.",
              },
              {
                icon: Users,
                title: "More ways to work",
                text: "Exploring sync, collaboration, and ongoing support.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <article key={title}>
                <Icon size={23} strokeWidth={1.5} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <div className="cloud-promise">
          <div>
            <h2>Community stays free and open source.</h2>
            <p>
              All core workspace features are included in Community. Cloud will
              offer managed hosting and connected services for people who prefer
              not to run the app themselves.
            </p>
            <a href={site.github} className="text-link">
              <Code2 size={16} /> Explore the Community edition{" "}
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
