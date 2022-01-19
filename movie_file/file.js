const fs = require("fs");
const { CreateBaseFileException, WriteFileException } = require('../exceptions/fileException')
const { ACTION, joinTextWithIndex } = require('../utils') 

function readTextFromFile() {
  try {
    const data = fs.readFileSync('movies.txt', 'utf8')
    return data.toString()
  } catch (err) {
    console.error(err)
    return err
  }
}

function createBaseFile() {
  try {
    fs.closeSync(fs.openSync('./movie_file/movies.txt', 'w'))
  } catch {
    throw new CreateBaseFileException() 
  }
}

async function overwritePreviousFile(movieObj, action) {
  try {
    let text = '(∩ᵔ-ᵔ)⊃━☆ﾟ.mOvIeS: eMpTy*･｡ﾟ'
    if(movieObj.all_movies.length > 0) {
      const allMoviesText = movieObj.all_movies.map(movie => movie.line_text)
      text = joinTextWithIndex(allMoviesText)
    }
    writeTextToFile(text)
  } catch(e) {
    throw e
  }  
}

function writeTextToFile(text) {
  try {
    fs.writeFileSync('movie_file/movies.txt', text, 'utf-8')
  } catch {
    throw new WriteFileException()
  }
}

module.exports = { overwritePreviousFile, createBaseFile, writeTextToFile }
