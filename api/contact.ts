import nodemailer from "nodemailer";

/**
 * Contact Form Handler - Serverless Function for Vercel/Node.js
 * Sends contact form submissions via email
 */

interface ContactRequest {
  name: string;
  email: string;
  phone: string;
  company: string;
  interestPower: string;
  currentBill: string;
  notes: string;
}

/**
 * Configure email transporter based on environment
 */
const getEmailTransporter = () => {
  // Using Gmail SMTP
  if (process.env.EMAIL_SERVICE === "gmail") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD, // App password, not regular password
      },
    });
  }

  // Using SendGrid SMTP
  if (process.env.EMAIL_SERVICE === "sendgrid") {
    return nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }

  // Fallback: Generic SMTP
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

/**
 * Generate HTML email template
 */
const generateEmailHTML = (data: ContactRequest): string => {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #f2ff00 0%, #06b6d4 100%);
          padding: 30px;
          text-align: center;
          color: #060606;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .header p {
          margin: 5px 0 0 0;
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 30px;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #f2ff00;
          margin-bottom: 10px;
          border-bottom: 2px solid #f2ff00;
          padding-bottom: 8px;
        }
        .field {
          margin-bottom: 15px;
        }
        .field-label {
          font-weight: bold;
          color: #555;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .field-value {
          color: #333;
          font-size: 14px;
          margin-top: 5px;
          padding: 10px;
          background-color: #f9f9f9;
          border-left: 3px solid #f2ff00;
          border-radius: 3px;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #e0e0e0;
        }
        .badge {
          display: inline-block;
          background-color: #06b6d4;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>OCTA ENERGIA</h1>
          <p>Novo Contato Recebido</p>
        </div>

        <div class="content">
          <div class="section">
            <div class="section-title">📋 Informações do Contato</div>
            <div class="field">
              <div class="field-label">Nome</div>
              <div class="field-value">${data.name}</div>
            </div>
            <div class="field">
              <div class="field-label">E-mail</div>
              <div class="field-value">${data.email}</div>
            </div>
            <div class="field">
              <div class="field-label">Telefone</div>
              <div class="field-value">${data.phone}</div>
            </div>
            <div class="field">
              <div class="field-label">Empresa</div>
              <div class="field-value">${data.company}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">⚡ Interesse Comercial</div>
            <div class="field">
              <div class="field-label">Potência de Interesse</div>
              <div class="field-value">${data.interestPower} kW</div>
            </div>
            ${
              data.currentBill
                ? `
            <div class="field">
              <div class="field-label">Fatura Mensal Atual (aprox.)</div>
              <div class="field-value">R$ ${data.currentBill}</div>
            </div>
            `
                : ""
            }
          </div>

          <div class="section">
            <div class="section-title">💬 Mensagem</div>
            <div class="field-value" style="white-space: pre-wrap;">
              ${data.notes}
            </div>
          </div>

          <div class="badge">
            ⏰ Responder assim que possível
          </div>
        </div>

        <div class="footer">
          <p style="margin: 0;">
            <strong>OCTA ENERGIA</strong> | Grupo VALLEC PARTICIPAÇÕES<br>
            Fortaleza - CE | Brasil<br>
            Este é um e-mail automático do formulário de contato do site.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Main API handler
 */
export default async function handler(req: any, res: any) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, phone, company, interestPower, currentBill, notes } =
      req.body;

    // Validate required fields
    if (!name || !email || !phone || !company) {
      return res.status(400).json({
        success: false,
        message: "Campos obrigatórios faltando",
        error: "Missing required fields: name, email, phone, company",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "E-mail inválido",
        error: "Invalid email format",
      });
    }

    // Get email transporter
    const transporter = getEmailTransporter();

    // Verify transporter connection
    await transporter.verify();

    // Send email to company
    const mailOptions = {
      from: process.env.SENDER_EMAIL || process.env.GMAIL_USER,
      to: process.env.RECIPIENT_EMAIL || "comercial@vallecgroup.com.br",
      subject: `[OCTA ENERGIA] Novo Contato de ${name} - ${company}`,
      html: generateEmailHTML({
        name,
        email,
        phone,
        company,
        interestPower,
        currentBill,
        notes,
      }),
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    // Optional: Send confirmation email to customer
    if (process.env.SEND_CONFIRMATION_EMAIL === "true") {
      const confirmationOptions = {
        from: process.env.SENDER_EMAIL || process.env.GMAIL_USER,
        to: email,
        subject: "OCTA ENERGIA - Recebemos seu contato! ✓",
        html: `
          <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #f2ff00;">Obrigado pelo seu contato!</h2>
            <p>Olá ${name},</p>
            <p>Recebemos sua solicitação e nossa equipe comercial entrará em contato em breve para discutir as melhores soluções em energia para sua empresa.</p>
            <p>Se tiver dúvidas, responda este e-mail.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">
              <strong>OCTA ENERGIA</strong><br>
              Grupo VALLEC PARTICIPAÇÕES<br>
              Fortaleza - CE | Brasil
            </p>
          </body>
          </html>
        `,
      };

      await transporter.sendMail(confirmationOptions);
    }

    return res.status(200).json({
      success: true,
      message: "Mensagem enviada com sucesso! Você receberá uma resposta em breve.",
      data: {
        name,
        company,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Erro ao enviar mensagem. Por favor, tente novamente mais tarde ou entre em contato conosco pelo telefone.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
