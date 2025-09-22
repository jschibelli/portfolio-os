import { motion } from 'framer-motion';
import { Check, Copy, FileCode } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';

interface CodeBlockProps {
	children: string;
	language?: string;
	title?: string;
	filename?: string;
	description?: string;
	showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
	children,
	language = 'typescript',
	title,
	filename,
	description,
	showLineNumbers = false,
}) => {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(children);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	const formatCode = (code: string) => {
		if (!showLineNumbers) return code;

		const lines = code.split('\n');
		return lines
			.map((line, index) => `${(index + 1).toString().padStart(3, ' ')}  ${line}`)
			.join('\n');
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="my-8"
		>
			<Card className="overflow-hidden">
				{(title || filename || language) && (
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<FileCode className="text-muted-foreground h-5 w-5" />
								<div>
									{title && <CardTitle className="text-lg">{title}</CardTitle>}
									{filename && (
										<p className="text-muted-foreground font-mono text-sm">{filename}</p>
									)}
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Badge className="text-xs">
									{language}
								</Badge>
								<Button onClick={copyToClipboard} className="h-11 w-11 p-0">
									{copied ? (
										<Check className="h-4 w-4 text-green-600" />
									) : (
										<Copy className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>
						{description && <p className="text-muted-foreground mt-2 text-sm">{description}</p>}
					</CardHeader>
				)}

				<CardContent className="p-0">
					<pre className="bg-muted overflow-x-auto p-4">
						<code className={`language-${language} text-sm leading-relaxed`}>
							{formatCode(children)}
						</code>
					</pre>
				</CardContent>
			</Card>
		</motion.div>
	);
};

interface CodeBlocksGridProps {
	blocks: CodeBlockProps[];
	title?: string;
	columns?: 1 | 2;
}

export const CodeBlocksGrid: React.FC<CodeBlocksGridProps> = ({
	blocks,
	title = 'Code Examples',
	columns = 1,
}) => {
	const gridCols = columns === 2 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1';

	return (
		<div className="my-12">
			{title && <h2 className="mb-8 text-center text-2xl font-bold">{title}</h2>}
			<div className={`grid ${gridCols} gap-6`}>
				{blocks.map((block, index) => (
					<CodeBlock key={index} {...block} />
				))}
			</div>
		</div>
	);
};
