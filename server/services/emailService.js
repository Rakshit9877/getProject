const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendCustomerConfirmation(order) {
    const mailOptions = {
        from: `"ProjectBuildr" <${process.env.EMAIL_USER}>`,
        to: order.email,
        subject: `Order Confirmed — ${order.projectTitle}`,
        html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 32px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">✅ Order Confirmed!</h1>
        </div>
        <div style="padding: 32px;">
          <p style="color: #334155; font-size: 16px;">Hi <strong>${order.name}</strong>,</p>
          <p style="color: #334155;">Thank you for your order! Here's a summary:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #e2e8f0;">Project</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${order.projectTitle}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #e2e8f0;">Complexity</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${order.complexityLevel}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #e2e8f0;">Amount Paid</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; font-weight: 600;">₹${order.amount}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #e2e8f0;">Deadline</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${order.deadlinePreference}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">GitHub Repo</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${order.githubRepoUrl}</td></tr>
          </table>
          <div style="background: #eff6ff; border-left: 4px solid #6366f1; padding: 16px; border-radius: 4px; margin: 20px 0;">
            <p style="color: #334155; margin: 0;"><strong>Next Steps:</strong></p>
            <ol style="color: #475569; margin: 8px 0 0 0; padding-left: 20px;">
              <li>Ensure GitHub collaborator access is granted</li>
              <li>We'll verify access within 24 hours</li>
              <li>Work begins immediately after verification</li>
              <li>Code will be pushed directly to your repository</li>
            </ol>
          </div>
          <p style="color: #64748b; font-size: 14px;">Questions? Contact us at <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #6366f1;">${process.env.ADMIN_EMAIL}</a></p>
        </div>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
}

async function sendAdminNotification(order) {
    const mailOptions = {
        from: `"ProjectBuildr" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Order Received — ${order.projectTitle}`,
        html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f172a;">🆕 New Order Received</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Name</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${order.name}</td></tr>
          <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Email</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${order.email}</td></tr>
          <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">University</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${order.university}</td></tr>
          <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Year</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${order.yearOfStudy}</td></tr>
          <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Project</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>${order.projectTitle}</strong></td></tr>
          <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Description</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${order.projectDescription}</td></tr>
          <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Tech Stack</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${order.techStack.join(', ')}</td></tr>
          <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Complexity</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${order.complexityLevel}</td></tr>
          <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Features (${order.featureCount})</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${order.featureList}</td></tr>
          <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Deadline</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${order.deadlinePreference}</td></tr>
          <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">References</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${order.referenceWebsites || 'None'}</td></tr>
          <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">GitHub Repo</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><a href="${order.githubRepoUrl}">${order.githubRepoUrl}</a></td></tr>
          <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Payment ID</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${order.paymentId}</td></tr>
          <tr><td style="padding: 8px; color: #64748b;">Amount</td><td style="padding: 8px;">₹${order.amount}</td></tr>
        </table>
        <p style="color: #dc2626; margin-top: 16px;"><strong>⚠️ Action Required:</strong> Verify GitHub collaborator access within 24 hours.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
}

async function sendStatusUpdate(order) {
    const statusMessages = {
        in_progress: {
            emoji: '🚀',
            title: 'Work Has Started!',
            body: 'Our developer has started working on your project. Code will be pushed directly to your GitHub repository.',
        },
        completed: {
            emoji: '🎉',
            title: 'Project Completed!',
            body: 'Your project has been completed and all code has been pushed to your GitHub repository. Please review and let us know if you have any questions.',
        },
        refunded: {
            emoji: '💸',
            title: 'Refund Processed',
            body: 'Your order has been refunded. The amount will be credited back to your original payment method within 5–7 business days.',
        },
    };

    const info = statusMessages[order.status];
    if (!info) return;

    const mailOptions = {
        from: `"ProjectBuildr" <${process.env.EMAIL_USER}>`,
        to: order.email,
        subject: `${info.emoji} ${info.title} — ${order.projectTitle}`,
        html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 32px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">${info.emoji} ${info.title}</h1>
        </div>
        <div style="padding: 32px;">
          <p style="color: #334155; font-size: 16px;">Hi <strong>${order.name}</strong>,</p>
          <p style="color: #334155;">${info.body}</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #e2e8f0;">Project</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${order.projectTitle}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #e2e8f0;">Status</td><td style="padding: 8px 0; color: #6366f1; border-bottom: 1px solid #e2e8f0; font-weight: 600; text-transform: uppercase;">${order.status.replace('_', ' ')}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">GitHub Repo</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${order.githubRepoUrl}</td></tr>
          </table>
          <p style="color: #64748b; font-size: 14px;">Questions? Contact us at <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #6366f1;">${process.env.ADMIN_EMAIL}</a></p>
        </div>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendCustomerConfirmation, sendAdminNotification, sendStatusUpdate };
