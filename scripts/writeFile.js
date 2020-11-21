const fs = require('fs');

const writeFile = (path, contents) => {
    return new Promise(function(res, rej){
        const file = fs.createWriteStream(path);
        file.on('error', err => rej(err));
        file.on('finish', () => res());
        file.write(contents);
        file.end();
    })
}

module.exports = writeFile;
