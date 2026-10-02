#!/bin/bash

# CP2B PILAR-2b Frontend Update Script
# To be executed on the production server (lucas@cp2b-web)

set -e

FRONTEND_DIR="/var/www/pilar2b/repo/cp2b-workspace/NewLook/frontend"
ENV_FILE="$FRONTEND_DIR/.env"

echo "🚀 Starting PILAR-2b Frontend Update..."

# 1. Navigate to frontend directory
cd "$FRONTEND_DIR" || { echo "❌ Error: Directory $FRONTEND_DIR not found"; exit 1; }

# 2. Update Environment Variables safely
echo "📝 Updating environment variables..."
read -p "Enter NEXT_PUBLIC_SUPABASE_URL: " SUPABASE_URL
read -p "Enter NEXT_PUBLIC_SUPABASE_ANON_KEY: " SUPABASE_KEY

# Create or overwrite .env with the new keys
cat <<EOF > "$ENV_FILE"
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_KEY
# Ensure other required variables are set if needed
EOF

echo "✅ .env updated."

# 3. Install dependencies (specifically sharp for image optimization)
echo "📦 Installing sharp and other dependencies..."
npm install sharp

# 4. Rebuild the application
echo "🏗️ Building Next.js application..."
npm run build

# 5. Sync standalone assets
echo "📁 Syncing static assets to standalone folder..."
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

# 6. Restart PM2 process
echo "🔄 Restarting PM2 process 'pilar-frontend'..."
pm2 restart pilar-frontend --update-env

# 7. Final reminder for Apache
echo "✨ Build and restart complete."
echo "⚠️ Remember to apply the updated Apache configuration if you haven't already:"
echo "   sudo cp /path/to/updated/cp2b.conf /etc/apache2/sites-enabled/cp2b.conf"
echo "   sudo systemctl restart apache2"

echo "✅ All done!"
