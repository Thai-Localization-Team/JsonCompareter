const fs = require('fs');
const path = require('path');

const dir = path.dirname(process.execPath);

let log = ""

const loging = (text) => {
  console.log(text);
  log = log + "\n" + text;
  fs.writeFileSync(path.join(dir,'log.txt'), log);
}

const replaceJson = (jsonValue, jsonKay) => {
  const kays = Object.keys(jsonKay)
  for (const key of kays) {
    if (jsonValue.hasOwnProperty(key)) {
      if (typeof jsonKay[key] == "object") {
        jsonKay[key] = replaceJson(jsonKay[key], jsonValue[key])
      } else {
        jsonKay[key] = jsonValue[key]
      }
    }
  }
  return jsonKay
}

const compareJson = (value, kay) => {
  // Read the contents of the JSON files
  const jsonValue = JSON.parse(fs.readFileSync(value, 'utf8'))
  const jsonKay = JSON.parse(fs.readFileSync(kay, 'utf8'))
  const data = replaceJson(jsonValue, jsonKay)
  fs.writeFileSync(path.join(dir, "/out", path.basename(kay)), JSON.stringify(data,null, 2))
}

const compareJsonFiles = (files) => {
  files.forEach((file) => {
    keyFile = path.join(dir, "/key", file)
    valueFile = path.join(dir, "/value", file)
    try{
      const stat = fs.statSync(keyFile)
      const valueStat = fs.statSync(valueFile)
      if (stat.isDirectory()) {
        compareJsonFiles(fs.readdirSync(keyFile))
      } else if (stat.isFile()) {
        if (file.endsWith('.json')) {
          compareJson(valueFile, keyFile)
        }
      }
    }catch(error){
      loging(error)
    }
  })
}

const setup = () => {
  keyDir = path.join(dir, "/key" )
  valueDir = path.join(dir, "/value")
  outDir = path.join(dir, "/out")
  try{
    fs.statSync(keyDir)
  }catch(error){
    fs.mkdirSync(keyDir)
    loging(error)
  }
  try{
    fs.statSync(valueDir)
  }catch(error){
    fs.mkdirSync(valueDir)
    loging(error)
  }
  try{
    fs.statSync(outDir)
  }catch(error){
    fs.mkdirSync(outDir)
    loging(error)
  }
}

setup()
compareJsonFiles(fs.readdirSync(path.join(dir, "/key")))