var fs = require('fs')
  , path = require('path')
  , app = {}
  , base = {
      dir: __dirname
    , url: 'http://via.framp.me/'
    }
  , templateFile = 'template.html'
  , dirExceptions = {
    '.git': 1
  }

/* walkDirectories
 * Loop over stored links directories
 */

function walkDirectories(cb){
  fs.readdirSync(base.dir).forEach(function(dir){
    var stat = fs.statSync(path.join(base.dir, dir));
    if (stat.isDirectory() && !(dir in dirExceptions))
      cb.call(this, dir);
  });
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
  walkDirectories(function(dir){
    console.log(dir, require(path.join(base.dir, dir)).url);
  });
};

/* regenerate
 * Regenerate the redirect page with template
 */

app.regenerate = function(){
  var template = fs.readFileSync(path.join(base.dir, templateFile), { encoding: 'utf8' });
  walkDirectories(function(dir){
    var url = require(path.join(base.dir, dir)).url;
    var result = template.replace(/{url}/g, url);
    fs.writeFileSync(path.join(base.dir, dir, '/index.html'), result)
  });
}

/* remove
 * Remove a redirect page
 */

app.remove = function(name){
  var dir = path.join(base.dir, name);
  fs.unlinkSync(path.join(dir, 'index.html'));
  fs.unlinkSync(path.join(dir, 'index.json'));
  fs.rmdirSync(dir);
}

/* create
 * Create a new redirect page
 * Optionally accepts a name (if not already used)
 */

app.create = function(url, name){
  if (!url)
    return;
  url = url.replace(/"/g,'\"');
  while(!name || fs.existsSync(path.join(base.dir, name))){
    name = Math.random().toString(36).substring(2,7);
  }
  var template = fs.readFileSync(path.join(base.dir, templateFile), { encoding: 'utf8' });
  var result = template.replace(/{url}/g, url);
  
  var dir = path.join(base.dir, name);
  var shortenedUrl = base.url + '/' + name;
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, '/index.html'), result)
  fs.writeFileSync(path.join(dir, '/index.json'), '{"url":"' + url + '"}')
  
  console.log(shortenedUrl);
}

app.init();
