import { sql } from 'drizzle-orm'

import { createClient } from '@/src/client'

const { db, pg } = await createClient()

try {
  await db.execute(sql`
    DO $$
    DECLARE 
        schema_name text;
    BEGIN
        FOR schema_name IN 
            SELECT nspname 
            FROM pg_namespace
            WHERE nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
        LOOP
            EXECUTE 'DROP SCHEMA ' || quote_ident(schema_name) || ' CASCADE';
        END LOOP;

        IF NOT EXISTS (
          SELECT 1 FROM pg_namespace WHERE nspname = 'public'
        ) THEN
          EXECUTE 'CREATE SCHEMA public';
        END IF;
    END$$;
  `)
  await pg.end()
  console.log(`✅ Database reset complete`)
} catch (error) {
  await pg.end()
  console.error(error)
  throw error
}
