import sgMail from '@sendgrid/mail';
// const EmailTemplate = require('../static/email-template')
import template1 from '../static/email-template';
import template2 from '../static/template_2';
import { EMAIL_ID } from './config';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = (props:any) => {
  const {to, from, subject, text } = props;
  const msg = {
    to: to,
    from: from || EMAIL_ID, // Use the email address or domain you verified above
    subject: subject || 'SpicyDeli Support Center!',
    text: text,
    html: template1,
  };

  return sgMail.send(msg)
}