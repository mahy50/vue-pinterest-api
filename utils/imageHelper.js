const fs = require('fs')
const mkdirp = require('mkdirp')
const sharp = require('sharp')


const folderLevel = 3
const origFolder = 'public/images/originals'
const x236Folder = 'public/images/236x'

module.exports = function(file, md5) {
  const imageData = {
    ['origin']: {},
    ['236x']: {}
  }
  const folderDirectory = function(md5, level) {
    if (level < 1) return md5
    let str = ''
    for (let i = 0; i < level; i++) {
      str += '/' + md5.substr(i * 2, 2)
    }
    return str
  }
  const directory = folderDirectory(md5, folderLevel)
  const fullpath =  directory + '/' + md5 + '.jpg'
  mkdirp.sync(origFolder + directory)
  mkdirp.sync(x236Folder + directory)
  const image = sharp(file)
  const p1 = image
    .toFile(origFolder + fullpath)
    .then(() => {
      return image.metadata()
    })
    .then((metadata) => {
      // console.log(metadata)
      imageData.origin = {
        url: '/images/originals' + fullpath,
        width: metadata.width,
        height: metadata.height
      }
    //   return image.resize(236).metadata()
    // }).then(metadata => {
    //   imageData['236x'] = {
    //     url: '/images/236x' + fullpath,
    //     width: metadata.width,
    //     height: metadata.height
    //   }
    //   return image.toFile(x236Folder + fullpath)
    // }).then(() => {
    //   return imageData
    })
    const p2 = image.resize(236).metadata()
      .then(metadata => {
      imageData['236x'] = {
        url: '/images/236x' + fullpath,
        width: 236,
        height: Math.ceil(metadata.height * 236 / metadata.width)
      }
      return image.toFile(x236Folder + fullpath)
    })
  return Promise.all([p1, p2]).then(() => {
    return imageData
  })
}
