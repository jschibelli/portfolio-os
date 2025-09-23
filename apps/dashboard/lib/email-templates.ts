import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export class EmailTemplates {
  // Booking confirmation email
  static bookingConfirmation(data: {
    attendeeName: string;
    attendeeEmail: string;
    meetingTitle: string;
    startTime: string;
    endTime: string;
    meetUrl: string;
    timeZone: string;
  }): EmailTemplate {
    return {
      subject: `Meeting Confirmed: ${data.meetingTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Meeting Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Meeting Confirmed</h2>
            <p>Hi ${data.attendeeName},</p>
            <p>Your meeting has been successfully scheduled:</p>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">${data.meetingTitle}</h3>
              <p><strong>Date & Time:</strong> ${data.startTime} - ${data.endTime} (${data.timeZone})</p>
              <p><strong>Meeting Link:</strong> <a href="${data.meetUrl}" style="color: #2563eb;">Join Meeting</a></p>
            </div>
            <p>We look forward to meeting with you!</p>
            <p>Best regards,<br>John Schibelli</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Meeting Confirmed: ${data.meetingTitle}
        
        Hi ${data.attendeeName},
        
        Your meeting has been successfully scheduled:
        
        ${data.meetingTitle}
        Date & Time: ${data.startTime} - ${data.endTime} (${data.timeZone})
        Meeting Link: ${data.meetUrl}
        
        We look forward to meeting with you!
        
        Best regards,
        John Schibelli
      `
    };
  }

  // Welcome email for new users
  static welcomeEmail(data: {
    userName: string;
    userEmail: string;
  }): EmailTemplate {
    return {
      subject: 'Welcome to John Schibelli\'s Portfolio',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Welcome!</h2>
            <p>Hi ${data.userName},</p>
            <p>Thank you for your interest in my work. I'm excited to connect with you and discuss how we can work together.</p>
            <p>Feel free to explore my portfolio and case studies to learn more about my experience and approach.</p>
            <p>If you have any questions or would like to schedule a consultation, don't hesitate to reach out!</p>
            <p>Best regards,<br>John Schibelli</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome!
        
        Hi ${data.userName},
        
        Thank you for your interest in my work. I'm excited to connect with you and discuss how we can work together.
        
        Feel free to explore my portfolio and case studies to learn more about my experience and approach.
        
        If you have any questions or would like to schedule a consultation, don't hesitate to reach out!
        
        Best regards,
        John Schibelli
      `
    };
  }

  // Project inquiry notification
  static projectInquiry(data: {
    clientName: string;
    clientEmail: string;
    company: string;
    message: string;
    source: string;
  }): EmailTemplate {
    return {
      subject: `New Project Inquiry from ${data.clientName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New Project Inquiry</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">New Project Inquiry</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${data.clientName}</p>
              <p><strong>Email:</strong> ${data.clientEmail}</p>
              <p><strong>Company:</strong> ${data.company}</p>
              <p><strong>Source:</strong> ${data.source}</p>
              <p><strong>Message:</strong></p>
              <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #2563eb;">
                ${data.message.replace(/\n/g, '<br>')}
              </div>
            </div>
            <p>This inquiry was submitted through your portfolio website.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        New Project Inquiry
        
        Name: ${data.clientName}
        Email: ${data.clientEmail}
        Company: ${data.company}
        Source: ${data.source}
        
        Message:
        ${data.message}
        
        This inquiry was submitted through your portfolio website.
      `
    };
  }
}

export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = resend;
  }

  async sendBookingConfirmation(data: {
    attendeeName: string;
    attendeeEmail: string;
    meetingTitle: string;
    startTime: string;
    endTime: string;
    meetUrl: string;
    timeZone: string;
  }) {
    const template = EmailTemplates.bookingConfirmation(data);
    
    return await this.resend.emails.send({
      from: 'John Schibelli <noreply@johnschibelli.dev>',
      to: [data.attendeeEmail],
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async sendWelcomeEmail(data: {
    userName: string;
    userEmail: string;
  }) {
    const template = EmailTemplates.welcomeEmail(data);
    
    return await this.resend.emails.send({
      from: 'John Schibelli <noreply@johnschibelli.dev>',
      to: [data.userEmail],
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async sendProjectInquiryNotification(data: {
    clientName: string;
    clientEmail: string;
    company: string;
    message: string;
    source: string;
  }) {
    const template = EmailTemplates.projectInquiry(data);
    
    return await this.resend.emails.send({
      from: 'Portfolio Website <noreply@johnschibelli.dev>',
      to: ['john@johnschibelli.dev'],
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }
}

export const emailService = new EmailService();
