import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendCommentNotification(
  postTitle: string,
  postSlug: string,
  commenterName: string,
  commentContent: string
) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  try {
    const { data, error } = await resend.emails.send({
      from: 'BlogPlatform <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL || 'admin@blog.com',
      subject: `💬 New comment on "${postTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">New Comment</h1>
          </div>
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;"><strong>${commenterName}</strong> commented on <strong>${postTitle}</strong></p>
            <div style="background: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-style: italic;">"${commentContent}"</p>
            </div>
            <a href="${baseUrl}/blog/${postSlug}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              View Comment →
            </a>
          </div>
        </div>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to send notification:', error)
    return { success: false }
  }
}