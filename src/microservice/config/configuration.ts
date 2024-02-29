require('dotenv').config();

export default () => {
  return {
    port: parseInt(process.env.SERVER_PORT, 10) || 3000,
    esb: {
      host: process.env.ESB_HOST,
      httpPort: process.env.ESB_HTTP_PORT,
      port: parseInt(process.env.ESB_PORT, 10) || 6698,
      vhost: process.env.ESB_VHOST,
      channelNames: {
        events: process.env.ESB_CHANNEL_EVENTS,
      },
    },
    auth: {
      token: process.env.AUTH_TOKEN,
    },
  };
};
