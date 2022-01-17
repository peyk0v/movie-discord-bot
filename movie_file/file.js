const fs = require("fs");
const { CreateBaseFileException, WriteFileException } = require('../exceptions/fileException')

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

async function overwritePreviousFile(movieObj) {
  try {
    const previousMovies = movieObj.all_movies.map(movie => movie.line_text)
    const allMovies = previousMovies.concat(movieObj.new_movie.line_text)
    const text = allMovies.join('\n')
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
/*
function writeTextToFile(textToWrite) {
  fs.appendFile('movies.txt', textToWrite, function (err) {
    if (err) throw new WriteFileException();
    console.log('Saved!');
  });
}*/

/*
function updateMovieLine(newData, commandLine) {
  const editLine = movieLine(commandLine)
  const wholeText = readTextFromFile()
  const searchRegex = editLine + "\\..*\\n"
  const realRegex = new RegExp(searchRegex, 'im')
  console.log(realRegex.toString())
  const formattedText = formatMovieText(newData, editLine);
  const textToWrite = formattedText + '\n';

  if(wholeText.match(realRegex)) {
    console.log('MATCHEO LA REGEX')
  }

  const newText = wholeText.replace(realRegex, textToWrite)
  console.log('text to write: ' + newText)
  try {
    fs.writeFileSync('movies.txt', newText, 'utf-8');
  } catch (err) {
    return err
  }
}
*/
