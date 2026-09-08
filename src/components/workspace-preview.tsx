import Image from "next/image";

export function WorkspacePreview() {
  return (
    <div className="preview-wrap" data-nosnippet="">
      <div className="preview-window">
        <div className="window-bar" aria-hidden="true">
          <div className="window-dots">
            <i />
            <i />
            <i />
          </div>
          <span>
            <span className="status-dot" /> Your workspace. Your space.
          </span>
          <span className="preview-label">APP SCREENSHOT</span>
        </div>
        <Image
          className="workspace-screenshot"
          src="/images/opencadence-workspace.webp"
          unoptimized
          alt="OpenCadence Today dashboard showing tasks, active projects, and client follow-ups, with sidebar navigation for tasks, projects, customers, and notes."
          width={3200}
          height={2000}
          sizes="(max-width: 1048px) calc(100vw - 40px), 1008px"
          priority
        />
      </div>
    </div>
  );
}
