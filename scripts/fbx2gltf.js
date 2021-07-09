const convert = require('fbx2gltf');

const assetsPath = './assets/models';

convert(`${assetsPath}/${process.argv[2]}.fbx`, `${assetsPath}/${process.argv[2]}.gltf`, ['--binary']).then(
  destPath => {
    console.log('Converted', destPath)
  },
  error => {
    console.error(error)
  }
);
