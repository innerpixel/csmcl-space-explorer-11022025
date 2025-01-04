#!/bin/bash

# Kill any process running on port 3000
kill $(lsof -t -i:3000) 2>/dev/null || true

# Start the dev server
npm run dev
