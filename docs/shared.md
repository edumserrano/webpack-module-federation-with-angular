# Shared

- [TODO](#todo)

## TODO

review the description of https://www.npmjs.com/package/@angular-architects/module-federation because it contains lots of helpful info. See how to reference the most important parts. At least reference it when talking about the shared array of module federation and the helpers this library provides.


3)  Create a documentation page about the shared array on module federation. Also link to https://github.com/webpack/webpack.js.org/issues/3757
    1)  https://www.angulararchitects.io/en/blog/getting-out-of-version-mismatch-hell-with-module-federation/
    2)  https://github.com/webpack/webpack/pull/10960
    3)  https://webpack.js.org/plugins/module-federation-plugin/#specify-package-versions
    4) See `When should I use a singleton?` and `What about eager?` from https://scriptedalchemy.medium.com/when-should-you-leverage-module-federation-and-how-2998b132c840
    5)  Add the below from https://www.bitovi.com/blog/how-to-build-a-micro-frontend-architecture-with-angular
    ```
    The shared option uses the sharedPlugin which has its own set of configuration properties. This helps manage how libraries are shared in the shared scope.

    Some important config options to know are :

    eager: Allows Webpack to include the shared packages directly instead of fetching the library via an asynchronous request. When Eager is set as ‘true’, all shared modules will be compiled with the exposed module.

    singleton: Allows only a single version of the shared module in the shared scope. This means at every instance, only one version of the package will be loaded on the page. If a scope already has a version of @angular/core, and the imported module uses a different version of @angular/core, Webpack will ignore the new version and use the version already present in the scope.

    StrictVersion: Allows Webpack to reject the shared module if its version is not valid. This is useful when the required version is specified.

    RequiredVersion: This option states the required version of the shared module. Learn more about the shared option on the Webpack official documentation.
    ```
    6) Also 
    ```
    the shared dependencies (and rules) between your remote and shell app. This allows tight control for your remote to not re-declare modules/services that you expect to be singleton, or prevent mismatched versions of Angular or other libraries existing in the eco-system. By assigning strictVersion to true, the build will quick fail if an issue occurs. Removing this option will potentially pass the build, but display warnings in the dev console.
    ```