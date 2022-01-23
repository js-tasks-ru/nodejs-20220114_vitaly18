const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.incoming = '';
    this.encoding = options.encoding;
  }

  _transform(chunk, encoding, callback) {
    this.incoming += chunk.toString(this.encoding);
    const exploded = this.incoming.split(os.EOL);
    const last = exploded.length - 1;
    exploded.forEach((item, index) => {
      index === last ? this.incoming = exploded[last] : this.push(item);
    });
    callback();
  }

  _flush(callback) {
    this.push(this.incoming);
    this.incoming = '';
    callback();
  }
}

module.exports = LineSplitStream;
