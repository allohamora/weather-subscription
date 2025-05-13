import type { FC } from 'hono/jsx';
import { html } from 'hono/html';

export const Root: FC = () => {
  return (
    <>
      {html`<!doctype html>`}
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Weather subscription</title>
        </head>
        <body>
          <h1>Hello World!</h1>
        </body>
      </html>
    </>
  );
};
