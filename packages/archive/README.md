# @voodeng/archive

There has Some documentation and packaging tools

Maybe these tools are not perfect, but they can make your build process more convenient.

## Intro
```
npm i -D @voodeng/archive
```

now, u can use two cli-tools: `uparchive` & `upversion` 

### uparchive

this pack is use archiver, it can archive target floder to target path.

- create folder if not exits.
- create .gitignore in folder.
- generate version.json with git repo info to dist folder.
- archive dist to the target folder.

```
Usage: 
npx uparchive --dist [DIST] --target [TARGET]

Options:
  -h, --help     Show help                                             [boolean]
  -d, --dist     Production env compiled folder. `/dist`
  -t, --target   Target folder, place the archive file. `/Archives`
  -v, --version  Show version number 
```

in package.json
```
{
  "scripts": {
    "archive": "uparchive --dist ./build --target ./Archives"
  }
}
```

### upversion

this pack is base on [standard-version](https://github.com/conventional-changelog/standard-version), so you can use same options.

other, you can:
- Replace the log default file header
- Copy log file to target path
- add a package.json field name `updateTime` to current time
- default skip commit and tag
```
Usage: 
npx upversion --infile [CHANGELOG] --noskip --release-as [BUMP] --first-release --dry-run

Options:
  --infile       Changelog.md file pathname. `./ptah/filename`
  --noskip       all standard version default flow.
  --release-as   Package.json version bump type. `| major | minor | patch |
                 premajor | preminor | prepatch | prerelease
                 [--preid=<prerelease-id>] | from-git`
  --cpto         Copy to target file pathname. `./path/filename`
  --header       Replace log file header. `--header "# HEAD STRING\n\n descstring some"`
```

in package.json
```
{
  "scripts": {
    "version": "upversion --cpto ./doc/log.md --header '# HEAD STRING\n\n descstring some'"
  }
}
```
