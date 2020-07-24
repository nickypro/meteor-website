# meteor-website
DIAS meteor database website

Front-end website for viewing meteor images, filtering with searches and labeling the images.

Looks for RMS-style image files from AllSky/RaspberryPi, parses the camera name and event timestamp, and adds the entry to a MySQL database.

## Setup
- First, `git clone https://github.com/pesvut/meteor-website.git`
- Install packages: `npm install`
- Add MySQL credentials to /credentials/mysql.json in this format:
```
{
  "host": "",
  "user": "",
  "password": "",  
  "database": "",
  "port": 3306
}
```

- create a .env file and add `PORT=8080` (or if using systemd add `Environment=PORT=8080`), but replace 8080 with whatever port you would like to host on
- (optional) add .env variable `SERVE_IMAGES=1` if using the built in images server (it is reccomended to use the standalone one unless testing)
- edit the `src/config.json` and change below to match server configuration:
```
  "imageDomain": "https://meteor-data.ap.dias.ie/",
  "imagePath": "/meteors-data/",
```
- build the server using `npm run build`
- (optional) change root homepage path from /meteors to something else: change in 
`/package.json` `"homepage": "/meteors"` and 
`/src/config.json` `"homapage": "/meteors"` 
- run the process with either `node server.js` (or create a systemd process with /usr/bin/node etc...)

## Updating
- run the following command to update: 
```
git pull && \
npm install && \
npm audit fix && \
npm run build
```
- start the server again `node server.js`

## Configuring a systemd service
Create a system file in `/lib/systemd/system/`, change `/path/to/meteor-website/` to wherever the directory is located, and optionally uncomment `#User=pi` to change to whatever you user you want it to be run by. 
```
[Unit]
Description=server.js - runs the dias meteor images website
Documentation=https://github.com/pesvut/meteor-website
After=network.target

[Service]
Environment=NODE_PORT=8080
Type=simple
#User=pi
ExecStart=/usr/bin/node /path/to/meteor-website/server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target

```