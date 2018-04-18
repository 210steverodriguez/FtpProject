var chokidar = require('chokidar');

// set chokidar to watch watchedDir
chokidar.watch('app/watchedDir/*', {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {

  console.log(event, path);

});



console.log("Ayyyye");