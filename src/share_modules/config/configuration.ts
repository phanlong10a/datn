export default () => ({
  port: process.env.PORT || 4000,
  server_url: process.env.SERVER_URL,
  redis_port: process.env.REDIS_PORT || 6379,
  // social
  facebook: {
    clientId: Number(process.env.FACEBOOK_CLIENT_ID),
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  google_map_api_key: process.env.GOOGLE_MAP_API_KEY,
  //jwt
  jwt: {
    accessToken: {
      secret: process.env.JWT_AT_SECRET,
      expired: process.env.JWT_AT_EXPRIED,
    },
    refreshToken: {
      secret: process.env.JWT_RT_SECRET,
      expired: process.env.JWT_RT_EXPRIED,
    },
  },

  locamos_application: {
    client_id: process.env.LOCAMOS_CLIENT_ID,
    client_secret: process.env.LOCAMOS_CLIENT_SECRET,
  },

  web_service: {
    client_id: process.env.HEADER_CLIENTID,
    client_secret: process.env.HEADER_SECRETID,
    app_username: process.env.APP_USERNAME,
    app_password: process.env.APP_PASSWORD,
  },
  web_search: process.env.SEARCH_URL,
});
