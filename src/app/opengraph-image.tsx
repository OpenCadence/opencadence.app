import { socialImage } from "@/lib/social-image";

export const alt = "OpenCadence: open-source workspace for freelancers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return socialImage();
}
