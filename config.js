export const getDBUrl = () =>
  process.env.NODE_ENV === 'production'
    ? process.env.PROD_DB_URL
    : process.env.DEV_DB_URL;

export const getJwtSecret = () =>
  process.env.NODE_ENV === 'production'
    ? process.env.PROD_JWT_SECRET
    : process.env.DEV_JWT_SECRET;

export const getJwtExpiresIn = () =>
  process.env.NODE_ENV === 'production'
    ? Number(process.env.PROD_JWT_EXPIRES_IN)
    : Number(process.env.DEV_JWT_EXPIRES_IN);
