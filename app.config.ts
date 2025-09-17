import 'dotenv/config';

export default {
  expo: {
    name: "nsg-frontend-template",
    slug: "nsg-frontend-template",
    version: "1.0.0",
    sdkVersion: "54.0.0",
    orientation: 'portrait',
    extra: {
      API_URL: process.env.API_URL,
    },
    // splash: {
    //   image: "./assets/NSG-logo.png",
    //   resizeMode: "contain",
    //   backgroundColor: "#ffffff",
    // },
    ios: {
      supportsTablet: true,
    },
    // android: {
    //   adaptiveIcon: {
    //     foregroundImage: "./assets/NSG-logo.png",
    //     backgroundColor: "#ffffff",
    //   },
    //   edgeToEdgeEnabled: true,
    // },
    // web: {
    //   favicon: "./assets/NSG-logo.png",
    // },
  },
};
