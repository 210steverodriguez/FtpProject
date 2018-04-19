var chokidar = require('chokidar');
var PromiseFtp = require('promise-ftp');

var ftp = new PromiseFtp();

//queue for items to send to ftp remote dir
var queue = [];

//ftp server info and credentials
var serverInfo = {
  host: "ftp.dlptest.com",
  user: "dlpuser@dlptest.com",
  password: "eiTqR7EMZD5zy7M"
};

function sendFile() {
  console.log("Sendfile Running");
  //check if something is in queue
  if(queue[0]){
    let currentFile = queue.pop();

    //Send file via ftp
    ftp.put(currentFile.path, currentFile.filename).then(function(){
      //Output the current file being sent
      console.log("File" + currentFile.filename + " sent");
      return ftp.list('/');
    }).then(function (list) {
      //Check if File exists in destination maybe compare size
      //If file does not exist add back to queue
      //Else delete original file in source location
      console.log(queue);
    });
  }
};

//Setting interval to check if something needs to be sent
setInterval(sendFile, 3500);

// start ftp with promise into watcher
ftp.connect(serverInfo).then(function (serverMessage) {

  //Output server message if FTP has one
  console.log(serverMessage);

  // set chokidar to watch watchedDir
  chokidar.watch('app/watchedDir/*', {
    ignored: /(^|[\/\\])\../,
    //
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100
    }
  })
    .on('all', (event, path) => {

      //output event and path
      console.log(event, path);
      if (event == "add") {
        let filename = path.split('/')[2];
        let fileInfo = {
          path: path,
          filename: filename
        };
        queue.push(fileInfo);
      }
    });
});

console.log("Ayyyye");