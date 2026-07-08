import { type VariantProps } from "class-variance-authority";
import { badgeVariants } from "./component";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}
