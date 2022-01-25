const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.indexOf('/') >= 0) {
    res.statusCode = 400;
    res.end('Subfolders are not supported.');
  }

  const deleteFile = async (fpath) => {
    try {
      await fs.promises.access(fpath, fs.constants.R_OK | fs.constants.W_OK);
      fs.unlink(fpath, (error) => {
        if (error) {
          res.statusCode = 500;
          res.end('Server error.');
        }
        res.statusCode = 200;
        res.end('Deleted!');
      });
    } catch {
      res.statusCode = 404;
      res.end('File not exists.');
    }
  }

  switch (req.method) {
    case 'DELETE':
      deleteFile(filepath);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
