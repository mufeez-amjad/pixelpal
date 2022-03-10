## This directory contains subdirectories for the landing page (`/client`) and backend server (`/server`)

The client is the front-end for the web app which will include a form to register a user's eth address with a pixelpal id, along with other static information about to project

The server will be the point of contact for both the landing page (address registration) AND the native app (getting list of nfts, etc)

Environment specific configuration for the server is specified in `/server/config`

You can run the server with `npm run build && npm run start` from within `/server`
