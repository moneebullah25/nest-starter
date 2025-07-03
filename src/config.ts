import * as path from 'path';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

const NODE_ENV = process.env.NODE_ENV || 'dev';
const envPath = path.resolve(process.cwd(), `.env.${NODE_ENV}`);

const result = dotenv.config({ path: envPath });
dotenvExpand.expand(result);

if (result.error) {
  throw new Error(`❌ Failed to load env file at ${envPath}: ${result.error}`);
}

// Helper to ensure required env vars are set
function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
}

function getOptionalEnv(key: string, fallback = ''): string {
  return process.env[key] || fallback;
}

export default {
  jwt: {
    secretOrKey: getEnv('JWT_SECRET_KEY'),
    expiresIn: parseInt(getOptionalEnv('JWT_EXPIRES_IN', '86400'), 10),
  },
  mail: {
    service: {
      host: getEnv('SENDGRID_HOST'),
      port: parseInt(getOptionalEnv('SENDGRID_PORT', '587'), 10),
      secure: getOptionalEnv('SENDGRID_SECURE') === 'true',
      user: getEnv('SENDGRID_USER'),
      pass: getEnv('SENDGRID_PASS'),
    },
    senderCredentials: {
      name: getEnv('SENDER_NAME'),
      email: getEnv('SENDER_EMAIL'),
    },
  },
  project: {
    name: getEnv('PROJECT_NAME'),
    address: getEnv('PROJECT_ADDRESS'),
    logoUrl: getEnv('PROJECT_LOGO_URL'),
    slogan: getOptionalEnv('PROJECT_SLOGAN', 'Made with ❤️'),
    color: getOptionalEnv('PROJECT_COLOR', '#123456'),
    socials: [
      ['GitHub', getOptionalEnv('PROJECT_SOCIAL_GITHUB')],
      [
        getOptionalEnv('PROJECT_SOCIAL_1_NAME'),
        getOptionalEnv('PROJECT_SOCIAL_1_URL'),
      ],
      [
        getOptionalEnv('PROJECT_SOCIAL_2_NAME'),
        getOptionalEnv('PROJECT_SOCIAL_2_URL'),
      ],
    ],
    url: getEnv('PROJECT_URL'),
    mailVerificationUrl: getEnv('MAIL_VERIFICATION_URL'),
    mailChangeUrl: getEnv('MAIL_CHANGE_URL'),
    resetPasswordUrl: getEnv('RESET_PASSWORD_URL'),
    termsOfServiceUrl: getEnv('TERMS_OF_SERVICE_URL'),
  },
};
