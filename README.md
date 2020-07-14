# meteor-website
DIAS meteor database website

Front-end website for viewing meteor images, filtering with searches and labeling the images.

Looks for RMS-style image files from AllSky/RaspberryPi, parses the camera name and event timestamp, and adds the entry to a MySQL database.

## Setup
- First, `git clone https://github.com/pesvut/meteor-data-server.git`
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
"imageDomain": "<HOST_DOMAIN>", 
"imagePath": "<FOLDER_TO_MATCH_DATABASE>",
```
- build the server using `npm run build`
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
