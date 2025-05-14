import { Resend } from 'resend';
import { RESEND_API_KEY, EMAIL_FROM, EMAIL_NAME } from 'src/config.js';
import { createLogger } from './pino.lib.js';
import { Exception, ExceptionCode } from 'src/exception.js';

const resend = new Resend(RESEND_API_KEY);

const logger = createLogger('email.lib.ts');

type SendEmailOptions = {
  to: string[];
  title: string;
  html?: string;
  text?: string;
};

export const sendEmail = async ({ to, title, html, text }: SendEmailOptions) => {
  const { error } = await resend.emails.send({
    from: `${EMAIL_NAME} <${EMAIL_FROM}>`,
    to,
    subject: title,
    html,
    text,

    // type-issue of the library
    react: undefined,
  });

  if (error) {
    logger.error({ err: error });
    throw new Exception(ExceptionCode.INTERNAL_SERVER_ERROR, error.message);
  }
};
