import { FC } from "hono/jsx";

export type WeatherUpdateTemplateProps = {
  city: string;
  unsubscribeLink: string;
  temperature: number;
  humidity: number;
  description: string;
};

export const WeatherUpdateTemplate: FC<WeatherUpdateTemplateProps> = ({
  city,
  unsubscribeLink,
  temperature,
  humidity,
  description,
}) => {
  return (
    <div>
      <h1>Weather Update for {city}</h1>
      <div>
        <p>
          <strong>Current Weather</strong>
        </p>
        <p>Temperature: {temperature}°C</p>
        <p>Humidity: {humidity}%</p>
        <p>Description: {description}</p>
      </div>
      <div>
        <p>
          You're receiving this update because you subscribed to weather updates for {city}.
        </p>
        <p>
          <a href={unsubscribeLink}>Unsubscribe</a> from these updates.
        </p>
      </div>
    </div>
  );
};

export const WeatherUpdateTemplateText = ({
  city,
  unsubscribeLink,
  temperature,
  humidity,
  description,
}: WeatherUpdateTemplateProps) => {
  return `
Weather Update for ${city}

Current Weather
Temperature: ${temperature}°C
Humidity: ${humidity}%
Description: ${description}

You're receiving this update because you subscribed to weather updates for ${city}.
To unsubscribe, visit: ${unsubscribeLink}
`;
};
