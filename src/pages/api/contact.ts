import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, message } = await request.json();

    // Solo importamos Resend cuando se necesita
    const { Resend } = await import('resend');
    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: 'Nascent <contacto@nascent.dev>',
      to: [import.meta.env.CONTACT_EMAIL],
      subject: `Nuevo mensaje de contacto de ${name}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
    });
  }
}; 