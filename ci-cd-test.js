const fs = require('fs');
let obj = JSON.parse(fs.readFileSync('catalog.json', 'utf8'));

let images = obj["docker-images"];
let registry_dir = obj["docker-registry-path"];;

if (images.length !== 3) { throw 'Invalid configuration. Number of images must be 3' };

for (let i=0; i<3; i++) {
    let image_filename = registry_dir + images[i];
    
    fs.open(registry_dir + images[i], 'r', (err, fd) => {
        if (err) {
            throw image_filename + ' does not exist'
        }
    });
}

