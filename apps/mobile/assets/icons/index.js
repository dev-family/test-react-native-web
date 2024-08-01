const fs = require('fs/promises');
const { join } = require("path");

const ICONS_PATH = '../../../assets/icons'
const PATH_TO_WRITE = join(__dirname, '../../', "src", 'ui/constants', 'icons.ts')

let iconsData = ``

const addIcons = async (files, path, prefix = []) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    if (file.includes('js') || file.includes('@')) continue

    if (file.includes('.png')) {

      const keyPrefix = prefix.join('.')
      const key = keyPrefix + (keyPrefix.length ? '.' : '') + file.replace('.png', '')

      const filePath = join(ICONS_PATH, prefix.join('/'), file)

      iconsData += `
  "${key}" : require("${filePath}"),`

    } else {

      const dirname = join(path, file)
      const dirFiles = await fs.readdir(dirname)

      await addIcons(dirFiles, dirname, [...prefix, file])
    }
  }
}

const generateIcons = async () => {
  const files = await fs.readdir(__dirname);

  let icons = `export const Icons = {`

  await addIcons(files, __dirname)
  icons += iconsData

  icons += `
};
export type IconsType = keyof typeof Icons;
   `

  await fs.writeFile(PATH_TO_WRITE, icons, { flag: 'w+' })

};

generateIcons();
