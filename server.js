const config = require('./src/config.json')
const labels = config.labels

const DIR = __dirname //path to folder where images are stored
const FOLDER_NAME = "/images" //name of folder where images are stored

var path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') })

var serverDir = path.join(__dirname, 'build');

const DEFAULT_NUMBER = 42
var express = require('express');
var app = express();

const packagejson = require('./package.json')
let homepages = ["/"]
if (packagejson.homepage) {
  homepages = [packagejson.homepage, ...homepages]
}
console.log(homepages)

var {
  Image, 
  DayWithImage, 
  LabelPoints, 
  sequelize
} = require('./mysql-functions/sequelize')

if ( process.env.SERVE_IMAGES && process.env.SERVE_IMAGES != 0 ){
  var imagesDir = path.join(DIR, FOLDER_NAME);
  var updateImagesDatabase = require('./mysql-functions/updateImagesDatabase')
  app.use('/images', express.static(imagesDir));
  //initialise database with files
  updateImagesDatabase(__dirname, "/images")
}

//Logger
const logger = (req, res, next) => {
  console.log(`${new Date().toUTCString()} - ${req.method} ${req.path} - ${req.ip}`);
  next();
}
app.use(logger)
 
//▒   ▒▒▒ ▒▒▒ ▒▒▒
//▒   ▒ ▒ ▒ ▒ ▒_▒ Main App Routes Code
//▒▒▒ ▒▒▒ ▒▒▒ ▒    

homepages.forEach( homepage => {  
//Loop through homepages
console.log("Adding route: ", homepage)
//serve the website
app.use(homepage, express.static(serverDir));

//handle requests looking for a certain asteroid /images-by-date?when=X&number=10
app.get(path.join(homepage + '/api/images-by-date'), async (req, res) => { 
  try {
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
    
    const number = req.query.number ? req.query.number : DEFAULT_NUMBER
    console.log(time, flag)

    const label = req.query.label
    const filters = label ? {label} : {}

    //look through database for the closest 
    const listOfImages = await Image.findByClosestTime( time, {number, flag, filters })
    if (!listOfImages) {
      return res.send("Could not get data") 
    }
    console.log(`Found ${listOfImages[0].length} images closest to ${time}`)
    res.json(listOfImages[0])
  
    // Handle Errors
  } catch (err) {
    console.log("ERROR : ", err.message)
    res.status(503).json(err)
  }
})  

app.get(path.join(homepage + '/api/images-by-stars'), async (req, res) => {
  try {
    console.log(req.query)
    const page = req.query.page ? req.query.page : 0  
    const label = req.query.label
    const number = req.query.number ? req.query.number : DEFAULT_NUMBER

    const images = await Image.findAll({ 
      offset: number * page ,
      limit: number ,
      order: [['stars', 'DESC']],
      where: (label) ? {label: label} : undefined,
    }) 
    return res.json(images)

    // Handle Errors
  } catch (err) {
    console.log("ERROR : ", err.message)
    res.status(503).json(err)
  }
})

app.get(path.join(homepage + '/api/days-with-data'), async (req, res) => {
  try {
    const days = await DayWithImage.findAll({})
    return res.json(days)

    // Handle Errors
  } catch (err) {
    console.log("ERROR : ", err.message)
    res.status(503).json(err)
  }
})

app.post(path.join(homepage + '/api/submit-label'), async (req, res) => {
  try {
    const id = req.query.id
    const label = req.query.label
    if (!id | !label) return;
    
    const imageData = await LabelPoints.findOrCreate({where: {filePath: id}})
    const imagePoints = imageData[0].dataValues
    imagePoints[label] += 1
    
    LabelPoints.increment(label, {where: {filePath: id}})

    let max = 0
    let maxLabel
    for (L of labels) {
      if (imagePoints[L] > max) {
        maxLabel = L
        max = imagePoints[L]
      }  
    }
    console.log(`${id} : MAX IS ${maxLabel} - ${max}`)

    await Image.update({label: maxLabel}, {where: {filePath: id}})

    res.sendStatus(200)

    // Handle Errors
  } catch (err) {
    console.log("ERROR : ", err.message)
    res.status(503).json(err)
  }

})

app.post(path.join(homepage + '/api/toggle-star'), async (req, res) => {
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
  
    // Handle Errors
  } catch (err) {
    console.log(`Unsuccessful Toggle Star : ${err.message}`)
    res.status(503).json(err)
  }
})

}) // END OF LOOP THROUGH homepages

app.listen(process.env.PORT || 80, function () {
    console.log(`Listening on http://localhost:${process.env.PORT || 80}/`);
}); 