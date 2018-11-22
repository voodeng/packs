#!/usr/bin/env node
/**
 * standard-version git flow
 * update pkg updateTime
 * replace changelog.md string
 *
 * 1. check `git describe` info is you need
 * 2. git flow release start x.x.x
 * 3. run this file use node, `node ./version.js [-argv]`
 * 4. git flow release finish x.x.x
 *
 * --infile --noskip --release-as
 */

const fs = require('fs')
const path = require('path')
var shell = require('shelljs')
const argv = require('yargs')
  .usage('Usage: --infile [CHANGELOG] --noskip --release-as [BUMP] --first-release --dry-run')
  .help('h')
  .alias('h', 'help')
  .alias('v', 'version')
  .option('infile', {
    describe: 'Changelog.md file path'
  })
  .option('noskip', {
    describe: 'all standard version default flow'
  })
  .option('release-as', {
    describe:
      'Package.json version bump type. `| major | minor | patch | premajor | preminor | prepatch | prerelease [--preid=<prerelease-id>] | from-git`'
  }).argv

// https://github.com/conventional-changelog/standard-version
const standardVersion = require('standard-version')
const cmdParser = require('standard-version/command')

// file and path handler
const conventionalChangelog = require('conventional-changelog')

// file path and name
let LOGFILE = cmdParser.argv['infile'] || 'CHANGELOG.md' // log 文档位置

// parse GIT repo
const gitUrl = shell
  .exec('git ls-remote --get-url')
  .toString()
  .trim()
const GitUrlParse = require('git-url-parse')
const G = GitUrlParse(gitUrl)
let REPO_SOURCE = G.resource
let REMO_OWNER = G.owner
let REPO_NAME = G.name
let GIT_REPO = `${REPO_SOURCE}/${REMO_OWNER}/${REPO_NAME}/` // git repo url
let DOC_REPO = GIT_REPO // logfile link git url

if (REPO_SOURCE === 'git.coding.net') {
  DOC_REPO = `coding.net/u/${REMO_OWNER}/p/${REPO_NAME}/git/`
}

console.log(GIT_REPO, '====>', DOC_REPO)

// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
// .replace(/-/g, '/')
let timestamp = new Date().toLocaleString('hc', { hour12: false })

const createFolder = function(to) {
  var sep = path.sep
  var folders = path.dirname(to).split(sep)
  var p = ''
  while (folders.length) {
    p += folders.shift() + sep
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p)
    }
  }
}

// conventional-changelog -p angular -i CHANGELOG.md -s -r 0
// read: https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-core
const createLog = function(filename) {
  var outStream = fs.createWriteStream(filename)
  var changelogStream = conventionalChangelog(
    {
      preset: 'angular',
      infile: filename,
      outfile: filename,
      releaseCount: 0,
      sameFile: true
    },
    ''
  ).on('error', function(err) {
    console.error(err.toString())
    process.exit(1)
  })

  changelogStream.pipe(process.stdout)

  changelogStream.pipe(outStream)
}

// http://trentm.com/json/
var jsonCli = require.resolve('json')
var jsonCMD = `node ${jsonCli} -I -f package.json -e "this.updateTime='${timestamp}'"`

// https://github.com/ALMaclaine/replace
var replaceCli = require.resolve('replace/bin/replace')
var replaceCMD = `node ${replaceCli} ${GIT_REPO} ${DOC_REPO} ${LOGFILE}`

// use standar-version create changelog
function version() {
  // Options are the same as command line, except camelCase
  // add --noskip args to ignore skip set
  var skip = cmdParser.argv['noskip'] ? {} : { commit: true, tag: true }

  standardVersion(
    {
      ...cmdParser.argv,
      skip,
      scripts: {
        postbump: jsonCMD,
        postchangelog: replaceCMD
      }
    },
    function(err) {
      if (err) {
        console.error(`standard-version failed with message: ${err.message}`)
      }
      // standard-version is done
    }
  )
}

// if --first-release or miss
if (!fs.existsSync(LOGFILE) || cmdParser.argv['first-release']) {
  createFolder(LOGFILE)
  fs.writeFileSync(LOGFILE, '', 'utf8')
  createLog(LOGFILE)
}

// __main__
version()
