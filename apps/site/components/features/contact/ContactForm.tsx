'use client';

import { Clock, Mail, User, X } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { PRIMARY_BUTTON_STYLES, SECONDARY_BUTTON_STYLES } from '../../../lib/button-styles';

interface ContactFormProps {
	isOpen: boolean;
	onClose: () => void;
	message?: string;
	fields: string[];
	required: string[];
	onSubmit: (data: { name: string; email: string; timezone: string }) => void;
}

export function ContactForm({
	isOpen,
	onClose,
	message = 'To book a meeting, I need your contact information.',
	fields,
	required,
	onSubmit,
}: ContactFormProps) {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		timezone: 'America/New_York',
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	if (!isOpen) return null;

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: '' }));
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (required.includes('name') && !formData.name.trim()) {
			newErrors.name = 'Name is required';
		}

		if (required.includes('email') && !formData.email.trim()) {
			newErrors.email = 'Email is required';
		} else if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Please enter a valid email address';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (validateForm()) {
			onSubmit(formData);
			onClose();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			onClose();
		}
	};

	return (
		<div 
			className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby="contact-form-title"
			aria-describedby="contact-form-description"
			onKeyDown={handleKeyDown}
		>
			<Card className="w-full max-w-md">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
					<div className="flex items-center space-x-2">
						<User className="h-5 w-5 text-blue-600" aria-hidden="true" />
						<CardTitle id="contact-form-title">Contact Information</CardTitle>
					</div>
					<Button
						onClick={onClose}
						className="h-8 w-8 p-0"
						aria-label="Close contact form"
					>
						<X className="h-4 w-4" />
						<span className="sr-only">Close</span>
					</Button>
				</CardHeader>

				<CardContent className="space-y-4">
					{message && (
						<p id="contact-form-description" className="text-sm text-gray-600">
							{message}
						</p>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						{fields.includes('name') && (
							<div className="space-y-2">
								<Label htmlFor="name" className="flex items-center space-x-2">
									<User className="h-4 w-4" />
									<span>
										Full Name {required.includes('name') && <span className="text-red-500">*</span>}
									</span>
								</Label>
								<Input
									id="name"
									type="text"
									value={formData.name}
									onChange={(e) => handleInputChange('name', e.target.value)}
									placeholder="Enter your full name"
									className={errors.name ? 'border-red-500' : ''}
									aria-describedby={errors.name ? 'name-error' : undefined}
									aria-invalid={!!errors.name}
								/>
								{errors.name && (
									<p id="name-error" className="text-sm text-red-500" role="alert">
										{errors.name}
									</p>
								)}
							</div>
						)}

						{fields.includes('email') && (
							<div className="space-y-2">
								<Label htmlFor="email" className="flex items-center space-x-2">
									<Mail className="h-4 w-4" />
									<span>
										Email Address {required.includes('email') && <span className="text-red-500">*</span>}
									</span>
								</Label>
								<Input
									id="email"
									type="email"
									value={formData.email}
									onChange={(e) => handleInputChange('email', e.target.value)}
									placeholder="Enter your email address"
									className={errors.email ? 'border-red-500' : ''}
									aria-describedby={errors.email ? 'email-error' : undefined}
									aria-invalid={!!errors.email}
								/>
								{errors.email && (
									<p id="email-error" className="text-sm text-red-500" role="alert">
										{errors.email}
									</p>
								)}
							</div>
						)}

						{fields.includes('timezone') && (
							<div className="space-y-2">
								<Label htmlFor="timezone" className="flex items-center space-x-2">
									<Clock className="h-4 w-4" />
									<span>Timezone</span>
								</Label>
								<select
									id="timezone"
									value={formData.timezone}
									onChange={(e) => handleInputChange('timezone', e.target.value)}
									className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="America/New_York">Eastern Time (ET)</option>
									<option value="America/Chicago">Central Time (CT)</option>
									<option value="America/Denver">Mountain Time (MT)</option>
									<option value="America/Los_Angeles">Pacific Time (PT)</option>
									<option value="Europe/London">London (GMT)</option>
									<option value="Europe/Paris">Paris (CET)</option>
									<option value="Asia/Tokyo">Tokyo (JST)</option>
									<option value="Australia/Sydney">Sydney (AEDT)</option>
								</select>
							</div>
						)}

						<div className="flex space-x-3 pt-4">
							<Button onClick={onClose} className={`${SECONDARY_BUTTON_STYLES} flex-1 justify-center`}>
								Cancel
							</Button>
							<Button type="submit" className={`${PRIMARY_BUTTON_STYLES} flex-1 justify-center`}>
								Submit
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
