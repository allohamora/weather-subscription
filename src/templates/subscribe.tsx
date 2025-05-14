import { FC } from 'hono/jsx';

interface SubscribeTemplateProps {
  city: string;
  confirmationLink: string;
}

const styles = {
  body: {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    lineHeight: 1.6,
    color: '#333',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '30px',
    border: '1px solid #eaeaea',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#0078d4',
    textAlign: 'center',
    marginBottom: '20px',
  },
  hr: {
    borderColor: '#eaeaea',
    margin: '20px 0',
  },
  text: {
    fontSize: '16px',
    margin: '10px 0',
  },
  buttonContainer: {
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0078d4',
    color: '#ffffff',
    borderRadius: '4px',
    fontWeight: 'bold',
    padding: '12px 24px',
    border: 'none',
    margin: '20px auto',
    display: 'inline-block',
    textDecoration: 'none',
  },
  footer: {
    fontSize: '12px',
    color: '#666',
    textAlign: 'center',
    margin: '5px 0',
  },
};

export const SubscribeTemplate: FC<SubscribeTemplateProps> = ({
  city,
  confirmationLink,
}) => {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Confirm Your Weather Subscription</title>
        <meta name="description" content={`Confirm your weather subscription for ${city}`} />
      </head>
      <body style={styles.body}>
        <div style={styles.container}>
          <h1 style={styles.header}>Weather Subscription</h1>
          <hr style={styles.hr} />
          <div>
            <p style={styles.text}>
              Hello, Thank you for subscribing to weather updates for <strong>{city}</strong>.
            </p>
            <p style={styles.text}>
              To confirm your subscription and start receiving weather updates, please click the button below:
            </p>
            <div style={styles.buttonContainer}>
              <a href={confirmationLink} style={styles.button}>
                Confirm Subscription
              </a>
            </div>
            <p style={styles.text}>
              If you didn't request this subscription, you can safely ignore this email.
            </p>
            <hr style={styles.hr} />
            <p style={styles.footer}>
              &copy; {new Date().getFullYear()} Weather Subscription Service
            </p>
            <p style={styles.footer}>
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};

export const SubscribeTemplateText = ({ city, confirmationLink }: SubscribeTemplateProps) => {
  return `Hello, Thank you for subscribing to weather updates for ${city}.
To confirm your subscription and start receiving weather updates, please click the link below:
${confirmationLink}
If you didn't request this subscription, you can safely ignore this email.
&copy; ${new Date().getFullYear()} Weather Subscription Service
This is an automated message, please do not reply to this email.`;
};
