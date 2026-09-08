import { socialImage } from "@/lib/social-image";

export const alt = "OpenCadence Cloud: managed hosting, coming soon";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return socialImage(true);
}
