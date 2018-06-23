

# @oresoftware/docker.r2g

### Installation

```bash
 $ npm i -g '@oresoftware/docker.r2g'
```

or just install:

```bash
 $ npm i -g '@oresoftware/r2g'
```

and r2g will install docker.r2g for you. Note that `r2g docker` is the same as running `dkr2g exec`.


## Initialize

Create the files in your project that are necessary for using .r2g to the fullest:

```bash
dkr2g init
```

<br>

## Run / Execute

```bash
dkr2g exec
```

<br>

## Options

By default, dkr2g uses a non-root user for the container, to use the root user, use the --root option:

```bash
dkr2g exec --root
```

<br>

To install local dependencies for complete local development/testing:

```bash
dkr2g exec --full --pack
```

If `--full` is used, then we install local dependencies, instead of pulling those dependencies from NPM. <br>
This is very useful if you need to test a locally developed dependency tree.

The `--pack` option only applies when `--full` is used.  <br>
If `--pack` is used, then dkr2g will use `npm pack` against local dependencies, which converts them to <br>
their published format.

<br>

To use different node.js / npm versions:

```bash
dkr2g exec --node-version="9.5" --npm-version="5.4"
```

If `--node-version` is used, the Docker container will use that Node version. `--nodev` is an alias for --node-version. <br>
If `--npm-version` is used, the Docker container will use that NPM version.  `--npmv` is an alias for --npm-version. <br>


