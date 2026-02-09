import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";

import { Pool } from "pg";
export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_CONNECTION_STRING,
  }),
  plugins: [
        magicLink({
            sendMagicLink: async ({ email, token, url }, ctx) => {
                // send email to user
            }
        })
    ],
});
