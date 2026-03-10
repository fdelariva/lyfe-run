/**
 * Configuration for lead capture and notifications.
 *
 * Email sending requires a RESEND_API_KEY environment variable.
 * Get one at https://resend.com (free tier: 100 emails/day).
 *
 * By default, emails are sent from "onboarding@resend.dev" (Resend's shared
 * test domain). To use your own domain, verify it in the Resend dashboard
 * and update `emailFrom` below.
 */
const leadsConfig = {
  /** Sender email address (must be verified in Resend) */
  emailFrom: "Lyfe Run <onboarding@resend.dev>",

  /** Destination email for new lead notifications */
  emailTo: "fernando.delariva@gmail.com",

  /** Directory where lead JSON files are saved (relative to project root) */
  waitlistDir: "waitlist",
};

export default leadsConfig;
