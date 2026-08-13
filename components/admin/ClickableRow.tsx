"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export default function ClickableRow({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();

  return (
    <tr
      className={className}
      onClick={() => router.push(href)}
      style={{ cursor: "pointer" }}
    >
      {children}
    </tr>
  );
}
