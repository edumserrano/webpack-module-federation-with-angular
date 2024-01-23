# Shared modules in Webpack Module Federation

- [Intro](#intro)
- [Quick overview](#quick-overview)
- [When should I use a singleton?](#when-should-i-use-a-singleton)
- [When should I use eager?](#when-should-i-use-eager)
- [Share libraries](#share-libraries)
- [Improve resolution of shared dependencies when using dynamic Module Federation](#improve-resolution-of-shared-dependencies-when-using-dynamic-module-federation)
- [Learn more](#learn-more)

## Intro

The [shared section](https://webpack.js.org/plugins/module-federation-plugin/#sharing-libraries) of the `ModuleFederationPlugin` configuration let's you define libraries that are shared between your federated modules. This allows you to prevent the same library from being loaded several times.

Shared dependencies isn't something that is properly explored in the [code demos](/README.md#code-demos). The code demos use the [shareAll](https://www.npmjs.com/package/@angular-architects/module-federation#shareall) and [share](https://www.npmjs.com/package/@angular-architects/module-federation#share-helper) helpers from the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package to share all the possible dependencies between shell and remotes.

Angular, an likely many other frontend frameworks, wasn't made with a micro frontend architecture in mind and therefore might not work well when multiple versions of Angular are loaded. So whilst, on the one hand, you can use the shared configuration to optimize the number of dependencies that are loaded; on the other, you **must** use it to share some packages that will make your app fail if loaded twice. In an Angular app you should **at least** share `@angular/core`, `@angular/common` and `@angular/router` or apply workarounds to allow multiple versions of Angular to co-exist.

## Quick overview

The shared option uses the `sharedPlugin` which has its own set of configuration properties. This helps manage how libraries are shared in the shared scope. This is an example of how a shared section could look like:

```ts
plugins: [
  new ModuleFederationPlugin({
    ...
    shared: {
      '@angular/core': { singleton: true, strict: false },
      '@angular/common': { singleton: true, strict: false },
      '@angular/router': { singleton: true, strict: false },
      'place-my-order-assets': { singleton: true, strict: false },
    }
  })
]
```

Some important config options to know are:

`eager`: allows Webpack to include the shared packages directly instead of fetching the library via an asynchronous request. When Eager is set as ‘true’, all shared modules will be compiled with the exposed module.

`singleton`: allows only a single version of the shared module in the shared scope. This means at every instance, only one version of the package will be loaded on the page. If a scope already has a version of @angular/core, and the imported module uses a different version of @angular/core, Webpack will ignore the new version and use the version already present in the scope.

`StrictVersion`: allows Webpack to reject the shared module if its version is not valid. This is useful when the required version is specified.

`RequiredVersion`: this option states the required version of the shared module. Learn more about the shared option on the Webpack official documentation.

See [here](https://webpack.js.org/plugins/module-federation-plugin/#sharing-libraries) for the full config options available.

## When should I use a singleton?

> If your application seems to be behaving strangely during development, like pieces of data disappear when activating other federated modules. Its probably instantiating another singleton and losing track of data you wanted to hold onto via that singleton bridge.
>
>There's no real automated way to determine if something should be a singleton or not beyond common sense. Using singletons will not allow multiple versions of a module to exist in one shareScope. So pick and choose. [^1]

Also note that using singletons reduces the number of packages that need to be downloaded for your app to work.

[^1]: Taken from `When should I use a singleton?` section of [When should you leverage Module Federation, and how?](https://scriptedalchemy.medium.com/when-should-you-leverage-module-federation-and-how-2998b132c840). Note that the author of this article is the creator of Module Federation.

## When should I use eager?

> I avoid eager:true at all costs, only using it if there is some kind of incompatibility like with next.js. Eager true will front-load the shared module which can mean downloading unused libraries when you don’t want to, since webpack will not chunk an eager module into a separate file. There may be some workarounds but so far those are untested outside of accidentally stumbling across it. [^2]

[^2]: Taken from `What about eager?` section of [When should you leverage Module Federation, and how?](https://scriptedalchemy.medium.com/when-should-you-leverage-module-federation-and-how-2998b132c840). Note that the author of this article is the creator of Module Federation.

## Share libraries

The [shared section](https://webpack.js.org/plugins/module-federation-plugin/#sharing-libraries) of the `ModuleFederationPlugin` configuration is also what you would use if you want to share cross cutting concerns across the shell and the remotes. Things like authentication, logging or even have some shared state.

For more information see: [Module Federation — Sharing Library Code](https://medium.com/tenable-techblog/7-module-federation-sharing-library-code-759ae98f7fc8)

If all your apps, meaning shell, remotes and shared libraries, are in the same repo then see:

- [Using Module Federation with (Nx) Monorepos and Angular](https://www.angulararchitects.io/en/blog/using-module-federation-with-monorepos-and-angular/)
- [Code demo from the module/federation/module-federation-examples repo](https://github.com/module-federation/module-federation-examples/blob/master/angular15-microfrontends-lazy-components/README.md): in this demo the [mdmf-shared project](https://github.com/module-federation/module-federation-examples/tree/master/angular15-microfrontends-lazy-components/projects/mdmf-shared) is a shared library that maintains app state. Explore the [module/federation/module-federation-examples](https://github.com/module-federation/module-federation-examples) repo for other examples using shared libraries.

**You don't have to have all your apps in the same repo to be able to share libraries. You can use NPM packages and share them as singletons across your shell and remotes.**

> [!NOTE]
>
> Specific to Angular, even if a library is set to singleton and is only loaded once, it doesn't mean that its Angular services will be singletons. If you want a service to be a singleton across shell and remotes you should make sure that you provide the service in the root injector, for instance by adding:
> ```ts
> @Injectable({
>   providedIn: 'root'
> })
> ```
>
> Or by making sure that the Angular service is declared as a provider of the shell's Angular module, and is not declared as a provider in any other Angular modules.

## Improve resolution of shared dependencies when using dynamic Module Federation

See `Dynamic Module Federation` section on the [README for the @angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation#advanced-features) npm package where the following is mentioned:

> If somehow possible, load the remoteEntry upfront. This allows Module Federation to take the remote's metadata in consideration when negotiating the versions of the shared libraries.

The section goes on to show how to use the `loadRemoteEntry` function from `@angular-architects/module-federation` to load all the required remote entries at the start of your app.

To give a practical example of the difference between doing this or not, consider you have a shell app using Angular 15 that is loading an mfe app using Angular 16. Furthermore, you've declared Angular as a shared dependency in both apps with singleton set to `true` and `strict` set to `false`.

If you use dynamic Module Federation, meaning you don't declare the remotes the shell app is loading on the webpack configuration file, when you run the shell it will do the dependency resolution logic and decide to use Angular 15 because it doesn't know about any other remotes requiring a different version of Angular.

If you then use the `loadRemoteEntry` function, at app startup the shell will now know that you will be loading an mfe app that uses Angular 16 and so Module Federation will fetch Angular 16 instead of Angular 15.

## Learn more

For a better understanding on how shared dependencies work in Webpack Module Federation see:

- [Module Federation Shared API](https://dev.to/infoxicator/module-federation-shared-api-ach)
- [Module Federation Series Part 1: A Little in-depth](https://vugar-005.medium.com/module-federation-series-part-1-a-little-in-depth-258f331bc11e): good article detailing different shared configurations used in an Angular setup and their effects.
- [Versioned shared modules for Module Federation](https://github.com/webpack/webpack/pull/10960): GitHub issue where shared modules have been redesigned. It contains information about the motivation for the redesign and how shared modules work now.
- [Getting Out of Version-Mismatch-Hell with Module Federation](https://www.angulararchitects.io/en/blog/getting-out-of-version-mismatch-hell-with-module-federation/)
- share helpers from `@angular-architects/module-federation` npm package: see [share helper](https://www.npmjs.com/package/@angular-architects/module-federation#share-helper), [shareAll helper](https://www.npmjs.com/package/@angular-architects/module-federation#shareall) and [Sharing Libs of a Monorepo](https://www.npmjs.com/package/@angular-architects/module-federation#sharing-libs-of-a-monorepo).
- [official docs on sharing libraries](https://webpack.js.org/plugins/module-federation-plugin/#sharing-libraries)
