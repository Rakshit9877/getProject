const { Resend } = require('resend');
const { pricingLabels } = require('../config/pricing');

let resend;
function getResend() {
    if (!resend) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
}

const CLIENT_URL = () => process.env.CLIENT_URL || 'https://astrilstore.in';

async function sendCustomerConfirmation(order) {
    try {
        await getResend().emails.send({
            from: 'Astril Studio <onboarding@resend.dev>',
            to: order.email,
            subject: `Order Confirmed — ${order.projectTitle}`,
            html: `
<div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
  <div style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 32px; text-align: center;">
    <h1 style="color: #fff; margin: 0; font-size: 24px;">✅ Order Confirmed!</h1>
  </div>
  <div style="padding: 32px;">
    <p style="color: #334155; font-size: 16px;">Hi <strong>${order.name}</strong>,</p>
    <p style="color: #334155;">Thank you for your order! Here are your details:</p>

    <div style="background: #eef2ff; border: 2px solid #6366f1; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
      <p style="color: #64748b; margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Your Order ID</p>
      <p style="color: #0f172a; margin: 0; font-size: 22px; font-family: monospace; font-weight: bold; letter-spacing: 0.5px;">${order.orderId}</p>
      <p style="color: #6366f1; margin: 8px 0 0 0; font-size: 12px;">Save this — you'll need it to track your project status</p>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #e2e8f0;">Project</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${order.projectTitle}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #e2e8f0;">Complexity</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${pricingLabels[order.complexityLevel] || order.complexityLevel}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #e2e8f0;">Deadline</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${order.deadlinePreference}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #e2e8f0;">Amount Paid</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; font-weight: 600;">₹${order.finalAmountPaid || order.amount}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b;">GitHub Repo</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${order.githubRepoUrl}</td></tr>
    </table>

    <div style="background: #eff6ff; border-left: 4px solid #6366f1; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="color: #334155; margin: 0 0 8px 0;"><strong>What happens next:</strong></p>
      <ul style="color: #475569; margin: 0; padding-left: 20px;">
        <li>We verify your GitHub collaborator access within 24 hours</li>
        <li>Once verified, development begins immediately</li>
        <li>Code is delivered directly to your GitHub repository</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${CLIENT_URL()}/track" style="display: inline-block; background: #6366f1; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">Track Your Order</a>
    </div>
  </div>
</div>`,
        });
    } catch (error) {
        console.error('Customer confirmation email error:', error);
    }
}

async function sendAdminNotification(order) {
    try {
        await getResend().emails.send({
            from: 'Astril Studio <onboarding@resend.dev>',
            to: process.env.ADMIN_EMAIL || 'checktest250@gmail.com',
            subject: `New Order — ${order.projectTitle} [${order.orderId}]`,
            html: `
<div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #0f172a;">🆕 New Order Received</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Order ID</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: bold;">${order.orderId}</td></tr>
    <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Payment ID</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-family: monospace;">${order.paymentId || '—'}</td></tr>
    <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Name</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${order.name}</td></tr>
    <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Email</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${order.email}</td></tr>
    <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">University</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${order.university}</td></tr>
    <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Project</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>${order.projectTitle}</strong></td></tr>
    <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Complexity</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${pricingLabels[order.complexityLevel] || order.complexityLevel}</td></tr>
    <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Tech Stack</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${(order.techStack || []).join(', ')}</td></tr>
    <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Features</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${(order.selectedFeatures || []).join(', ')}</td></tr>
    <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Deadline</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${order.deadlinePreference}</td></tr>
    <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">GitHub</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><a href="${order.githubRepoUrl}">${order.githubRepoUrl}</a></td></tr>
    <tr><td style="padding: 8px; color: #64748b;">Amount</td><td style="padding: 8px;">₹${order.finalAmountPaid || order.amount}${order.couponCode ? ` (coupon: ${order.couponCode}, saved ₹${order.discountApplied})` : ''}</td></tr>
  </table>
  <p style="color: #dc2626; margin-top: 16px;"><strong>⚠️ Action Required:</strong> Verify GitHub collaborator access within 24 hours.</p>
</div>`,
        });
    } catch (error) {
        console.error('Admin notification email error:', error);
    }
}

