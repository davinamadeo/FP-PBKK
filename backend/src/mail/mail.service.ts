import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Create transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.MAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendWelcomeEmail(email: string, name: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || '"Digital Asset Manager" <noreply@dam.com>',
        to: email,
        subject: 'Welcome to Digital Asset Manager! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">📁 Welcome to DAM!</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333;">Hi ${name}! 👋</h2>
              <p style="color: #666; line-height: 1.6;">
                Welcome to Digital Asset Manager! We're excited to have you on board.
              </p>
              <p style="color: #666; line-height: 1.6;">
                You can now:
              </p>
              <ul style="color: #666; line-height: 1.8;">
                <li>📤 Upload your files securely</li>
                <li>📁 Organize with folders</li>
                <li>🏷️ Tag files for easy search</li>
                <li>🔍 Find files instantly</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                  Go to Dashboard
                </a>
              </div>
              <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                © 2024 Digital Asset Manager. All rights reserved.
              </p>
            </div>
          </div>
        `,
      });
      console.log('✅ Welcome email sent to:', email);
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      throw error;
    }
  }

  async sendFileUploadNotification(email: string, name: string, fileName: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || '"Digital Asset Manager" <noreply@dam.com>',
        to: email,
        subject: `File "${fileName}" uploaded successfully! ✅`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">📤 File Uploaded!</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333;">Hi ${name}! 👋</h2>
              <p style="color: #666; line-height: 1.6;">
                Your file has been successfully uploaded to Digital Asset Manager.
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <p style="margin: 0; color: #333;">
                  <strong>📄 File Name:</strong><br/>
                  <span style="color: #667eea; font-size: 16px;">${fileName}</span>
                </p>
              </div>
              <p style="color: #666; line-height: 1.6;">
                You can now:
              </p>
              <ul style="color: #666; line-height: 1.8;">
                <li>📁 Move it to a folder</li>
                <li>🏷️ Add tags for organization</li>
                <li>🔍 Search and find it easily</li>
                <li>👥 Share with others (coming soon)</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/dashboard/files" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                  View File
                </a>
              </div>
              <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                © 2024 Digital Asset Manager. All rights reserved.
              </p>
            </div>
          </div>
        `,
      });
      console.log('✅ Upload notification sent to:', email);
    } catch (error) {
      console.error('❌ Failed to send upload notification:', error);
      throw error;
    }
  }
}