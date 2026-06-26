import { config } from 'dotenv'
import path from 'path'
import { defineConfig, env } from 'prisma/config'

// Force dotenv to load Next.js's .env.local file explicitly
config({ path: path.join(process.cwd(), '.env.local') })

export default defineConfig({
    schema: './prisma/schema.prisma',
    datasource: {
        // This will now successfully resolve from your .env.local
        url: env('DIRECT_URL'),
    },
})