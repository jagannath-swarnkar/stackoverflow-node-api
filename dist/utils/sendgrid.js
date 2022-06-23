"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
// const EmailTemplate = require('../static/email-template')
const email_template_1 = __importDefault(require("../static/email-template"));
const config_1 = require("./config");
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
const sendMail = (props) => {
    const { to, from, subject, text } = props;
    const msg = {
        to: to,
        from: from || config_1.EMAIL_ID,
        subject: subject || 'SpicyDeli Support Center!',
        text: text,
        html: email_template_1.default,
    };
    return mail_1.default.send(msg);
};
exports.sendMail = sendMail;
//# sourceMappingURL=sendgrid.js.map