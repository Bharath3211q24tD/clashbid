import type { SVGProps } from "react";
import {
  CricketBall,
  Football,
  Mask,
} from "@/components/ui/icons";
import type { EntityCategoryId } from "@/types";

export type IconComponent = (props: SVGProps<SVGSVGElement>) => React.ReactNode;

export const CATEGORY_ICONS: Record<EntityCategoryId, IconComponent> = {
  fictional: Mask,
  football: Football,
  cricket: CricketBall,
};

export { CricketBall, Football, Mask };
