# Other learning material

- [Description](#description)
- [Webpack Module Federation](#webpack-module-federation)
- [Webpack module federation and multi-frameworks](#webpack-module-federation-and-multi-frameworks)
  - [Example 1](#example-1)
  - [Example 2](#example-2)
  - [Other examples](#other-examples)
- [Angular](#angular)
  - [Common errors in Webpack Module Federation](#common-errors-in-webpack-module-federation)
- [Custom elements aka Web components](#custom-elements-aka-web-components)
- [Micro-frontends](#micro-frontends)

## Description 

This document contains a collection of resources that help with:

- **learning webpack module federation**.
- applying webpack module federation to Angular apps.
- learning about some Angular concepts used throught the code demos.
- learning about micro-frontends.

Some of the resources grouped here are also linked in places where they are relevant, such as in the READMEs or in the code for the demo apps. However, it's useful to gather everything in one place and augment it with other valuable resources.

> **Note**
>
> Links marked with a :star: are specially relevant.

## Webpack Module Federation

- [Webpack module federation documentation](https://webpack.js.org/concepts/module-federation/)
- [Webpack ModuleFederationPlugin documentation](https://webpack.js.org/plugins/module-federation-plugin/)
- [Webpack configuration languages](https://webpack.js.org/configuration/configuration-languages/): Although all the code demos use `Javascript` for webpack configuration files, you can use other languages like `Typescript`.
- [Module Federation options, usage, hints](https://gist.github.com/zfeher/201f55c057553078fe5b0aac1dad6969)
- [Webpack 5 Module Federation: A game-changer in JavaScript architecture](https://medium.com/swlh/webpack-5-module-federation-a-game-changer-to-javascript-architecture-bcdd30e02669)
- [When should you leverage Module Federation, and how?](https://scriptedalchemy.medium.com/when-should-you-leverage-module-federation-and-how-2998b132c840)
- [Understanding Module Federation: A Deep Dive](https://scriptedalchemy.medium.com/understanding-webpack-module-federation-a-deep-dive-efe5c55bf366)
- :star: [Module federation examples](https://github.com/module-federation/module-federation-examples)
- :star: [10 part article series on webpack module federation and Angular](https://www.angulararchitects.io/en/blog/the-microfrontend-revolution-module-federation-in-webpack-5/)
- :star: [angular-architects/module-federation-plugin repo](https://github.com/angular-architects/module-federation-plugin): home for the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) and [@angular-architects/module-federation-tools](https://www.npmjs.com/package/@angular-architects/module-federation-tools) npm packages.   
- :star: [Module Federation Series Part 1: A Little in-depth](https://vugar-005.medium.com/module-federation-series-part-1-a-little-in-depth-258f331bc11e): contains a good explanation of how shared modules work as well as common errors encountered when they're misconfigured.
- [Zack Jackson Medium articles](https://scriptedalchemy.medium.com/) and [twitter profile](https://twitter.com/ScriptedAlchemy): Zack Jackson is the creator of Module Federation. He has several articles and tweets on the matter.
- [Benefits of Module Federation: Unlocking the Power of Software Modularity](https://blog.bitsrc.io/discover-the-benefits-of-module-federation-unlocking-the-power-of-software-modularity-8b1ef62c8c2c)
- [angular-architects/module-federation-plugin migration guides](https://github.com/angular-architects/module-federation-plugin/blob/main/migration-guide.md)

## Webpack module federation and multi-frameworks

### Example 1

The [README](https://www.npmjs.com/package/@angular-architects/module-federation-tools) for the `@angular-architects/module-federation-tools` package shows an example of how to use webpack module federation in a multi-framework environment. The example can be seem live at https://red-ocean-0fe4c4610.azurestaticapps.net/dashboard.

![Module federation with multi-frameworks](static-assets/module-federation-multi-frameworks.png)

The setup includes:
- an Angular shell that loads MFEs that are in the same or different version of Angular, as well as MFEs using different frameworks such as React, Vue and AngularJS. The Angular shell contains the top navbar, as well as the content for the home and the dashboard tabs. The code for the shell is at [manfredsteyer/
multi-framework-version](https://github.com/manfredsteyer/multi-framework-version). This repo also contains an `mfe1` app which is the micro-frontend for the content of the flights tab.
- A React mfe app with code at [manfredsteyer/react-app](https://github.com/manfredsteyer/react-app).
- An Angular1 mfe app with code at [manfredsteyer/angular-app1](https://github.com/manfredsteyer/angular-app1).
- An Angular2 mfe app with code at [manfredsteyer/angular-app2](https://github.com/manfredsteyer/angular-app2).
- An Angular3 mfe app with code at [manfredsteyer/angular3-app](https://github.com/manfredsteyer/angular3-app).
- A Vue mfe app with code at [manfredsteyer/vue-js](https://github.com/manfredsteyer/vue-js).
- An AngularJS mfe app with code at [manfredsteyer/angularjs-app](https://github.com/manfredsteyer/angularjs-app).

There's also a [tutorial](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf-tools/tutorial/index.md) available for the above setup.

### Example 2

Another example of a multi-framework setup can be found at [manfredsteyer/multi-framework-micro-frontend](https://github.com/manfredsteyer/multi-framework-micro-frontend). This example contains:
- a shell in Angular 13.
- a mfe1 app in Angular 13.
- a mfe2 app in Angular 12.
- a mfe3 app in Angular 12.
- a mfe4 app in React 17.

### Other examples

Other examples and guides about multi-framework setups can be found in:

- the [module-federation/module-federation-examples](https://github.com/module-federation/module-federation-examples) repo.
- the [Let's build together a microfrontends application combining multiple frameworks using Module Federation](https://www.youtube.com/watch?v=libbOCJH6pc) video from the `Devoxx Belgium 2023 Conference`.
- [Multi-Framework and -Version Micro Frontends with Module Federation: Your 4 Steps Guide](https://www.angulararchitects.io/en/blog/multi-framework-and-version-micro-frontends-with-module-federation-your-4-steps-guide/)

## Angular

- [How to manually bootstrap an Angular application](https://medium.com/angular-in-depth/how-to-manually-bootstrap-an-angular-application-9a36ccf86429)
- [Ways of Bootstrapping Angular Applications](https://medium.com/learnwithrahul/ways-of-bootstrapping-angular-applications-d379f594f604)
- [ApplicationRef documentation](https://angular.io/api/core/ApplicationRef#bootstrap)
- [bootstrapApplication documentation](https://angular.io/api/platform-browser/bootstrapApplication)
- [createApplication documentation](https://angular.io/api/platform-browser/createApplication)
- [Getting to Know the createApplication API in Angular](https://netbasal.com/getting-to-know-the-createapplication-api-in-angular-f1c0a2685047)
- [Angular Platforms in depth. Part 1. What are Angular Platforms?](https://angularindepth.com/posts/1027/angular-platforms-in-depth-part-1-what-are-angular-platforms)
- [Angular Platforms in depth. Part 2. Application bootstrap process](https://angularindepth.com/posts/1144/angular-platforms-in-depth-part-2-application-bootstrap-process)
- [JavaScript modules vs. NgModules](https://angular.io/guide/ngmodule-vs-jsmodule): the term `module` used in webpack module federation refers to JavaScript modules, not to confuse with Angular modules.
- [8 part article series on Angular's Future with Standalone Components](https://www.angulararchitects.io/en/blog/angulars-future-without-ngmodules-lightweight-solutions-on-top-of-standalone-components/)
- [Render ngTemplates dynamically using ViewContainerRef in Angular](https://dev.to/railsstudent/render-ngtemplates-dynamically-using-viewcontainerref-in-angular-17lp)
- [Simplifying Navigation Error Handling with Angular’s Upcoming Feature](https://medium.com/@artur.fedotiew/%EF%B8%8F-simplifying-navigation-error-handling-with-angulars-upcoming-feature-%EF%B8%8F-b55ee04d246a)
- [Angular Router Standalone APIs](https://angularexperts.io/blog/angular-router-standalone-apis)
- [Working with providers in Angular](https://sergeygultyayev.medium.com/working-with-providers-in-angular-eeb493151446)
- [InjectionToken Angular docs](https://angular.io/api/core/InjectionToken)  
- [The Hidden Power of InjectionToken Factory Functions in Angular](https://netbasal.com/the-hidden-power-of-injectiontoken-factory-functions-in-angular-d42d5575859b)
- [eneajaho/provide-function-angular-injection-token.ts](https://gist.github.com/eneajaho/28c4ef1d75bf1d8733cec23e54068c0a)
- [How To Use Route Resolvers with Angular Router](https://www.digitalocean.com/community/tutorials/angular-route-resolvers)
- [Tutorial on how to implement the Resolver in Angular](https://medium.com/@sandakova.varvara/https-indepth-dev-tutorials-angular-indepth-guide-how-to-implement-resolver-in-angular-13b8005e93b9#:~:text=Resolver%20is%20just%20a%20simple,per%20route%20as%20you%20want.)
- [angularindepth](https://angularindepth.com/)
- [https://netbasal.medium.com/](https://netbasal.medium.com/)
- [Understanding Angular Resolvers](https://itnext.io/understanding-angular-resolvers-b49f6c227278)
- [Functional Route Guards in Angular](https://medium.com/ngconf/functional-route-guards-in-angular-8829f0e4ca5c)
- [Dynamically Add Components in Angular](https://davembush.medium.com/dynamically-add-components-in-angular-7dc62b2a58d3)
- [Configuring application environments](https://angular.io/guide/build#configuring-application-environments)

### Common errors in Webpack Module Federation

- [inject() must be called from an injection context](https://stackoverflow.com/questions/65004891/inject-must-be-called-from-an-injection-context-when-importing-angular-app-u): usually happens when multiple versions of the Angular platform are instantiated.
- [Cannot read property 'ɵmod' of undefined](https://stackoverflow.com/questions/66586956/getting-cannot-read-property-%C9%B5mod-of-undefined-when-importing-custom-module): usually the problem is that you're trying to access an incorrect module. For instance, on the `ModuleFederationPlugin.exposes`, a micro-frontend app exposes a module with the key `mfe1` but the shell app is trying to access the remote module from the micro-frontend app using an incorrect key, meaning, anything else other than `mfe1`.
- [Webpack documentation on troubleshooting module federation](https://webpack.js.org/concepts/module-federation/#troubleshooting)

## Custom elements aka Web components 

- :star: [Web Component-based Micro Frontends with Angular](https://www.youtube.com/watch?v=ee17YczpCpU): great video showing how to structure your micro-frontend apps. It doesn't use Webpack Module Federation but all the concepts on this video are great and applicable when you're using Webpack Module Federation. The code for the video can be found at [fboeller/microfrontends-with-angular](https://github.com/fboeller/microfrontends-with-angular).
- [Angular Elements: Web Components with Standalone Components](https://www.angulararchitects.io/en/blog/angular-elements-web-components-with-standalone-components/)
- :star: [Understanding the Magic Behind Angular Elements](https://netbasal.com/understanding-the-magic-behind-angular-elements-8e6804f32e9f)
- :star: [The Ultimate Guide to Web Components](https://ultimatecourses.com/blog/the-ultimate-guide-to-web-components)
- [Attributes and properties](https://javascript.info/dom-attributes-and-properties)
- [Here is what you need to know about dynamic components in Angular](https://angularindepth.com/posts/1054/here-is-what-you-need-to-know-about-dynamic-components-in-angular): more useful for older Angular versions, like Angular 12 since newer versions of Angular don't require `ComponentFactoryResolver`.
- [Different Patterns in Communicating Between Web Components](https://blog.bitsrc.io/different-patterns-in-communicating-between-web-components-7ac52771aeb8)
- [Cross Component Communication with Custom Events | Developer Quick Takes](https://www.youtube.com/watch?v=hIv22aTl3-g)
- [Custom events composed property](https://stackoverflow.com/questions/43061417/how-to-listen-for-custom-events-defined-web-component) and also [this](https://stackoverflow.com/questions/65349728/webcomponents-communicating-by-custom-events-cannot-send-data) and this[A complete guide on shadow DOM and event propagation](https://pm.dartus.fr/blog/a-complete-guide-on-shadow-dom-and-event-propagation/)
- [Handling data with Web Components](https://itnext.io/handling-data-with-web-components-9e7e4a452e6e)
- [If Web Components are so great, why am I not using them?](https://daverupert.com/2023/07/why-not-webcomponents/)
- [Custom Elements Everywhere](https://custom-elements-everywhere.com/): making sure frameworks and custom elements can be BFFs.

## Micro-frontends

- [I don’t understand micro-frontends](https://lucamezzalira.medium.com/i-dont-understand-micro-frontends-88f7304799a9#:~:text=Too%20often%20I%20saw%20people,been%20the%20best%20(or%20only))
- [billyjov/microfrontend-resources](https://github.com/billyjov/microfrontend-resources): a curated list of resources about Micro frontends grouped by types.
- [rajasegar/awesome-micro-frontends](https://github.com/rajasegar/awesome-micro-frontends): an awesome list of resources about Micro-Frontends architecture such as tools, books, posts, videos, talks and more.
- [ChristianUlbrich/awesome-microfrontends](https://github.com/ChristianUlbrich/awesome-microfrontends): a curated and hopefully awe-some list about Micro Frontends.














[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()
[]()