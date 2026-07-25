// Exemplo com Nodemailer
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, company, notes } = req.body;
  // Enviar para seu e-mail
  // await transporter.sendMail({
  //   to: 'comercial@vallecggroup.com.br',
  //   subject: `Novo contato de ${name}`,
  //   html: `...`
  // })
});
