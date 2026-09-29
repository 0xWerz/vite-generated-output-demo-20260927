# Triage guide

This repo looks like a harmless Vite demo. It isn't. Importing it into Arc Studio and running `arc-studio pull` writes a file outside your checkout and gets code running as you. Full write-up is in the HackerOne report.

## The trick

`generated` is committed as a symlink to `../.zshenv`. The build script (`prepare.mjs`) overwrites `generated` with a normal file inside the Arc sandbox, so the sandbox copy looks fine. Your local clone still has the symlink, so when `pull` copies the file down it follows the symlink and the write lands above your checkout.

```
$ git ls-tree -r HEAD
120000  generated        # -> ../.zshenv
100644  index.html
100644  package.json
100644  prepare.mjs
100644  src.js
```

## Reproduce, about 2 minutes

1. Import this repo into Arc Studio (web "From GitHub", or `arc-studio clone`). Arc runs the build, so the sandbox copy of `generated` is a plain file.

2. In an empty folder, run the documented pull.

   ```
   arc-studio pull --app <appId> --out "$PWD"
   ```

3. Look one level above the checkout.

   ```
   cat ../.zshenv
   ARC_PULL_STARTUP_CANARY=confirmed
   ```

`.zshenv` is read by every new zsh, so on a real target this runs the attacker's command the next time they open a terminal. The canary here is inert, it just proves the write landed where it shouldn't.

## No Arc account needed

You can prove the same write-through against Circle's actual published `pullFiles()` code with a fake sandbox, no account and no import. Run `pull-boundary-tests.mjs` from the report bundle against the pinned `@circle-fin/arc-studio-cli` package.
