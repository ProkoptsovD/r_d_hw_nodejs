export default () => ({
  SECRET: process.env.SECRET || 'im_rd_student',
  SECRET_API_HEADER: process.env.SECRET_HEADER || 'x-api-key',
  PORT: Number(process.env.PORT || 3000),
  HOST: process.env.HOST || 'localhost',
});
