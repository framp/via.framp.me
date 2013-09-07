var fs = require('fs')
  , path = require('path')
  , app = {}
  , base = {
      dir: path.join(__dirname, '/links/')
    , url: 'http://via.framp.me/'
    }
    
/* init
 * Initialize the application given process.argv
 */

app.init = function(){
  var args = process.argv.slice(2);
  if (!args[0] || !(args[0] in app))
    args.unshift('create');
  app[args.shift()].apply(this, args);
}

/* list
 * List stored links
 */

app.list = function(){
  fs.readdirSync(base.dir).forEach(function(dir){
    console.log(dir, require(path.join(base.dir, dir)).url);
  });
};

/* regenerate
 * Regenerate the redirect page with a given template
 */

app.regenerate = function(){
  var template = fs.readFileSync('./template.html', { encoding: 'utf8' });
  fs.readdirSync(base.dir).forEach(function(dir){
    var url = require(path.join(base.dir, dir)).url
    var result = template.replace(/{url}/g, url);
    fs.writeFileSync(path.join(base.dir, dir, '/index.html'), result)
  });
}

/* create
 * Create a new redirect page
 * Optionally accepts a name (if not already used)
 */

app.create = function(url, name){
  if (!url)
    return;
  url = link.replace(/"/g,'\"');
  while(!name || fs.existsSync(path.join(base.dir, name))){
    name = Math.random().toString(36).substring(2,7);
  }
  var template = fs.readFileSync('./template.html', { encoding: 'utf8' });
  var result = template.replace(/{url}/g, url);
  
  var dir = path.join(base.dir, name);
  var url =  path.join(base.url, name);
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, '/index.html'), result)
  fs.writeFileSync(path.join(dir, '/index.json'), '{"url":"' + url + '"}')
  
  console.log(url);
}

app.init();