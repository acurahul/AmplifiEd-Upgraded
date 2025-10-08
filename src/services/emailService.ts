/**
 * Email Service for AmplifiEd
 * Handles welcome emails, invitations, and notifications
 */

interface WelcomeEmailData {
  studentName: string;
  courseTitle: string;
  tutorName: string;
  platformUrl: string;
  loginUrl: string;
}

interface InvitationEmailData {
  studentName: string;
  courseTitle: string;
  tutorName: string;
  invitationLink: string;
  platformUrl: string;
}

export class EmailService {
  private static readonly EMAIL_API_URL = process.env.NEXT_PUBLIC_EMAIL_SERVICE_URL || 'https://api.emailjs.com/api/v1.0/email/send';
  private static readonly EMAIL_SERVICE_ID = process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID;
  private static readonly EMAIL_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID;
  private static readonly EMAIL_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY;

  /**
   * Send welcome email to newly enrolled student
   */
  static async sendWelcomeEmail(
    studentEmail: string, 
    data: WelcomeEmailData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const emailData = {
        service_id: this.EMAIL_SERVICE_ID,
        template_id: this.EMAIL_TEMPLATE_ID || 'template_welcome',
        user_id: this.EMAIL_PUBLIC_KEY,
        template_params: {
          to_email: studentEmail,
          student_name: data.studentName,
          course_title: data.courseTitle,
          tutor_name: data.tutorName,
          platform_url: data.platformUrl,
          login_url: data.loginUrl,
          reply_to: 'noreply@amplified.in'
        }
      };

      const response = await fetch(this.EMAIL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        throw new Error(`Email service responded with status: ${response.status}`);
      }

      console.log(`✅ Welcome email sent to ${studentEmail}`);
      return { success: true };

    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Send invitation email to student
   */
  static async sendInvitationEmail(
    studentEmail: string,
    data: InvitationEmailData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const emailData = {
        service_id: this.EMAIL_SERVICE_ID,
        template_id: this.EMAIL_TEMPLATE_ID || 'template_invitation',
        user_id: this.EMAIL_PUBLIC_KEY,
        template_params: {
          to_email: studentEmail,
          student_name: data.studentName,
          course_title: data.courseTitle,
          tutor_name: data.tutorName,
          invitation_link: data.invitationLink,
          platform_url: data.platformUrl,
          reply_to: 'noreply@amplified.in'
        }
      };

      const response = await fetch(this.EMAIL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        throw new Error(`Email service responded with status: ${response.status}`);
      }

      console.log(`✅ Invitation email sent to ${studentEmail}`);
      return { success: true };

    } catch (error) {
      console.error('❌ Failed to send invitation email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Fallback: Simple email notification (if email service is not configured)
   */
  static async sendSimpleNotification(
    studentEmail: string,
    message: string
  ): Promise<{ success: boolean; error?: string }> {
    // This is a fallback - in production you might want to use a different service
    console.log(`📧 Email notification for ${studentEmail}: ${message}`);
    return { success: true };
  }
}

/**
 * Helper function to generate secure temporary password
 */
export function generateSecurePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
