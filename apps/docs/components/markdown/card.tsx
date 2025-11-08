import { ReactNode } from "react"
import Image from "next/image"
import { iconMap } from "@/settings/icons"
import clsx from "clsx"
import { Link } from "lib/transition"

type CardProps = {
  subtitle?: string
  title: string
  description?: string
  href?: string
  image?: string
  className?: string
  external?: boolean
  icon?: keyof typeof iconMap
  variant?: "normal" | "small" | "image"
  children?: ReactNode
}

export function Card({
  subtitle,
  title,
  description,
  href,
  image,
  className,
  external = false,
  icon,
  variant = "normal",
  children,
}: CardProps) {
  const IconComponent = icon ? iconMap[icon] : null
  const ExternalIcon = iconMap["arrowUpRight"]

	const iconClasses = clsx(
		"shrink-0 transition-colors",
		variant === "small" ? "h-4 w-4" : "h-7 w-7",
		href
			? "text-blue-600 dark:text-blue-400"
			: "text-gray-600 dark:text-gray-400"
	)

  const content = (
    <div
      className={clsx(
				"group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-300 ease-in-out dark:border-neutral-800 dark:bg-neutral-900",
				href && "hover:shadow-lg hover:border-gray-300 dark:hover:border-neutral-700",
        variant === "small"
					? "flex items-center gap-3 px-4 py-3"
          : variant === "image"
					? "flex h-full flex-col p-0"
					: "flex h-full flex-col p-4",
        className
      )}
    >
      {external && href && variant !== "image" && (
        <div
          className={clsx(
            "absolute top-2 transform text-gray-500 transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-black dark:text-gray-400 dark:group-hover:text-white",
            variant === "small" ? "right-2" : "right-3"
          )}
        >
          <ExternalIcon className="h-4 w-4" />
        </div>
      )}
      
			{/* Icon - only for small variant or when href is present */}
			{IconComponent && (variant === "small" || href) && (
				<div>
					<IconComponent className={iconClasses} />
				</div>
			)}
			
			<div className="flex-1">
        {subtitle && variant === "normal" && (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
        
        {image && variant === "image" && (
          <Image
            src={image}
            alt={title}
            width={400}
            height={400}
            className="!m-0 h-[180px] w-full !rounded-none border-0 object-cover object-center"
          />
        )}
        
				<h3
          className={clsx(
						"font-semibold leading-snug",
            variant === "small"
              ? "text-sm text-gray-900 dark:text-gray-100"
              : variant === "image"
							? "p-4 text-base text-gray-900 dark:text-gray-100"
							: href
							? "text-lg text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400 transition-colors"
							: "text-lg text-gray-900 dark:text-gray-100"
          )}
        >
					{title}
        </h3>
        
				{description && variant === "normal" && (
					<p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}

			{children && variant !== "small" && (
				<div
					className={clsx(
						"mt-3 space-y-3 [&>*]:mt-0",
						variant === "normal" &&
							"text-sm leading-relaxed text-gray-600 dark:text-gray-400",
						variant === "image" && "px-4 pb-4 pt-0"
					)}
				>
					{children as any}
				</div>
			)}
		</div>
		{variant === "small" && children}
  </div>
)

  return href ? (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="!no-underline"
    >
      {content}
    </Link>
  ) : (
    content
  )
}

export function CardGrid({
	children,
	className,
}: {
	children?: ReactNode
	className?: string
}) {
	return (
		<div
			className={clsx(
				"grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-7 2xl:grid-cols-4",
				className
			)}
		>
			{children as any}
		</div>
	)
}
