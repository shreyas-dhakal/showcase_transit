## Contact form

The demo form sends email through a Vercel Function and the Resend API. Copy the values shown in `.env.example` into the ignored `.env` file for local development:

- `RESEND_API_KEY`: API key from the Resend dashboard
- `CONTACT_EMAIL`: inbox that receives demo requests

For production, add the same variables under **Vercel Project Settings > Environment Variables** and redeploy. The local `.env` file is intentionally excluded from Git and is not uploaded to Vercel.

Until a sending domain is verified, Resend's `onboarding@resend.dev` test sender can only deliver to the email address associated with the Resend account. After verifying a domain, update the `from` address in `api/contact.js`.
