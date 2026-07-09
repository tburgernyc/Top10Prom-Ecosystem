import type { Config } from 'drizzle-kit';

if (!process.env['DATABASE_URL_DIRECT']) {
  throw new Error('DATABASE_URL_DIRECT is required for Drizzle Kit. Check .env');
}

export default {
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env['DATABASE_URL_DIRECT'],
  },
  tablesFilter: [
    'tenants', 'users', 'customers', 'boutique_staff', 'dresses',
    'dress_inventory', 'appointments', 'walk_ins', 'vto_sessions',
    'client_style_profiles', 'dress_reservations', 'bridal_parties',
    'bridal_party_members', 'dress_vote_sessions', 'dress_votes',
    'guardian_profiles', 'guardian_portal_tokens', 'guardian_notifications'
  ],
  schemaFilter: ['public'],
  verbose: true,
  strict: true,
} satisfies Config;
