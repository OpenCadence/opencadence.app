import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer container">
      <div className="footer-main">
        <div className="footer-brand">
          <Link href="/" aria-label="OpenCadence home">
            <img
              src="/brand/logo-horizontal-primary.svg"
              alt="OpenCadence"
              width="182"
              height="48"
            />
          </Link>
          <p>
            A little structure for independent work.
            <br />
            Free, open source, and yours to keep.
          </p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <div>
            <h2>Workspace</h2>
            <a href={site.setup}>
              Get started <ArrowUpRight size={13} />
            </a>
            <a href={site.docs}>
              Documentation <ArrowUpRight size={13} />
            </a>
            <Link href="/cloud">OpenCadence Cloud</Link>
          </div>
          <div>
            <h2>Open source</h2>
            <a href={site.github}>
              GitHub <ArrowUpRight size={13} />
            </a>
            <a href={site.mcp}>
              MCP connection <ArrowUpRight size={13} />
            </a>
            <a href={site.license}>
              AGPL-3.0 license <ArrowUpRight size={13} />
            </a>
          </div>
        </nav>
      </div>
      <div className="footer-meta">
        <span>© {new Date().getFullYear()} OpenCadence</span>
      </div>
    </footer>
  );
}
