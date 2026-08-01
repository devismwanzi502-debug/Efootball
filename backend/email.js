import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import db from './database.js';

const EMAIL_USER = 'mwanzidevis01@gmail.com';
const EMAIL_PASS = 'zrpchutldgdaeuj';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Verify connection on startup
transporter.verify()
  .then(() => console.log('✅ SMTP connection verified'))
  .catch(err => console.error('❌ SMTP connection failed:', err.message, '\n💡 Use Gmail App Password if 2FA is enabled: https://myaccount.google.com/apppasswords'));

export function generateResetToken() {
  return randomBytes(32).toString('hex');
}

export async function sendResetEmail(email, token) {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: '"eFootball Hub" <mwanzidevis01@gmail.com>',
    to: email,
    subject: 'Reset your eFootball Hub password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #22d3ee, #a855f7); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">⚽ eFootball Hub</h1>
        </div>
        <div style="background: #161d2e; padding: 30px; border-radius: 0 0 12px 12px; color: #e2e8f0;">
          <h2 style="color: #22d3ee; margin-top: 0;">Password Reset Request</h2>
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #22d3ee, #06b6d4); color: #0a0f1a; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #94a3b8; font-size: 14px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
          <hr style="border-color: #1e293b; margin: 20px 0;">
          <p style="color: #64748b; font-size: 12px;">If the button doesn't work, copy this link:<br>${resetUrl}</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Reset email sent:', info.messageId, 'to:', email);
    return info;
  } catch (err) {
    console.error('❌ Failed to send reset email:', err.message);
    console.error('   Error code:', err.code);
    console.error('   Response:', err.response);
    throw err;
  }
}

export function storeResetToken(email, token) {
  const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour
  db.prepare('INSERT OR REPLACE INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)')
    .run(email, token, expiresAt);
}

export function verifyResetToken(token) {
  const row = db.prepare('SELECT * FROM password_resets WHERE token = ? AND expires_at > datetime("now")').get(token);
  return row;
}

export function deleteResetToken(token) {
  db.prepare('DELETE FROM password_resets WHERE token = ?').run(token);
}

// Initialize password_resets table
db.exec(`
  CREATE TABLE IF NOT EXISTS password_resets (
    email TEXT PRIMARY KEY,
    token TEXT NOT NULL,
    expires_at DATETIME NOT NULL
  );
`);