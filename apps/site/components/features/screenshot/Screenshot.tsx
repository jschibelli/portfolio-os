'use client';

import { useState } from 'react';
import { Camera, Download, X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

interface ScreenshotProps {
	url: string;
	alt: string;
	className?: string;
}

export default function Screenshot({ url, alt, className = '' }: ScreenshotProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleScreenshot = async () => {
		setIsLoading(true);
		try {
			// In a real implementation, this would call a screenshot API
			// For now, we'll just simulate the process
			await new Promise(resolve => setTimeout(resolve, 1000));
			setIsModalOpen(true);
		} catch (error) {
			console.error('Screenshot failed:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDownload = () => {
		// In a real implementation, this would download the screenshot
		const link = document.createElement('a');
		link.href = url;
		link.download = `screenshot-${Date.now()}.png`;
		link.click();
	};

	return (
		<>
			<Card className={`relative overflow-hidden ${className}`}>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium">Website Screenshot</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<div className="relative">
						<img
							src={url}
							alt={alt}
							className="w-full h-auto object-cover"
							loading="lazy"
						/>
						<div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
							<Button
								onClick={handleScreenshot}
								disabled={isLoading}
								className="opacity-0 hover:opacity-100 transition-opacity duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80"
							>
								<Camera className="h-4 w-4 mr-2" />
								{isLoading ? 'Capturing...' : 'Take Screenshot'}
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Screenshot Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
					<Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
						<CardHeader className="flex items-center justify-between">
							<CardTitle>Screenshot Preview</CardTitle>
							<Button
								className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
								onClick={() => setIsModalOpen(false)}
							>
								<X className="h-4 w-4" />
							</Button>
						</CardHeader>
						<CardContent className="p-0">
							<div className="relative">
								<img
									src={url}
									alt={alt}
									className="w-full h-auto max-h-[70vh] object-contain"
								/>
								<div className="absolute bottom-4 right-4">
									<Button onClick={handleDownload} className="h-8 px-3 text-sm">
										<Download className="h-4 w-4 mr-2" />
										Download
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</>
	);
}
