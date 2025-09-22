import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

const NODE_ENV = process.env.NODE_ENV || 'dev';
const envFileMap: Record<string, string> = {
  production: '.env.prod',
  development: '.env.dev',
  dev: '.env.dev',
  test: '.env.test',
};
const mappedEnvFile = envFileMap[NODE_ENV] || `.env.${NODE_ENV}`;
const envPath = path.resolve(process.cwd(), mappedEnvFile);

// Only load .env.* file if it exists. In containers we use env vars via compose.
if (fs.existsSync(envPath)) {
  const result = dotenv.config({ path: envPath });
  dotenvExpand.expand(result);
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
