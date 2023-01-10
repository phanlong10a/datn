import * as Joi from 'joi';

export const validate = Joi.object({
  PORT: Joi.number().default(3000),
  REDIS_PORT: Joi.number().default(6379),
  DATABASE_URL: Joi.string(),
  SERVER_URL: Joi.string(),
  // social
  FACEBOOK_CLIENT_ID: Joi.number(),
  FACEBOOK_CLIENT_SECRET: Joi.string(),
  GOOGLE_CLIENT_ID: Joi.string(),
  GOOGLE_CLIENT_SECRET: Joi.string(),

  // jwt
  JWT_AT_EXPRIED: Joi.string(),
  JWT_AT_SECRET: Joi.string(),

  JWT_RT_SECRET: Joi.string(),
  JWT_RT_EXPRIED: Joi.string(),

  //locamos application
  LOCAMOS_CLIENT_ID: Joi.string(),
  LOCAMOS_CLIENT_SECRET: Joi.string(),

  /**3ND identify */
  APP_DOMAIN: Joi.string(),
  HEADER_CLIENTID: Joi.string(),
  HEADER_SECRETID: Joi.string(),
  APP_USERNAME: Joi.string(),
  APP_PASSWORD: Joi.string(),
  /**Google map */
  GOOGLE_MAP_API_KEY: Joi.string(),
});
