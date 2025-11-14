"use client"

import { usePathname } from "next/navigation"

import { Routes } from "@/lib/pageroutes"
import SubLink from "@/components/navigation/sublink"

export default function PageMenu({ isSheet = false }) {
  const pathname = usePathname()
  if (!pathname.startsWith("/docs")) return null

  return (
    <div className="mt-3 flex flex-col gap-2.5 pb-4 pr-2">
      {Routes.map((item, index) => {
        if ("spacer" in item) {
          return (
            <div key={`spacer-${index}`} className="my-2 pr-2">
              <hr className="border-t border-gray-300" />
            </div>
          )
        }
        return (
          <div key={item.title + index} className="mb-1.5">
            {item.heading && (
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {item.heading}
              </div>
            )}
            <SubLink
              {...{
                ...item,
                href: `/docs${item.href}`,
                level: 0,
                isSheet,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
