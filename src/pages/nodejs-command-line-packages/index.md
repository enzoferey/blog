---
title: 'Node.js command-line packages'
date: '2019-11-29'
spoiler: How to call your packages in a CLI.
---

Have you ever wondered how can you build a Node.js package that can be called via a Command Line Interface ?

You know, that kind of packages that you can call as global packages directly by writing `something [...args]` in your terminal. Some of them you might have used: `create-react-app`, `gatsby-cli`, `now`, `yarn`, `serve`.

Let's dive into it.

> I assume that you have installed Node.js on your computer. If you haven't, click [here](https://nodejs.org/en/) and download the latest LTS version.

### 1. Init your package

We will start by creating a new package. Head to your terminal and execute:

```bash
$ mkdir my-cli-package
$ cd my-cli-package
$ npm init -y
```

Here we are first creating a new folder called `my-cli-package` for the package we will create. Then we move to it with the `cd` command. Finally, we initialize the package avoiding to fill further non relevant details at the moment with the `-y` option.

### 2. Write a simple script

Next, we will create a dumb script that will just log a message to the console:

```jsx
// my-cli-package/hello.js

console.log("Hi there !");
```

If you want to check what happens when you would execute this script you can run it executing `node hello.js`.

### 3. Convert the script into a shell command

How can be this script executed as a shell command without having to reference `node` ?

You add the following at the top of your file:

```jsx
#!/usr/bin/env node

console.log("Hi there !");
```

This line tells the system that it should execute the file using `node`, so now you can execute the file like `./hello.js`. If you get a "Permission denied" error, it probably means your system doesn't give execute permissions by default to new files. Execute `chmod +x hello.js` to fix it.

### 4. Make the script executable

But this is not the end right ? We would like to call our script executing `hello`.

Let's update our `package.json` file for that:

```jsxon{6,7,8}
{
  "name": "my-cli-package",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "bin": {
    "hello": "./hello.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Adding the `bin` entry, we map a command name to an executable file. Read more about it [here](https://docs.npmjs.com/files/package.json#bin).

As a details, we now need to run:

```bash
$ npm link
```

This will create a [symlink](https://en.wikipedia.org/wiki/Symbolic_link) pointing to our script. Again, you might get a "Permission denied" error. You will need to execute `sudo npm link` in that case.

Now if you execute:

```bash
$ hello
```

You should see the message "Hi there !" appear right in your terminal.

### Closing words

From here, you can explore how to build scripts with more interactions and real goals. You could use `process.argv` to catch arguments used in the command call or use [Commander.js](https://github.com/tj/commander.js/) to build more complex command-line interfaces. Also checkout [Ink](https://github.com/vadimdemedes/ink) if you want to build stateful/web-like interfaces using the power of [React](https://reactjs.org/).