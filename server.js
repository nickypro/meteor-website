const DIR = __dirname //path to folder where images are stored
const FOLDER_NAME = "/images" //name of folder where images are stored

var path = require('path');
var imagesDir = path.join(DIR, FOLDER_NAME);
var serverDir = path.join(__dirname, 'dist');

var express = require('express');
var app = express();

var Image = require('./mysql-functions/sequelize')
var updateImagesDatabase = require('./mysql-functions/updateImagesDatabase')

//Logger
const logger = (req, res, next) => {
  console.log(`${new Date().toUTCString()} - ${req.method} ${req.path} - ${req.ip}`);
  next();
}
app.use(logger)

app.use('/images', express.static(imagesDir));
app.use('/', express.static(serverDir));

//initialise database with files
updateImagesDatabase(__dirname, "/images")

//handle requests looking for a certain asteroid /images-by-date?when=X&number=10
app.get('/api/images-by-date', async (req, res) => { 
    const when   = req.query.when   ? req.query.when   : new Date()
    const number = req.query.number ? req.query.number : 8
    console.log(when)

    //look through database for the closest 
    const listOfImages = await Image.findByClosestTime( when , number )
    if (!listOfImages) {
      return res.send("Could not get data") 
    }
    console.log(`Found ${listOfImages[0].length} images closest to ${when}`)
    res.json(listOfImages[0])
})  

app.get('/api/')

app.listen(3000, function () {
    console.log('Listening on http://localhost:3000/');
}); 