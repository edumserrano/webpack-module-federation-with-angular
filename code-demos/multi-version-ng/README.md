# multi-version-ng code demo

- [TODO](#todo)

## TODO

$env:NODE_OPTIONS = "--openssl-legacy-provider"

code-demos\multi-version-ng\mfe2-ng14\tsconfig.app.json -> includes "src/app/my-feature/remote-bootstrap.ts"
code-demos\multi-version-ng\shell-ng16\tsconfig.json -> resolveJsonModule and allowSyntheticDefaultImports set to true for the json file import
code-demos\multi-version-ng\mfe3-ng12\tsconfig.json -> resolveJsonModule and allowSyntheticDefaultImports set to true for the json file import


webpack.config.js files -> talk about the diffs, different ng versions have differnt setups. More importantly is the share bit


code-demos\multi-version-ng\mfe3-ng12\package.json -> "start:mfe": "ng serve --configuration mfe"


code-demos\multi-version-ng\mfe3-ng12\src\bootstrap.ts -> talk about bootstrapModule


code-demos\multi-version-ng\mfe3-ng12\src\app\my-feature\remote-bootstrap.ts -> bootstrapMyComponentAsyncV2
code-demos\multi-version-ng\shell-ng16\src\app\app.component.html -> html has 2 nodes for the mfe3


code-demos\multi-version-ng\shell-ng16\src\bootstrap.ts -> show both bootstrap ways, perhaps with environment variable?


code-demos\multi-version-ng\shell-ng16\src\app\app.component.html -> some mfe container elements are div some are an ng-container. explain why


code-demos\multi-version-ng\mfe3-ng12\src\app\app.module.ts
// bootstrap: [AppComponent],
//
// TODO: move this to the README for this code demo
// The fact that AppComponent is in the bootstrap array is what makes Angular load it. Meaning when the module is bootstraped by the platform, see src/bootstrap.ts it
// will process the AppComponent and render it on its selector which is what is used on the index.html and then the app is started.
//
// The way we are using module federation with this app, we are exposing a function that bootstraps the AppModule in order to then expose the MyComponent Angular component.
// When we do that we cannot auto bootstrap the AppComponent or else angular loads zone.js and it creates an error https://stackoverflow.com/questions/55143772/error-expected-to-not-be-in-angular-zone-but-it-is
//
// So now we are in a situation where we want to bootstrap the AppComponent if we are running locally for development of the mfe3 app but we also want to have a way to don't bootstrap the AppComponent
// because we just want to expose the MyComponent Angular component to run in integration with the shell.
//
// Because of this we don't add anything to the boostrap array and we do some logic in the ngDoBootstrap function which gets called if the bootstrap array is empty (check this, link to article).


Maybe change the ngDoBootstrap signature to take in the appref? What makes more sense? check docs on bgDoBootstrap overloads?


add note about using `npm i -D @angular-architects/module-federation-tools@appropriate-version`: "@angular-architects/module-federation-tools": "^16.0.4",
instead of the custom platform bootstrap, note that the same custom platform bootstrap is used on the remote bootstrap file



Angular 12 version of Angular architects (comment about javascript vs module). Around  pages 51 and 52 of Angular book


- https://www.npmjs.com/package/@angular-architects/module-federation-tools.


Note about tsconfig.app.json:
```
Error: C:\dev\repos\edumserrano\webpack-module-federation-with-angular\code-demos\web-component-ng16\mfe1-ng16\src\app\my-standalone-component\my-standalone-component-bootstrap.ts is missing from the TypeScript compilation. Please make sure it is in your tsconfig via the 'files' or 'include' property.
``` 

## Why are all the Angular code demos done using either Angular 12 or Angular 16?

Beginning with Angular 13, the CLI is emitting EcmaScript modules. This affects module federation setup since it affects how the remote exposes the webpack module and therefore how the shell can consume it. This means that the Angular 16 examples should work down to Angular 13 version, except in some cases where some Angular API to load the component dynamically is being used that might not exist or have changed since Angular 13. For Angular 12 versions we need to adjust the code. 