//requiring path and fs modules
const path = require('path');
const fs = require('fs');
const dateFormat = require('dateformat')

const parseFilesInFolder = require('./parseFilesInFolder')
const {Image, DayWithImage} = require('./sequelize')

function updateImagesDatabase(dir = __dirname, subdir = "/images") {
  
  //joining path of directory 
  const directoryPath = path.join(dir, subdir);
  const folderPath = (folderName) => path.join(dir, subdir, folderName)

  //passsing directoryPath and callback function
  const folders = fs.readdirSync(directoryPath)

  let array = []

  //listing all folders
  folders.forEach(folder => {
    array = [...array, ...parseFilesInFolder(folder, folderPath(folder))] 
  })

  console.log(`Array: ${array.length}`)
  console.log(array[0])

  Image.sync().then(() => 
    Image.bulkCreate(array, {
      updateOnDuplicate: ["date"] 
    })
  )

  DayWithImage.sync().then(() => {
    let daysSet = new Set() 
    for (let i in array) {
      daysSet.add(dateFormat(array[i].date, "yyyy-mm-dd", true))
    }
    let daysArray = [...daysSet]
    daysArray = daysArray.map(day => ({day: day}) )

    DayWithImage.bulkCreate(daysArray, {
      updateOnDuplicate: ["day"]
    })
  })

}

module.exports = updateImagesDatabase
