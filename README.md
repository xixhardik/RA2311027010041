## RA2311027010041
Folders 

logging_middleware/
notification_app_be/
notification_app_fe/
notification_system_design.md
README.md
.gitignore
Stage 1

Set your access token in PowerShell:
$env:ACCESS_TOKEN="paste_your_access_token_here"

Run the Stage 1 script:
cd notification_app_be
npm install
npm run stage1

Frontend
Run the React app:
cd notification_app_fe
npm install
npm run dev

Open:
http://localhost:3000

Paste your Bearer token into the token field and click Refresh.
Optional Backend Server
cd notification_app_be
npm install
npm start

Server URL:
http://localhost:4000

## Build Frontend
cd notification_app_fe
npm run build   
