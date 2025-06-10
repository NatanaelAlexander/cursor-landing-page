import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      message: 'This endpoint only accepts POST requests for sending contact form submissions.',
      status: 405
    }),
    {
      status: 405,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, message } = data;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          message: 'Missing required fields',
          status: 400
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const Resend = (await import('resend')).Resend;
    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    const { data: emailData, error } = await resend.emails.send({
      from: 'contacto@nascent.dev',
      to: import.meta.env.CONTACT_EMAIL,
      subject: `Nuevo mensaje de contacto de ${name}`,
      text: `
        Nombre: ${name}
        Email: ${email}
        Mensaje: ${message}
      `,
      reply_to: email
    });

    if (error) {
      console.error('Error sending email:', error);
      return new Response(
        JSON.stringify({
          message: 'Error sending email',
          status: 500
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Email sent successfully',
        status: 200
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({
        message: 'Error processing request',
        status: 500
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}; 