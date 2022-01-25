const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  
  const removeFile = (fpath) => fs.unlink(fpath, () => {});

  if (pathname.indexOf('/') >= 0) {
    res.statusCode = 400;
    res.end('Subfolders are not supported.');
  }

  switch (req.method) {
    case 'POST':
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
      const limitedStream = new LimitSizeStream({limit: 1000000});

      writeStream.on('finish', () => {
        res.statusCode = 201;
        res.end('Saved!');
      });

      writeStream.on('error', (error) => {
        if (error.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File already exists.');
          return;
        }

        res.statusCode = 500;
        res.end('Server error.');
      });

      limitedStream.on('error', (error) => {
        if (error.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end('File must be 1Mb at max.');
        } else {
          res.statusCode = 500;
          res.end('Server error.');
        }

        writeStream.destroy();
        removeFile(filepath);
      });


      req.on('aborted', () => {
        limitedStream.destroy();
        writeStream.destroy();
        removeFile(filepath);
      });

      req.pipe(limitedStream).pipe(writeStream);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
