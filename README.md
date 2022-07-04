# Go To Test

With this extension, you will be able to go to the test file for the current file with the press of a hotkey.

Available several common test file location strategies. Is recommended to save the test file location strategy in the workspace settings so that it can be shared with your team.

Available file location strategies

| Strategy name    | File Paths                                               |
| ---------------- | -------------------------------------------------------- |
| `same_directory` | `src/feature/file.js`<br>`src/feature/file.test.js`      |
| `__tests__`      | `src/feature/file.ts`<br>`src/feature/__tests__/file.ts` |
| `maven`          | `src/feature/file.java`<br>`test/feature/fileTest.java`  |
| `maven-like`     | `src/feature/file.js`<br>`test/feature/file.test.js`     |
| `custom`         | `configurable by regex`                                  |

When the test file is not found it will create one

## Features

- Go to test
- Creates a test when it doesn't exist
- Custom test location strategy

## Coming soon™ features

- Change suffix (e.g. `.test.` to `.spec.`)
- Go to Source Code
- Confirm on Create file

Check [backlog](https://github.com/danyg/go-to-test/projects/1) for more information
