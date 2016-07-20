/**
 * Created by alykoshin on 12.07.16.
 */


Router.route('/', function () {
  this.render('index');
});

Router.route('/main', function () {
  this.render('main');
});

Router.route('/listPages', function () {
  this.render('listPages');
});


Router.route('/wallboard', function () {
  this.render('wallboard');
});

Router.route('/wallboard/queue/:queue', function () {
  this.render('_wbQueueInfo', { data: { queueName: this.params.queue } });
});

Router.route('/wallboard/queueList', function () {
  this.render('_wbQueueList', { data: {} });
});


// Server-only route
Router.route('/recordings/:filename', function (){

  var fs = Npm.require('fs');
  const path = 'http://172.20.200.13:3001/';
  var filename = this.params.filename;
  var pathname = path + filename; // make sure to validate input here

  // read the file
  try {
    var chunk = fs.createReadStream(pathname);
  } catch(e) {
    this.response.send(404);
    return;
  }

  // prepare HTTP headers
  var headers = {}, // add Content-type, Content-Lenght etc. if you need
      statusCode = 200; // everything is  OK, also could be 404, 500 etc.

  this.response.writeHead(200, {
    'Content-Type': 'application/zip',
    'Content-disposition': 'attachment; filename='+filename
  });

  try {
    chunk.pipe(this.response);
  } catch(e) {
    this.response.send(404);
    return;
  }


}, { where: "server" });

// }
