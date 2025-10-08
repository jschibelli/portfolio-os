'use client';

import { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        // Dynamically import mermaid only on client side
        const mermaid = (await import('mermaid')).default;
        
        // Initialize mermaid with custom theme
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            // White lines and text, black headings in boxes
            primaryColor: '#000000', // Black for box headings
            primaryTextColor: '#000000', // Black text in boxes
            primaryBorderColor: '#000000', // Black borders
            lineColor: '#ffffff', // White lines
            secondaryColor: '#000000', // Black
            tertiaryColor: '#000000', // Black
            background: '#ffffff', // White background
            mainBkg: '#ffffff', // White background
            secondBkg: '#ffffff', // White background
            labelBackground: '#ffffff', // White background
            nodeBorder: '#000000', // Black borders
            nodeTextColor: '#000000', // Black text in boxes
            textColor: '#ffffff', // White text between lines
            fontSize: '16px',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            fontWeight: 'bold',
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
            padding: 20,
          },
          sequence: {
            useMaxWidth: true,
            wrap: true,
            padding: 20,
          },
          securityLevel: 'loose',
        });

        if (ref.current) {
          ref.current.innerHTML = '';
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          const { svg } = await mermaid.render(id, chart);
          ref.current.innerHTML = svg;
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      }
    };

    renderDiagram();
  }, [chart]);

  if (error) {
    return (
      <div className="my-6 rounded-lg border-2 border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <p className="text-sm text-red-800 dark:text-red-200">
          Failed to render diagram: {error}
        </p>
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-red-600 dark:text-red-400">
            Show diagram source
          </summary>
          <pre className="mt-2 overflow-auto text-xs">
            <code>{chart}</code>
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div className="mermaid-diagram my-8 overflow-auto rounded-xl border-2 border-stone-300 bg-gradient-to-br from-stone-900 to-stone-800 p-8 shadow-lg dark:border-stone-600">
      <div 
        ref={ref} 
        className="flex justify-center [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:drop-shadow-lg [&_svg_path]:stroke-2 [&_svg_text]:font-bold [&_svg_text]:fill-black [&_svg_text]:stroke-black [&_svg_text]:stroke-1 [&_svg_rect]:stroke-2 [&_svg_circle]:stroke-2 [&_svg_polygon]:stroke-2"
        style={{
          filter: 'contrast(1.2) brightness(1.1)',
        }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          .mermaid-diagram svg .node text {
            fill: #000000 !important;
            font-weight: bold !important;
            font-size: 16px !important;
          }
          .mermaid-diagram svg .node rect {
            fill: #ffffff !important;
            stroke: #000000 !important;
            stroke-width: 2px !important;
          }
          .mermaid-diagram svg path {
            stroke: #ffffff !important;
            stroke-width: 2px !important;
          }
          .mermaid-diagram svg line {
            stroke: #ffffff !important;
            stroke-width: 2px !important;
          }
          .mermaid-diagram svg .flowchart-link {
            stroke: #ffffff !important;
            stroke-width: 2px !important;
          }
          .mermaid-diagram svg .edgePath {
            stroke: #ffffff !important;
            stroke-width: 2px !important;
          }
          .mermaid-diagram svg .edgePath path {
            stroke: #ffffff !important;
            stroke-width: 2px !important;
          }
          .mermaid-diagram svg .edgeLabel text {
            fill: #ffffff !important;
            font-weight: bold !important;
          }
          .mermaid-diagram svg .label text {
            fill: #000000 !important;
            font-weight: bold !important;
          }
          /* Sequence diagram styling */
          .mermaid-diagram svg .actor {
            fill: #ffffff !important;
            stroke: #000000 !important;
            stroke-width: 2px !important;
          }
          .mermaid-diagram svg .actor text {
            fill: #000000 !important;
            font-weight: bold !important;
          }
          .mermaid-diagram svg .messageLine0 {
            stroke: #ffffff !important;
            stroke-width: 2px !important;
          }
          .mermaid-diagram svg .messageLine1 {
            stroke: #ffffff !important;
            stroke-width: 2px !important;
          }
          .mermaid-diagram svg .messageText {
            fill: #ffffff !important;
            font-weight: bold !important;
          }
          .mermaid-diagram svg .loopLine {
            stroke: #ffffff !important;
            stroke-width: 2px !important;
          }
          .mermaid-diagram svg .loopText {
            fill: #ffffff !important;
            font-weight: bold !important;
          }
          .mermaid-diagram svg .activation {
            fill: #ffffff !important;
            stroke: #000000 !important;
            stroke-width: 2px !important;
          }
          .mermaid-diagram svg .activationText {
            fill: #000000 !important;
            font-weight: bold !important;
          }
          /* Additional line selectors for comprehensive coverage */
          .mermaid-diagram svg .arrowheadPath {
            stroke: #ffffff !important;
            stroke-width: 2px !important;
          }
          .mermaid-diagram svg .arrowheadPath path {
            stroke: #ffffff !important;
            stroke-width: 2px !important;
          }
          .mermaid-diagram svg .flowchart-link {
            stroke: #ffffff !important;
            stroke-width: 2px !important;
          }
          .mermaid-diagram svg .flowchart-link path {
            stroke: #ffffff !important;
            stroke-width: 2px !important;
          }
          .mermaid-diagram svg .messageLine {
            stroke: #ffffff !important;
            stroke-width: 2px !important;
          }
          .mermaid-diagram svg .messageLine path {
            stroke: #ffffff !important;
            stroke-width: 2px !important;
          }
          .mermaid-diagram svg .lifeline {
            stroke: #ffffff !important;
            stroke-width: 2px !important;
          }
          .mermaid-diagram svg .lifeline path {
            stroke: #ffffff !important;
            stroke-width: 2px !important;
          }
          .mermaid-diagram svg .lifeline line {
            stroke: #ffffff !important;
            stroke-width: 2px !important;
          }
        `
      }} />
    </div>
  );
}

