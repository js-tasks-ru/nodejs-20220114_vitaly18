const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.encoding = options.encoding;
    this.size = 0;
  }

  getStrSize(str) {
    return Buffer.from(str).length;
  }

  _transform(chunk, encoding, callback) {
    const str = chunk.toString(this.encoding);
    const size = this.getStrSize(str);
    this.size += size;
    const exceeded = this.size > this.limit;
    callback(exceeded ? new LimitExceededError() : null, exceeded ? null : str);
  }
}

module.exports = LimitSizeStream;
