const fs = require('fs')
const path = require('path')

const url_json_path = path.resolve(__dirname, '../config');
const src_url_json_path = path.resolve(__dirname, '../src/apps/assets');

let fbp_url = fs.readFileSync(url_json_path + '/fbp-url.json');
fs.writeFileSync(src_url_json_path + '/url.json', fbp_url);