#!/usr/bin/env node
"use strict";

/**
 * Node Child Processes - https://tinyurl.com/qlf6nrx
 */

import { spawn } from "child_process";
const script = process.argv[2];
const args = process.argv.slice(3);

switch (script) {
  case "build-microbundle":
  case "build-microbundle-watch":
    const child = spawn(
      "node",
      [require.resolve("../scripts/" + script)].concat(args),
      { stdio: "inherit", shell: true }
    );

    child.on("exit", (code: number, signal: string) => {
      if (signal) {
        if (signal === "SIGKILL") {
          console.log(
            "The build failed because the process exited too early. " +
              "This probably means the system ran out of memory or someone called " +
              "`kill -9` on the process."
          );
        } else if (signal === "SIGTERM") {
          console.log(
            "The build failed because the process exited too early. " +
              "Someone might have called `kill` or `killall`, or the system could " +
              "be shutting down."
          );
          process.exit(1);
        }
      } else {
        console.log(
          "child process exited with " + `code ${code} and signal ${signal}`
        );
        process.exit(code || undefined);
      }
    });

    child.on("error", (err: Error) => {
      console.error(err);
      process.exit(1);
    });
    break;
  default:
    console.log('Unknown script "' + script + '".');
    break;
}
