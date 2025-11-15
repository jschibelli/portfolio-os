"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import clsx from "clsx"
import { LuChevronDown, LuChevronRight } from "react-icons/lu"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Card } from "@/components/markdown/card"

type TocProps = {
  tocs: { href: string; level: number; text: string }[]
}

type TocSection = {
  heading: { href: string; text: string }
  items: { href: string; level: number; text: string }[]
}

export default function Toc({ tocs }: TocProps) {
  const [activeId, setActiveId] = useState<string>("")

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()
    const id = href.startsWith("#") ? href.slice(1) : href
    const targetElement = document.getElementById(id)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
      window.history.pushState(null, "", href)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-80px 0px -80% 0px" }
    )

    const headings = tocs.map(({ href }) => {
      const id = href.startsWith("#") ? href.slice(1) : href
      return document.getElementById(id)
    }).filter(Boolean) as HTMLElement[]

    headings.forEach((heading) => observer.observe(heading))

    return () => {
      headings.forEach((heading) => observer.unobserve(heading))
    }
  }, [tocs])

  if (!tocs.length) {
    return null
  }

  // Group TOC items by h2 headings
  const sections: TocSection[] = []
  let currentSection: TocSection | null = null

  tocs.forEach((item) => {
    if (item.level === 2) {
      // Start a new section
      currentSection = {
        heading: { href: item.href, text: item.text },
        items: [],
      }
      sections.push(currentSection)
    } else if (currentSection && item.level > 2) {
      // Add to current section
      currentSection.items.push(item)
    }
  })

  // If there are no h2 headings, show flat list
  if (sections.length === 0) {
    return (
      <Card className="flex w-full flex-col gap-3 px-4 py-3">
        <h3 className="text-sm font-semibold">On this page</h3>
        <ScrollArea className="pt-0.5 pb-4">
          <div className="flex flex-col gap-2.5 text-sm text-neutral-800 dark:text-neutral-300/85">
            {tocs.map(({ href, level, text }) => (
              <Link
                key={href}
                href={href}
                scroll={false}
                onClick={(e) => handleSmoothScroll(e, href)}
                className={clsx({
                  "pl-0": level == 2,
                  "pl-3": level == 3,
                  "pl-6": level == 4,
                })}
              >
                {text}
              </Link>
            ))}
          </div>
        </ScrollArea>
      </Card>
    )
  }

  return (
    <Card className="flex w-full flex-col gap-3 px-4 py-3">
      <h3 className="text-sm font-semibold">On this page</h3>
      <ScrollArea className="pt-0.5 pb-4">
        <div className="flex flex-col gap-2 text-sm">
          {sections.map((section, index) => {
            // Check if this section or any of its items are active
            const sectionId = section.heading.href.startsWith("#")
              ? section.heading.href.slice(1)
              : section.heading.href
            const isActive =
              activeId === sectionId ||
              section.items.some((item) => {
                const itemId = item.href.startsWith("#")
                  ? item.href.slice(1)
                  : item.href
                return itemId === activeId
              })

            const key = `${section.heading.href}-${index}`
            return (
              <TocSection
                key={key}
                section={section}
                handleSmoothScroll={handleSmoothScroll}
                isActive={isActive}
                activeId={activeId}
                defaultOpen={index === 0}
              />
            )
          })}
        </div>
      </ScrollArea>
      </Card>
  )
}

function TocSection({
  section,
  handleSmoothScroll,
  isActive,
  activeId,
  defaultOpen,
}: {
  section: TocSection
  handleSmoothScroll: (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => void
  isActive: boolean
  activeId: string
  defaultOpen: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const hasChildren = section.items.length > 0

  const headingId = section.heading.href.startsWith("#")
    ? section.heading.href.slice(1)
    : section.heading.href
  const isHeadingActive = activeId === headingId

  // If no children, just render a simple link with same left padding as items with toggles
  if (!hasChildren) {
    return (
      <div className="flex text-sm">
        <Link
          href={section.heading.href}
          scroll={false}
          onClick={(e) => handleSmoothScroll(e, section.heading.href)}
          className={clsx(
            "transition-colors pl-6",
            isHeadingActive
              ? "text-primary font-medium"
              : "text-neutral-800 hover:text-neutral-900 dark:text-neutral-300/85 dark:hover:text-neutral-200"
          )}
        >
          {section.heading.text}
        </Link>
      </div>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center gap-1">
        <CollapsibleTrigger asChild>
          <Button
            className="h-5 w-5 p-0 shrink-0"
            variant="ghost"
            size="icon"
          >
            {isOpen ? (
              <LuChevronDown className="h-3.5 w-3.5" />
            ) : (
              <LuChevronRight className="h-3.5 w-3.5" />
            )}
            <span className="sr-only">Toggle section</span>
          </Button>
        </CollapsibleTrigger>
        <Link
          href={section.heading.href}
          scroll={false}
          onClick={(e) => handleSmoothScroll(e, section.heading.href)}
          className={clsx(
            "flex-1 transition-colors",
            isHeadingActive
              ? "text-primary font-medium"
              : "text-neutral-800 hover:text-neutral-900 dark:text-neutral-300/85 dark:hover:text-neutral-200"
          )}
        >
          {section.heading.text}
        </Link>
      </div>
      <CollapsibleContent className="CollapsibleContent">
        <div className="mt-2 flex flex-col gap-2.5 border-l pl-4 ml-2.5">
          {section.items.map(({ href, level, text }) => {
            const itemId = href.startsWith("#") ? href.slice(1) : href
            const isItemActive = activeId === itemId

            return (
              <Link
                key={href}
                href={href}
                scroll={false}
                onClick={(e) => handleSmoothScroll(e, href)}
                className={clsx(
                  "transition-colors",
                  {
                    "pl-0": level == 3,
                    "pl-3": level == 4,
                  },
                  isItemActive
                    ? "text-primary font-medium"
                    : "text-neutral-800 hover:text-neutral-900 dark:text-neutral-300/85 dark:hover:text-neutral-200"
                )}
              >
                {text}
              </Link>
            )
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
