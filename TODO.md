- be able to run test again

  ```
  "test:js": "./bin/enchanter.js test node 'lib/**/*.test.js'",
  "test:snapshot": "./bin/enchanter.js snapshot node 'lib/**/*.snapshot.js' --extern snapshot",
  "test:snapshot-error": "./bin/enchanter.js snapshot-error node 'lib/**/*.error.js' --extern snapshot",
  "test": "npm-run-all test:*"
  ```

- improve API
- improve functions about printing `common-help-command`
