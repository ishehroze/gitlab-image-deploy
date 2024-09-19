// parses catalog.json to get images as filenames
const fs = require('fs');
let obj = JSON.parse(fs.readFileSync('catalog.json', 'utf8'));

let images = obj["docker-images"];
let registry_dir = obj["docker-registry-path"];;
let build_dir = './build/'

if (!fs.existsSync(registry_dir)) {
    throw registry_dir + ' does not exist';
}

if (!fs.existsSync(build_dir)) {
    fs.mkdirSync(build_dir);
}

// checks whether files exist and copy files to a build/ directory
if (images.length !== 3) { throw 'Invalid configuration. Number of images must be 3' };

for (let i=0; i<3; i++) {
    let image_filename = registry_dir + images[i];
    let build_filename = build_dir + images[i];
    
    fs.open(registry_dir + images[i], 'r', (err, fd) => {
        if (err) {
            throw image_filename + ' does not exist'
        } else {
            fs.copyFile(image_filename, build_filename, (err) => {
                if (err) throw 'Error copying ' + image_filename + ' to ' + build_filename + ' (' + err + ')';            
            });
        }
    });
}

// creates a build/index.html file from the template
data = `
<html>
    <head>
    </head>
    <body>
        <table>
            <tr>
                <th>SL</th>
                <th style="text-align: left">Image</th>
            </tr>
            <tr>
                <td>0</td>
                <td><img width="10%" src="${images[0]}"></td>
            </tr>
            <tr>
                <td>1</td>
                <td><img width="10%" src="${images[1]}"></td>
            </tr>
            <tr>
                <td>2</td>
                <td><img width="10%" src="${images[2]}"></td>
            </tr>
        </table>
    </body>
</html>
`

// if it was a template file instead, we could have used the following instead
// data = eval('`' + fs.readFileSync('template.html', 'utf8') + '`');

fs.writeFileSync(build_dir + 'index.html', data, 'utf8')

