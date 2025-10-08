# Email Service Setup Guide

## 🎯 **Quick Setup Instructions**

### **Option 1: EmailJS (Recommended for Development)**

1. **Go to [EmailJS.com](https://www.emailjs.com/)**
2. **Sign up for a free account**
3. **Create a new service:**
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Connect your email account
   - Copy the **Service ID**

4. **Create email templates:**
   - Go to "Email Templates"
   - Create template with ID: `template_welcome`
   - Use this template content:

```html
Subject: Welcome to {{course_title}}!

Hi {{student_name}},

Welcome to {{course_title}}! Your tutor {{tutor_name}} has enrolled you in this course.

You can access the course at: {{platform_url}}
Login at: {{login_url}}

Best regards,
AmplifiEd Team
```

5. **Get your Public Key:**
   - Go to "Account" → "General"
   - Copy your **Public Key**

6. **Add to your .env file:**
```env
NEXT_PUBLIC_EMAIL_SERVICE_ID=service_xxxxxxxxx
NEXT_PUBLIC_EMAIL_TEMPLATE_ID=template_welcome
NEXT_PUBLIC_EMAIL_PUBLIC_KEY=xxxxxxxxxxxxxxxx
NEXT_PUBLIC_EMAIL_SERVICE_URL=https://api.emailjs.com/api/v1.0/email/send
```

### **Option 2: Resend (Production-Ready)**

1. **Go to [Resend.com](https://resend.com/)**
2. **Sign up and verify your domain**
3. **Get your API key from dashboard**
4. **Add to your .env file:**
```env
NEXT_PUBLIC_EMAIL_SERVICE_URL=https://api.resend.com/emails
RESEND_API_KEY=re_your_api_key_here
```

### **Option 3: SendGrid**

1. **Go to [SendGrid.com](https://sendgrid.com/)**
2. **Create account and get API key**
3. **Add to your .env file:**
```env
NEXT_PUBLIC_EMAIL_SERVICE_URL=https://api.sendgrid.com/v3/mail/send
SENDGRID_API_KEY=SG.your_api_key_here
```

## 🔧 **Testing Email Service**

1. **Add the environment variables to your `.env` file**
2. **Restart your development server**
3. **Try enrolling a student with "Send welcome email" checked**
4. **Check the browser console for email service logs**

## 📧 **Email Templates Needed**

### **Welcome Email Template:**
```
Subject: Welcome to {{course_title}} - AmplifiEd

Hi {{student_name}},

Great news! You've been enrolled in {{course_title}} by {{tutor_name}}.

🔗 Access your course: {{platform_url}}
🔑 Login here: {{login_url}}

What's next:
1. Log in with your email address
2. Set up your password
3. Explore your course materials
4. Start learning!

Need help? Contact us at support@amplified.in

Best regards,
The AmplifiEd Team
```

## 🚨 **Important Security Notes**

1. **Service Role Key**: Make sure you have `SUPABASE_SERVICE_ROLE_KEY` in your `.env` file
2. **Student Role Only**: The system automatically restricts new users to 'student' role
3. **Email Validation**: All email addresses are validated before sending
4. **Rate Limiting**: Consider adding rate limiting to prevent spam

## 🐛 **Troubleshooting**

### **"Email service not configured" error:**
- Check your `.env` file has the correct email service variables
- Restart your development server after adding new environment variables

### **"Failed to send welcome email" warning:**
- This is not critical - enrollment still works
- Check your email service API key and configuration
- Verify your email template exists

### **Users not created in auth:**
- Check you have `SUPABASE_SERVICE_ROLE_KEY` set
- Verify the service role key has admin permissions
- Check browser console for detailed error messages
