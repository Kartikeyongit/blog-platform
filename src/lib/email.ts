import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string, name?: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'BlogPlatform <newsletter@yourdomain.com>',
      to: email,
      subject: 'Welcome to BlogPlatform Newsletter! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to BlogPlatform</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">🎉 Welcome to BlogPlatform!</h1>
          </div>
          
          <div style="background: white; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hi${name ? ` ${name}` : ''},</p>
            
            <p style="font-size: 16px;">Thank you for subscribing to the BlogPlatform newsletter! We're excited to have you join our community of readers and writers.</p>
            
            <div style="background: #f7f7f7; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h2 style="color: #333; margin-top: 0;">What to expect:</h2>
              <ul style="padding-left: 20px;">
                <li style="margin: 10px 0;">📝 Latest blog posts and tutorials</li>
                <li style="margin: 10px 0;">💡 Tips and best practices</li>
                <li style="margin: 10px 0;">🚀 New feature announcements</li>
                <li style="margin: 10px 0;">📚 Curated content picks</li>
              </ul>
            </div>
            
            <p style="font-size: 16px;">We'll send you updates once a week. No spam, ever!</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold;
                        display: inline-block;">
                Visit BlogPlatform
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If you didn't subscribe to this newsletter, you can safely ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center;">
              BlogPlatform - A modern blog platform for sharing knowledge
            </p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Failed to send welcome email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error }
  }
}

export async function sendNewPostNotification(
  email: string,
  postTitle: string,
  postSlug: string,
  postExcerpt?: string
) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    
    const { data, error } = await resend.emails.send({
      from: 'BlogPlatform <newsletter@yourdomain.com>',
      to: email,
      subject: `📝 New Post: ${postTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New Blog Post</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: white; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">New Post Published!</h1>
            </div>
            
            <div style="padding: 30px;">
              <h2 style="color: #333; margin-top: 0;">${postTitle}</h2>
              
              ${postExcerpt ? `<p style="color: #666; font-size: 16px;">${postExcerpt}</p>` : ''}
              
              <a href="${baseUrl}/blog/${postSlug}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 12px 25px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold;
                        display: inline-block;
                        margin: 20px 0;">
                Read Full Article →
              </a>
            </div>
          </div>
          
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
            You're receiving this because you subscribed to BlogPlatform newsletter.
            <br>
            <a href="${baseUrl}/unsubscribe?email=${email}" style="color: #999;">Unsubscribe</a>
          </p>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Failed to send notification:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Notification sending error:', error)
    return { success: false, error }
  }
}