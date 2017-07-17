const fs = require('fs')
const path = require('path')

const domain = fs.readFileSync('./CNAME', { encoding: 'utf8' })
const baseURL = `http://${domain}`
const templateFile = 'template.html'

const url = process.argv[2]
let name = process.argv[3]

if (!url) {
  console.error("URL not provided")
  process.exit(1)
}
while(!name || fs.existsSync(path.join(__dirname, name))){
  name = Math.random().toString(36).substring(2,7)
}
const template = fs.readFileSync(path.join(__dirname, templateFile), { encoding: 'utf8' })
const result = template.replace(/{url}/g, url)

const dir = path.join(__dirname, name)
const shortenedUrl = baseURL + '/' + name
fs.mkdirSync(dir)
fs.writeFileSync(path.join(dir, '/index.html'), result)

console.log(shortenedUrl)