/* eslint-disable @typescript-eslint/no-var-requires */
// jest-env-runner.js
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { spawn } from 'child_process';

// Load and expand environment variables
const myEnv = dotenv.config({ path: '.env.test' });
dotenvExpand.expand(myEnv);

// Run jest with expanded env
const child = spawn(
  'npx',
  ['jest', '--bail', '--findRelatedTests', ...process.argv.slice(2)],
  {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env },
  },
);

child.on('exit', process.exit);
