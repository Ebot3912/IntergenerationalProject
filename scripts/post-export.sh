#!/bin/bash
# Run after `npx expo export --platform web` to fix fonts for Vercel deployment
# Usage: bash scripts/post-export.sh

DIST_DIR="dist"

echo "📦 Post-export: Fixing fonts for Vercel..."

# 1. Copy font files to /fonts/ (Vercel blocks node_modules paths)
mkdir -p "$DIST_DIR/fonts"
cp "$DIST_DIR/assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/"*.ttf "$DIST_DIR/fonts/" 2>/dev/null

# 2. Inject @font-face declarations into index.html
FONT_CSS=""
for ttf in "$DIST_DIR/fonts/"*.ttf; do
  filename=$(basename "$ttf")
  family=$(echo "$filename" | sed 's/\..*//')
  FONT_CSS="$FONT_CSS\n      @font-face { font-family: '$family'; src: url('/fonts/$filename') format('truetype'); font-display: swap; }"
done

# Insert font CSS before </head>
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s|</style>|</style><style id=\"expo-icon-fonts\">$FONT_CSS\n    </style>|" "$DIST_DIR/index.html"
else
  sed -i "s|</style>|</style><style id=\"expo-icon-fonts\">$FONT_CSS\n    </style>|" "$DIST_DIR/index.html"
fi

# 3. Add vercel.json with font rewrites
cat > "$DIST_DIR/vercel.json" << 'VERCEL'
{
  "rewrites": [
    {
      "source": "/assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/:file",
      "destination": "/fonts/:file"
    },
    {
      "source": "/((?!_expo|assets|fonts|favicon.ico).*)",
      "destination": "/index.html"
    }
  ]
}
VERCEL

# 4. Copy index.html to 200.html for SPA fallback
cp "$DIST_DIR/index.html" "$DIST_DIR/200.html"

echo "✅ Done! Now run: vercel deploy dist/ --yes --prod"
