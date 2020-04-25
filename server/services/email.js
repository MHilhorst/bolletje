const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const verificationEmailTemplateId = 'd-46a8a3ce316c420799ad0316e7ad37a3';

const verificationEmail = async (user, token) => {
  const msg = {
    to: user.email,
    from: 'automated@snapse.nl',
    templateId: verificationEmailTemplateId,
    dynamic_template_data: {
      name: user.first_name,
      url: `https://app.snapse.nl/api/auth/email/confirmation/${token}`,
    },
  };
  return await sgMail.send(msg).catch((err) => {
    console.log(err.response.body);
  });
};

module.exports.verificationEmail = verificationEmail;
