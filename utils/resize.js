const sharp = require('sharp');
const uuidv4 = require('uuid/v4');

/**
 * @desc Resizes a photo to a set of predefined sizes
 * @param filePath Path for where to store the final image(s)
 */
class Resize {
  constructor(folder) {
    this.folder = folder;
  }

  save(buffer) {
    return new Promise((resolve, reject) => {
      const filename = uuidv4();
      const filepath = this.filepath(`${filename}`);
      const Image = sharp(buffer);
      const thumbPath = this.filepath(`${filename}-100.png`);
      const smallPath = this.filepath(`${filename}-240.png`);
      const mediumPath = this.filepath(`${filename}-500.png`);
      const largePath = this.filepath(`${filename}-1024.png`);

      Image.metadata()
        .then((metadata) => {
          // Thumbnail
          if (metadata.width > 100) {
            Image.resize(100, 100, {
              fit: sharp.fit.inside,
              withoutEnlargement: true,
            }).toFile(thumbPath);
          }
          return metadata;
        })
        .then((metadata) => {
          // Small
          if (metadata.width > 240) {
            Image.resize(240, 240, {
              fit: sharp.fit.inside,
              withoutEnlargement: true,
            }).toFile(smallPath);
          }
          return metadata;
        })
        .then((metadata) => {
          // Medium
          if (metadata.width > 500) {
            Image.resize(500, 500, {
              fit: sharp.fit.inside,
              withoutEnlargement: true,
            }).toFile(mediumPath);
          }
          return metadata;
        })
        .then((metadata) => {
          // Large
          if (metadata.width > 1024) {
            Image.resize(1024, 1024, {
              fit: sharp.fit.inside,
              withoutEnlargement: true,
            }).toFile(largePath);
          }
          return metadata;
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
      resolve({ filename, filepath });
    });
  }

  static filename() {
    return `${uuidv4()}.png`;
  }

  filepath(filename) {
    return `${this.folder}/${filename}`;
  }
}
module.exports = Resize;
