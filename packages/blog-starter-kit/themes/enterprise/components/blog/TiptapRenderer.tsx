"use client";

import { useMemo } from "react";
import Image from "next/image";

interface TiptapRendererProps {
  content: any;
  className?: string;
}

export function TiptapRenderer({ content, className = "" }: TiptapRendererProps) {
  const renderedContent = useMemo(() => {
    if (!content || !content.content) {
      return <p className="text-stone-500 dark:text-stone-400 italic">No content available</p>;
    }

    const renderNode = (node: any): React.ReactNode => {
      if (node.type === "text") {
        if (node.marks) {
          let text = node.text;
          node.marks.forEach((mark: any) => {
            switch (mark.type) {
              case "bold":
                text = <strong key={Math.random()}>{text}</strong>;
                break;
              case "italic":
                text = <em key={Math.random()}>{text}</em>;
                break;
              case "code":
                text = <code key={Math.random()} className="bg-stone-100 dark:bg-stone-700 px-1 py-0.5 rounded text-sm font-mono text-stone-800 dark:text-stone-200">{text}</code>;
                break;
              case "link":
                text = (
                  <a 
                    key={Math.random()} 
                    href={mark.attrs.href} 
                    className="text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {text}
                  </a>
                );
                break;
            }
          });
          return text;
        }
        return node.text;
      }

      switch (node.type) {
        case "paragraph":
          return (
            <p key={Math.random()} className="mb-4 leading-relaxed">
              {node.content?.map((child: any, index: number) => renderNode(child))}
            </p>
          );

        case "heading":
          const level = node.attrs.level;
          const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
          const headingClasses = {
            1: "text-4xl font-bold mb-6",
            2: "text-3xl font-bold mb-5",
            3: "text-2xl font-semibold mb-4",
            4: "text-xl font-semibold mb-3",
            5: "text-lg font-medium mb-2",
            6: "text-base font-medium mb-2",
          };
          
          return (
            <HeadingTag 
              key={Math.random()} 
              className={headingClasses[level as keyof typeof headingClasses] || "text-xl font-semibold mb-3"}
            >
              {node.content?.map((child: any, index: number) => renderNode(child))}
            </HeadingTag>
          );

        case "bulletList":
          return (
            <ul key={Math.random()} className="list-disc list-inside mb-4 space-y-1">
              {node.content?.map((child: any, index: number) => renderNode(child))}
            </ul>
          );

        case "orderedList":
          return (
            <ol key={Math.random()} className="list-decimal list-inside mb-4 space-y-1">
              {node.content?.map((child: any, index: number) => renderNode(child))}
            </ol>
          );

        case "listItem":
          return (
            <li key={Math.random()} className="ml-4">
              {node.content?.map((child: any, index: number) => renderNode(child))}
            </li>
          );

        case "blockquote":
          return (
            <blockquote key={Math.random()} className="border-l-4 border-stone-300 dark:border-stone-600 pl-4 italic text-stone-700 dark:text-stone-300 mb-4">
              {node.content?.map((child: any, index: number) => renderNode(child))}
            </blockquote>
          );

        case "codeBlock":
          return (
            <pre key={Math.random()} className="bg-stone-100 dark:bg-stone-700 p-4 rounded-lg overflow-x-auto mb-4">
              <code className="text-sm font-mono text-stone-800 dark:text-stone-200">
                {node.content?.map((child: any, index: number) => renderNode(child))}
              </code>
            </pre>
          );

        case "horizontalRule":
          return <hr key={Math.random()} className="my-8 border-stone-300 dark:border-stone-600" />;

        case "image":
          return (
            <Image
              key={Math.random()}
              src={node.attrs.src}
              alt={node.attrs.alt || ""}
              width={800}
              height={600}
              className="max-w-full h-auto rounded-lg my-4"
              loading="lazy"
            />
          );

        case "taskList":
          return (
            <ul key={Math.random()} className="list-none space-y-2 mb-4">
              {node.content?.map((child: any, index: number) => renderNode(child))}
            </ul>
          );

        case "taskItem":
          return (
            <li key={Math.random()} className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={node.attrs.checked}
                readOnly
                className="mt-1 h-4 w-4 text-stone-600 rounded border-stone-300 focus:ring-stone-500"
              />
              <span className={node.attrs.checked ? "line-through text-stone-500 dark:text-stone-400" : ""}>
                {node.content?.map((child: any, index: number) => renderNode(child))}
              </span>
            </li>
          );

        default:
          if (node.content) {
            return node.content.map((child: any, index: number) => renderNode(child));
          }
          return null;
      }
    };

    return content.content.map((node: any, index: number) => renderNode(node));
  }, [content]);

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      {renderedContent}
    </div>
  );
}
