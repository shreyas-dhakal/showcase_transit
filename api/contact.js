const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!apiKey || !contactEmail) {
    console.error('Missing RESEND_API_KEY or CONTACT_EMAIL.');
    return response.status(500).json({ error: 'Email service is not configured.' });
  }

  const { name, email, website, company } = request.body || {};

  // Bots commonly fill hidden fields; return success without sending mail.
  if (company) return response.status(200).json({ ok: true });

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof website !== 'string' ||
    !name.trim() ||
    name.length > 100 ||
    !EMAIL_PATTERN.test(email) ||
    email.length > 254 ||
    website.length > 500
  ) {
    return response.status(400).json({ error: 'Please provide valid contact details.' });
  }

  let websiteUrl;
  try {
    websiteUrl = new URL(website);
    if (!['http:', 'https:'].includes(websiteUrl.protocol)) throw new Error('Invalid protocol');
  } catch {
    return response.status(400).json({ error: 'Please provide a valid website URL.' });
  }

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Transit <onboarding@resend.dev>',
        to: [contactEmail],
        reply_to: email,
        subject: `Demo request from ${name.trim()}`,
        text: [
          `Name: ${name.trim()}`,
          `Email: ${email}`,
          `Website: ${websiteUrl.toString()}`,
        ].join('\n'),
      }),
    });

    if (!resendResponse.ok) {
      console.error('Resend request failed:', resendResponse.status, await resendResponse.text());
      return response.status(502).json({ error: 'Unable to send your request right now.' });
    }

    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact request failed:', error);
    return response.status(502).json({ error: 'Unable to send your request right now.' });
  }
};
