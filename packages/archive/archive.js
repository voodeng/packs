#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const cp = require('child_process')
const argv = require('yargs')
  .usage('Usage: --dist [DIST] --target [TARGET]')
  .help('h')
  .alias('h', 'help')
  .alias('v', 'version')
  .option('d', {
    alias: 'dist',
    describe: '`/dist`, Production env compiled folder'
  })
  .option('t', {
    alias: 'target',
    describe: '`/Archives`, Target folder, place the archive file.'
  }).argv

const archiver = require('archiver')

const DIST = argv.dist || '/dist'
const TARGET = argv.target || '/Archives'

// [1] 根据当前文件位置，确定项目目录位置
// const root = path.resolve(__dirname) + '/../../'
// [2] 使用 node 执行时的位置，这就需要在根目录下执行
const root = process.cwd()
const dist = path.join(root, DIST, '/')
const targetFolder = path.join(root, TARGET, '/')
const pk = require(root + '/package.json')

console.log(`Dist Folder: ${dist}`)

// 获取版本号
const shortHash = cp
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trim()

const longHash = cp
  .execSync('git rev-parse HEAD')
  .toString()
  .trim()

const gver = cp
  .execSync('git describe --always')
  .toString()
  .trim()

const branch = cp
  .execSync('git symbolic-ref --short -q HEAD')
  .toString()
  .trim()

const today = new Date().toLocaleDateString().replace(/-/g, '.')

// @voo/er/e3r 类型名字的话，取最后的
const name = pk.name.split('/').slice(-1)[0]

// 名称 - 版本号 - time - last commit hash
const final = `${name}-${pk.version}(${today}-${branch}-${shortHash})`

const JSONData = {
  name: name,
  version: pk.version,
  releaseTime: pk.updateTime,
  buildTime: new Date().toJSON(),
  commitHash: longHash,
  gitDescribe: gver,
  fileName: final
}

function gen_file() {
  if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist)
    fs.writeFile(targetFolder + '.gitignore', '*', 'utf8', function() {})
  }

  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder)
    fs.writeFile(targetFolder + '.gitignore', '*', 'utf8', function() {})
  }

  fs.writeFile(dist + 'version.json', JSON.stringify(JSONData), 'utf8', function() {})
}

// create a file to stream archive data to.
function create_archive() {
  // use zip
  // var output = fs.createWriteStream(`${targetFolder}${final}.zip`)
  // var archive = archiver('zip', {
  //   zlib: { level: 9 } // Sets the compression level.
  // })

  // use tar.gz
  const archive = archiver('tar', { store: true, gzip: true })
  const outfilepath = `${targetFolder}${final}.tar.gz`
  const output = fs.createWriteStream(outfilepath)

  output.on('close', function() {
    console.log(`outfile: ${outfilepath}`)
    console.log(archive.pointer() + ' total bytes')
    console.log('archiver has been finalized and the output file descriptor has closed.')
  })

  archive.on('error', function(err) {
    throw err
  })

  archive.pipe(output)
  archive.directory(dist, false)
  archive.finalize()
}

// __main__
gen_file()
create_archive()
