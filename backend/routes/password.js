import { Router } from 'express';
import { hashPassword } from '../auth.js';
import { generateResetCode, sendResetEmail, storeResetCode, verifyResetCode, deleteResetCode } from '../email.js';
import db from '../database.js';

const router = Router();

router.post('/forgot-password', async (req, res) => {
  try {
    console.log('🔍 Forgot password request:', req.body);
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    console.log('👤 User found:', user ? 'YES' : 'NO');
    if (!user) {
      return res.json({ message: 'If the email exists, a reset code has been sent' });
    }
    
    const code = generateResetCode();
    console.log('🔢 Generated code:', code);
    storeResetCode(email, code);
    console.log('📧 Sending email...');
    await sendResetEmail(email, code);
    console.log('✅ Email sent successfully');
    
    res.json({ message: 'If the email exists, a reset code has been sent' });
  } catch (err) {
    console.error('❌ Forgot password error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to send reset code' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    console.log('🔍 Reset password request:', req.body);
    const { email, code, password } = req.body;
    if (!email || !code || !password) {
      return res.status(400).json({ error: 'Email, code, and password are required' });
    }
    
    const reset = verifyResetCode(email, code);
    console.log('✅ Code verified:', reset ? 'YES' : 'NO');
    if (!reset) {
      return res.status(400).json({ error: 'Invalid or expired reset code' });
    }
    
    const hashed = await hashPassword(password);
    db.prepare('UPDATE users SET password = ? WHERE email = ?').run(hashed, email);
    deleteResetCode(email);
    
    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('❌ Reset password error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

export default router;