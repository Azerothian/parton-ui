// we can also use `import`, but then
// every export should be explicitly defined

const { fs, vol } = require('memfs')
module.exports = fs
