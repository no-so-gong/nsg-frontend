import 'dotenv/config';

export default {
  expo: {
    name: "nsg-frontend-template",
    slug: "nsg-frontend-template",
    version: "1.0.0",
    extra: {
      API_URL: process.env.API_URL,
    },
  },
};