async function sendStatusUpdateEmail(order) {
    try {
        const statusMessages = {
            pending_verification: { emoji: '📋', title: 'Order Received', body: 'Your order has been received. We are verifying your GitHub collaborator access.' },
            collaborator_verified: { emoji: '✅', title: 'Collaborator Verified', body: 'GitHub collaborator access has been confirmed. Your project is queued for development.' },
            in_progress: { emoji: '🚀', title: 'Development Started', body: 'Our developer has started working on your project.' },
            review_testing: { emoji: '🔍', title: 'Review & Testing', body: 'Your project is in the review and testing phase.' },
            completed: { emoji: '🎉', title: 'Project Completed!', body: 'Your project has been completed and all code has been pushed to your GitHub repository.' },
            refunded: { emoji: '💸', title: 'Refund Processed', body: 'Your order has been refunded. The amount will be credited back within 5–7 business days.' },
        };

        const info = statusMessages[order.status];
        if (!info) return;

        const customNote = order.statusMessage
            ? `<div style="background: #f1f5f9; padding: 12px 16px; border-radius: 8px; margin: 16px 0;"><p style="color: #334155; margin: 0; font-size: 14px;"><strong>Note from team:</strong> ${order.statusMessage}</p></div>`
            : '';

        await getResend().emails.send({
            from: 'Astril Studio <onboarding@resend.dev>',
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
    ${customNote}
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #e2e8f0;">Order ID</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: 600;">${order.orderId}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #e2e8f0;">Project</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${order.projectTitle}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b;">Status</td><td style="padding: 8px 0; color: #6366f1; font-weight: 600; text-transform: uppercase;">${order.status.replace(/_/g, ' ')}</td></tr>
    </table>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${CLIENT_URL()}/track" style="display: inline-block; background: #6366f1; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">Track Your Order</a>
    </div>
  </div>
</div>`,
        });
    } catch (error) {
        console.error('Status update email error:', error);
    }
}

async function sendRefundNotification(order) {
    try {
        await getResend().emails.send({
            from: 'Astril Studio <onboarding@resend.dev>',
            to: order.email,
            subject: `Order Refunded — ${order.projectTitle}`,
            html: `
<div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
  <div style="background: linear-gradient(135deg, #7f1d1d, #991b1b); padding: 32px; text-align: center;">
    <h1 style="color: #fff; margin: 0; font-size: 24px;">💸 Refund Processed</h1>
  </div>
  <div style="padding: 32px;">
    <p style="color: #334155; font-size: 16px;">Hi <strong>${order.name}</strong>,</p>
    <p style="color: #334155;">A refund has been processed for your order. Here are the details:</p>

    <div style="background: #fee2e2; border: 2px solid #ef4444; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
      <p style="color: #b91c1c; margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Refund Amount</p>
      <p style="color: #7f1d1d; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 0.5px;">₹${order.refundAmount?.toLocaleString('en-IN')}</p>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #e2e8f0;">Order ID</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; font-weight: 600; font-family: monospace;">${order.orderId}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #e2e8f0;">Project</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${order.projectTitle}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #e2e8f0;">Refund Reason</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${order.refundReason || 'Cancellation requested'}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b;">Refund ID</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600; font-family: monospace;">${order.refundId}</td></tr>
    </table>

    <div style="background: #eff6ff; border-left: 4px solid #6366f1; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="color: #334155; margin: 0; font-size: 14px;">The amount will be credited back to your original payment method within <strong>5–7 business days</strong>. If you don't receive it by then, please contact your bank with the Refund ID above.</p>
    </div>
  </div>
</div>`,
        });
    } catch (error) {
        console.error('Refund notification email error:', error);
    }
}

module.exports = { sendCustomerConfirmation, sendAdminNotification, sendStatusUpdateEmail, sendRefundNotification };
