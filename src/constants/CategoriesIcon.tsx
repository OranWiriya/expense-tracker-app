import {
  AsteriskIcon,
  BeefIcon,
  DiscAlbumIcon,
  GiftIcon,
  ShirtIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/generated/prisma/enums";

export const CATEGORIES = {
  food: { label: "Food", icon: BeefIcon, color: "text-orange-500" },
  entertainment: {
    label: "Entertainment",
    icon: DiscAlbumIcon,
    color: "text-pink-500",
  },
  clothing: { label: "Clothing", icon: ShirtIcon, color: "text-blue-500" },
  salary: { label: "Salary", icon: WalletIcon, color: "text-lime-500" },
  gift: { label: "Gift", icon: GiftIcon, color: "text-lime-500" },
  etc: { label: "Etc", icon: AsteriskIcon, color: "text-gray-500" },
} as const satisfies Record<
  Category,
  { label: string; icon: LucideIcon; color: string }
>;

export const isCategory = (value: unknown): value is Category =>
  typeof value === "string" && value in CATEGORIES;

export const CategoryIcon = ({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) => {
  const { icon: Icon, color } = CATEGORIES[category];
  return <Icon className={cn(color, className)} />;
};
