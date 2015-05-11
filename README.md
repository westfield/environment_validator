# Environment Validator

Validates that the node engine being used and the modules installed match those
described in your `package.json`. This is helpful when multiple people are
working on a project and you want to be sure that their node environments are
in sync.

## Getting started

1. Include this module in your `package.json`
2. `npm install`
3. Add `require('environment_validator').validate(__dirname + '/package.json')`
 to your main script

The argument to the `validate` function is the path to your project's
`package.json`

## Known issues

This module does not check that local or dependencies specified with a git url
are the version that you need. There is not enough information to be sure that
they are up to date.

## License

Copyright 2014 Westfield Labs Corporation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
