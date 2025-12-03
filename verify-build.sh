#!/bin/bash
# This file verifies Vercel is building from the correct repository state
# If you see this error, your Vercel project is building from stale/cached Git data

echo "=========================================="
echo "VERCEL BUILD VERIFICATION"
echo "=========================================="
echo ""
echo "Expected: This file should exist if building from latest commit"
echo "Commit that added this file: $(git log -1 --format='%H %s')"
echo ""
echo "If you see 'package.json has @google/genai', STOP THE BUILD!"
echo "The correct package should be: @google/generative-ai"
echo ""
echo "Checking package.json..."
if grep -q "@google/genai" package.json; then
  echo "❌ ERROR: Found @google/genai (OLD/BROKEN)"
  echo "❌ Vercel is building from WRONG/STALE commit!"
  echo "❌ Go to Vercel Dashboard and:"
  echo "   1. Settings → Git"
  echo "   2. Disconnect and reconnect repository"
  echo "   3. Or manually select latest commit to deploy"
  exit 1
else
  echo "✅ Correct: Found @google/generative-ai"
fi
echo ""
echo "Build can proceed..."

