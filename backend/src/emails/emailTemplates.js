export function createWelcomeEmailTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Connectly</title>
  </head>
  <body style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
    <div style="background: linear-gradient(to right, #6366f1, #a855f7); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
      <!-- Modern Chat Icon Placeholder -->
      <div style="background-color: white; width: 80px; height: 80px; margin: 0 auto 20px auto; border-radius: 22px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <img src="https://cdn-icons-png.flaticon.com/512/5968/5968771.png" alt="Connectly Logo" style="width: 50px; height: 50px; margin-top: 15px;">
      </div>
      <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Welcome to Connectly!</h1>
      <p style="color: rgba(255,255,255,0.9); margin-top: 10px; font-size: 16px;">The space where conversations happen.</p>
    </div>

    <div style="background-color: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
      <p style="font-size: 18px; color: #6366f1;"><strong>Hello ${name},</strong></p>
      <p style="font-size: 16px; color: #4b5563;">We're thrilled to have you on board! <strong>Connectly</strong> was built to help you stay in sync with the people who matter most—seamlessly, securely, and in real-time.</p>
      
      <div style="background-color: #f3f4f6; padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #a855f7;">
        <p style="font-size: 16px; margin: 0 0 15px 0; color: #1f2937;"><strong>Quick Start Guide:</strong></p>
        <ul style="padding-left: 20px; margin: 0; color: #4b5563;">
          <li style="margin-bottom: 12px;">Customize your profile and status</li>
          <li style="margin-bottom: 12px;">Sync your contacts to find friends</li>
          <li style="margin-bottom: 12px;">Create groups for your team or family</li>
          <li style="margin-bottom: 0;">Share files, voice notes, and more</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${clientURL}" style="background: linear-gradient(to right, #6366f1, #a855f7); color: white; text-decoration: none; padding: 14px 35px; border-radius: 12px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);">Launch Connectly</a>
      </div>
      
      <p style="color: #4b5563; margin-bottom: 5px;">Need a hand getting started? Our support team is just a message away.</p>
      <p style="color: #4b5563; margin-top: 0;">Happy connecting!</p>
      
      <p style="margin-top: 30px; margin-bottom: 0; color: #1f2937; font-weight: 600;">Best regards,<br><span style="color: #6366f1;">The Connectly Team</span></p>
    </div>
    
    <div style="text-align: center; padding: 30px; color: #9ca3af; font-size: 13px;">
      <p style="margin-bottom: 10px;">© 2025 Connectly Inc. All rights reserved.</p>
      <p>
        <a href="#" style="color: #6366f1; text-decoration: none; margin: 0 10px;">Privacy Policy</a> • 
        <a href="#" style="color: #6366f1; text-decoration: none; margin: 0 10px;">Terms of Service</a> • 
        <a href="#" style="color: #6366f1; text-decoration: none; margin: 0 10px;">Help Center</a>
      </p>
    </div>
  </body>
  </html>
  `;
}