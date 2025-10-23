export function getPasswordResetEmailTemplate(userName: string, code: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, oklch(0.5 0.134 242.749) 0%, oklch(0.4 0.1 242.749) 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Password Change Request</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <p style="margin: 0 0 20px 0; font-size: 16px;">Hi ${userName},</p>
          <p style="margin: 0 0 20px 0; font-size: 16px;">You requested to change your password. Use the verification code below to complete the process:</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: oklch(0.5 0.134 242.749);">${code}</div>
          </div>
          
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">This code will expire in <strong>10 minutes</strong>.</p>
          <p style="margin: 0; font-size: 14px; color: #666;">If you didn't request this password change, please ignore this email or contact support if you have concerns.</p>
        </div>
        
        <div style="text-align: center; color: #999; font-size: 12px;">
          <p style="margin: 0;">This is an automated message, please do not reply.</p>
        </div>
      </body>
    </html>
  `;
}
