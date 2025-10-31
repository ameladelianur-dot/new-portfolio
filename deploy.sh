#!/bin/bash

# Portfolio Deployment Script
# This script helps deploy the portfolio to various hosting services

echo "🚀 Portfolio Deployment Script"
echo "=============================="

# Check if required files exist
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Project files found"

# Create deployment directory
DEPLOY_DIR="dist"
if [ -d "$DEPLOY_DIR" ]; then
    rm -rf "$DEPLOY_DIR"
fi
mkdir "$DEPLOY_DIR"

echo "📁 Created deployment directory: $DEPLOY_DIR"

# Copy files to deployment directory
cp index.html "$DEPLOY_DIR/"
cp -r css "$DEPLOY_DIR/"
cp -r js "$DEPLOY_DIR/"
cp -r assets "$DEPLOY_DIR/"

echo "📋 Copied project files to deployment directory"

# Minify CSS (if uglify-css is available)
if command -v uglifycss &> /dev/null; then
    echo "🔧 Minifying CSS..."
    uglifycss "$DEPLOY_DIR/css/styles.css" > "$DEPLOY_DIR/css/styles.min.css"
    # Update HTML to use minified CSS
    sed -i.bak 's/styles\.css/styles.min.css/g' "$DEPLOY_DIR/index.html"
    rm "$DEPLOY_DIR/index.html.bak"
    echo "✅ CSS minified successfully"
else
    echo "⚠️  uglifycss not found. Skipping CSS minification."
    echo "   Install with: npm install -g uglifycss"
fi

# Minify JavaScript (if uglify-js is available)
if command -v uglifyjs &> /dev/null; then
    echo "🔧 Minifying JavaScript..."
    uglifyjs "$DEPLOY_DIR/js/script.js" -o "$DEPLOY_DIR/js/script.min.js" -c -m
    # Update HTML to use minified JS
    sed -i.bak 's/script\.js/script.min.js/g' "$DEPLOY_DIR/index.html"
    rm "$DEPLOY_DIR/index.html.bak"
    echo "✅ JavaScript minified successfully"
else
    echo "⚠️  uglifyjs not found. Skipping JavaScript minification."
    echo "   Install with: npm install -g uglify-js"
fi

# Create .htaccess for Apache servers
cat > "$DEPLOY_DIR/.htaccess" << 'EOF'
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# Redirect to HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
EOF

echo "📄 Created .htaccess file for Apache servers"

# Create robots.txt
cat > "$DEPLOY_DIR/robots.txt" << 'EOF'
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
EOF

echo "🤖 Created robots.txt file"

# Create sitemap.xml
cat > "$DEPLOY_DIR/sitemap.xml" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://yourdomain.com/</loc>
        <lastmod>2024-01-01</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>
EOF

echo "🗺️  Created sitemap.xml file"

echo ""
echo "✅ Deployment preparation complete!"
echo ""
echo "📁 Deployment files are in the '$DEPLOY_DIR' directory"
echo ""
echo "🚀 Next steps:"
echo "1. Update the Google Analytics ID in index.html"
echo "2. Replace placeholder content with actual information"
echo "3. Add real images to the assets/images directory"
echo "4. Update robots.txt and sitemap.xml with your actual domain"
echo "5. Upload the contents of '$DEPLOY_DIR' to your web server"
echo ""
echo "🌐 Recommended hosting services:"
echo "   • Netlify (drag & drop deployment)"
echo "   • Vercel (Git-based deployment)"
echo "   • GitHub Pages (free for public repos)"
echo "   • Traditional web hosting (upload via FTP)"
echo ""
echo "📊 Don't forget to:"
echo "   • Set up Google Analytics"
echo "   • Configure SSL certificate"
echo "   • Test the website on mobile devices"
echo "   • Submit sitemap to Google Search Console"
echo ""
echo "🎉 Happy deploying!"