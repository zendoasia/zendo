#!/bin/sh

if [ "$(echo "$SRV_DEV" | tr '[:upper:]' '[:lower:]')" = "true" ]; then
  echo "SRV_DEV is true, running development server..."
  npm run dev
else
  echo "SRV_DEV is not true, running production server..."
  npm run start
fi
