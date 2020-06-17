const DIR = __dirname //path to folder where images are stored
const FOLDER_NAME = "/images" //name of folder where images are stored

var path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') })

var imagesDir = path.join(DIR, FOLDER_NAME);
var serverDir = path.join(__dirname, 'dist');

var express = require('express');
var app = express();

var {
  Image, 
  DayWithImage, 
  LabelPoints, 
  sequelize
} = require('./mysql-functions/sequelize')

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
    let time = new Date();
    let flag = "";

    if (req.query.when) {
      time = req.query.when
    }   
    if (req.query.before) {
      time = req.query.before
      flag = "BEFORE"
    }   
    if (req.query.after) {
      time = req.query.after
      flag = "AFTER"
    }   
    
    const number = req.query.number ? req.query.number : 8
    console.log(time, flag)

    //look through database for the closest 
    const listOfImages = await Image.findByClosestTime( time , number , flag )
    if (!listOfImages) {
      return res.send("Could not get data") 
    }
    console.log(`Found ${listOfImages[0].length} images closest to ${time}`)
    res.json(listOfImages[0])
})  

app.get('/api/images-by-stars', async (req, res) => {
    console.log(req.query)
    const page = req.query.page ? req.query.page : 0  

    const images = await Image.findAll({ 
      offset: 8 * page ,
      limit: 8 ,
      order: [['stars', 'DESC']]
    }) 
    return res.json(images)
})

app.get('/api/days-with-data', async (req, res) => {
    const days = await DayWithImage.findAll({})
    return res.json(days)
})

app.post('/api/toggle-star', async (req, res) => {
  try {
    if (!req.query.id && !req.query.action) throw {message: "id or action not found"}
    const id = req.query.id
    const action = req.query.action
    if (action === "ADD") {
      console.log(`Adding Star to ${id}`)
      Image.update({ stars : sequelize.literal('stars + 1') }, { where: { filePath: req.query.id } });
      res.sendStatus(200)
    } 
    else if (action === "REMOVE") {
      console.log(`Removing Star from ${id}`)
      Image.update({ stars : sequelize.literal('stars - 1') }, { where: { filePath: req.query.id } });
      res.sendStatus(200)
    } 
    else throw {message: "action did not match"}
  } catch (err) {
    console.log(`Unsuccessful Toggle Star : ${err.message}`)
    res.sendStatus(403)
  }
})

app.listen(process.env.PORT || 80, function () {
    console.log(`Listening on http://localhost:${process.env.PORT || 80}/`);
}); 