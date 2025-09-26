// lib/adminAuth.ts 

export function isAdmin(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
  return adminEmails.includes(email);
}