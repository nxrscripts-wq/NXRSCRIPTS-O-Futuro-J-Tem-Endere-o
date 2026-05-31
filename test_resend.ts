const apiKey = 're_bQKWzW43_9PsXBEWwGGzqrxCx8WkSg5ah';
const notifyEmail = 'elviino.nxrscripts@gmail.com';

async function testResend() {
  console.log('Sending test email via Resend API...');
  
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${apiKey}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        from: 'Acme <onboarding@resend.dev>',
        to: [notifyEmail],
        subject: `Direct Test from CLI`,
        html: '<p>If you receive this, the Resend API works directly!</p>',
      }),
    });

    const data = await res.json();
    console.log('Response Status:', res.status);
    console.log('Response Body:', data);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testResend();
