# A guide to Webpack module federation using Angular

- [Description](#description)
- [Read me before exploring the code demos](#read-me-before-exploring-the-code-demos)
- [Code demos](#code-demos)
  - [Live Reload](#live-reload)
  - [Debug](#debug)
  - [Console errors](#console-errors)
  - [Why are all the Angular code demos done using either Angular 12 or Angular 16?](#why-are-all-the-angular-code-demos-done-using-either-angular-12-or-angular-16)

## Description 

This repo came about as a result of my journey to learn how to use [webpack module federation](https://webpack.js.org/concepts/module-federation/).

You can consider this repo as a learning course on webpack module federation. If you are new to webpack module federation and want to learn more about it then I advise you to go through the code demos one by one. Read their usage documentation, linked articles and explore the code. Do this and your knowledge on webpack module federation will go from zero to hero.

## Read me before exploring the code demos

Some of the code demos are variations of a concept where the main difference is how a remote webpack module is exposed. The main thing to keep in mind is that, at a high level, all of the code demos consist of:

1) An app that exposes a webpack module (a remote). The exposed webpack module can be anything: an Angular module, an Angular component, an Angular standalone component, a set of Angular routes, a Web component, a function, etc. 
2) An app that consumes a webpack module at runtime (a host/shell). The way the host consumes the remote webpack module depends on what is exposed on that module. For instance, consuming an Angular module is slightly different from consuming an Angular component.

This might seem like something obvious but if you understand this then you understand that there are infinite ways to expose Angular/Vue/React/etc apps/components as webpack modules and equally infinite ways to consume them. 

**There is no single best way to do things, some ways might enable functionality that others don't but in the end it's up to you to decide what you prefer for your use case.**

> **Warning**
>
> When working with webpack module federation you are the one that has to guarantee that your final app, the host/shell, will work as expected. 
> 
> **Webpack module federation is **just** a mechanism for integrating webpack modules at runtime. It does NOT take care of any frontend technology or javascript specific concern.** This means that you might have to do code so that when the remote is loaded into the host everything works as expected. Scenarios where you might have to do extra code apart from setting up webpack module federation:
> 
> - if both your host and your remote use Angular and both use routing. Otherwise, you might find that routing changes in the remote don't affect the shell as you expect or vice versa. 
> - if you want to load different Angular versions. If you simply try to more than one different version of Angular you will get an error about the fact that Angular Platform can only be instantiated once.
> - if want to have your host/shell consuming remotes implemented in different frontend technologies (Angular/Vue/React/etc).  
>
> And the list goes on... Don't be afraid though, there's always a way to get things to work. Just don't expect that everything will work out of the box. The [code demos section](#code-demos) gives you plenty of examples to get started and hopefully enough so that you can then adjust to any scenario that might not be listed here. 
>

## Code demos

> **Note**
>
> The examples are mainly focused on using module federation with Angular apps but a lot of the concepts explained here are applicable regardless of the frontend technology used.
> 
> If you are not familiar with webpack module federation it's recommended that you start by exploring the [basic-ng16](/basic-ng16/README.md) code demo.
>

If you go through the code demos one by one you will notice that several examples are very similar with minor adjustments on certain things like how webpack module federation is setup or how the remote is loaded by the shell. This is intentional, the code demos are meant to be as small and simple as possible and to introduce a single concept at a time.
 
| Demo                                                                                                                                                                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [basic-ng16](/code-demos/basic-ng16/README.md) </br></br> Both shell and remote app use Angular 16.                                                                        | The most bare-bones possible example of how to setup webpack module federation where the shell lazy loads an Angular module using Angular routing. This code demo does NOT make use of the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package which is usually used to setup module federation for Angular projects. </br></br> The main idea is to show the basics for learning purposes. </br></br> The remote webpack module contains an Angular module which the shell loads using Angular routing. |
| [angular-architects-ng16](/code-demos/angular-architects-ng16/README.md) </br></br> Both shell and remote app use Angular 16.                                              | Same as the [basic-ng16](/code-demos/basic-ng16/README.md) example but instead of manually doing all the module federation setup, it uses the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package which is a package that aims to streamline the module federation setup for Angular apps. </br></br> The remote webpack module contains an Angular module which the shell loads using Angular routing.                                                                                                  |
| [dynamic-ng16](/code-demos/dynamic-ng16/README.md) </br></br> Both shell and remote app use Angular 16.                                                                    | Shows how to setup module federation without having to declare a remote in the shell's webpack configuration file. This code demo is called dynamic because it does NOT require the remote to be declared in the shell's webpack configuration. </br></br> Despite not being part of this example, it would be simple to extend it and have the remote webpack module location fetched at runtime via an HTTP call. </br></br> The remote webpack module contains an Angular module which the shell loads using Angular routing.                                              |
| [dynamic-manifest-ng16](/code-demos/dynamic-manifest-ng16/README.md) </br></br> Both shell and remote app use Angular 16.                                                  | Same as the [dynamic-ng16](/code-demos/dynamic-ng16/README.md) example but shows how to use a manifest file to hold the configuration of the remotes. </br></br> The remote webpack module contains an Angular module which the shell loads using Angular routing.                                                                                                                                                                                                                                                                                                            |
| [component-ng16](/code-demos/component-ng16/README.md) </br></br> Both shell and remote app use Angular 16.                                                                | The shell dynamically instantiates an Angular component and adds it to the DOM. This example also shows how to pass inputs to the Angular component. </br></br> The remote webpack modules contain an Angular Module and an Angular component which the shell dynamically loads without using Angular routing. It shows 4 different ways to load the Angular module/component.                                                                                                                                                                                                |
| [component-standalone-ng16](/code-demos/component-standalone-ng16/README.md) </br></br> Both shell and remote app use Angular 16.                                          | The shell loads an Angular standalone component by using Angular routing and by dynamically instantiating an Angular standalone component and adding it to the DOM. This example also shows how to pass inputs to the Angular component and subscribe to its outputs. </br></br> The remote webpack module contains an Angular standalone component.                                                                                                                                                                                                                          |
| [component-directive-ng16](/code-demos/component-directive-ng16/README.md) </br></br> Both shell and remote app use Angular 16.                                            | Same as the [component-ng16](/code-demos/component-ng16/README.md) example but using a reusable Angular directive. This example also shows how to pass inputs to the Angular component and subscribe to its outputs. </br></br> The remote webpack module contains an Angular component. <br></br> The Angular directive in this code demo could also be used with Angular standalone components.                                                                                                                                                                             |
| [routes-ng16](/code-demos/routes-ng16/README.md) </br></br> Both shell and remote app use Angular 16.                                                                      | Using Angular routing, the shell loads a couple of remote Angular standalone components from the routes that are exposed from the mfe1 app. <br></br> The remote webpack module contains a variable that represents an array of Angular routes.                                                                                                                                                                                                                                                                                                                               |
| [web-component-ng16](/code-demos/web-component-ng16/README.md) </br></br>  Both shell and remote app use Angular 16.                                                       | Shows how to setup module federation where the shell loads a Web component created from an Angular standalone component. <br></br> This example also shows how to use the inputs and outputs of the converted Angular component, which are mapped to Web component custom properties and custom events, and how to get strict type checking and IDE auto-completion on HTML for web components.   <br></br> The remote webpack module contains a function that registers the Web component.                                                                                   |
| [web-component-directive-ng16](/code-demos/web-component-directive-ng16/README.md) </br></br>  Both shell and remote app use Angular 16.                                   | Same as the [web-component-ng16](/code-demos/web-component-ng16/README.md) example but using an Angular directive to bootstrap the Web component. <br></br> The remote webpack module executes a function that registers the Web component.                                                                                                                                                                                                                                                                                                                                   |
| [web-component-angular-architects-wrapper-ng16](/code-demos/web-component-angular-architects-wrapper-ng16/README.md) </br></br>  Both shell and remote app use Angular 16. | The shell uses a generic Angular component that acts as a wrapper for the remotely loaded Web component. It shows how to use the generic component directly on the HTML and with Angular routing. <br></br> This example also shows how to set properties and listen to events from the Web component. <br></br> The remote webpack module executes a function that registers the Web component.                                                                                                                                                                              |
| [multi-version-ng](/code-demos/multi-version-ng/README.md) </br></br>  TODO.                                                                                               | TODO. <br></br> TODO                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| [communication-custom-events-ng16](/code-demos/communication-custom-events-ng16/README.md) </br></br>  TODO.                                                               | TODO. <br></br> TODO                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| [communication-event-bus-ng16](/code-demos/communication-event-bus-ng16/README.md) </br></br>  TODO.                                                                       | TODO. <br></br> TODO                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| [advanced-ng16](/code-demos/advanced-ng16/README.md) </br></br>  TODO.                                                                                                     | TODO. <br></br> TODO                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

### Live Reload

Live reload works as expected. After you start both the shell app and the mfe app, if you make changes to the mfe app then the shell app will automatically refresh and load the changes from the mfe app.

### Debug

To debug any of the apps in the code demos:
1) go to apps's URL and open your browser's dev tools (usually accessible via F12). Usually the examples will at least have the shell at http://localhost:4200 and one remote at http://localhost:4201.
2) go to the sources tab and locate the files under webpack:///src.
3) add breakpoints to help you step through and understand the code.

> **Note**
>
> You can also debug the remote from the shell. Go to the shell's URL, open the browser's dev tools and **once the remote has been loaded into the shell** you will find the code of the remote under webpack:///src as well.
>

### Console errors

There shouldn't be any console errors on any of the code demos except for:

> Uncaught SyntaxError: Cannot use 'import.meta' outside a module.

This error only happens on the Angular apps and happens because:

> When serving module federation apps in **dev mode locally**, there'll be an error output to the console, import.meta cannot be used outside of a module, and the script that is coming from is styles.js. 
> 
> It's a known error output, but it doesn't actually cause any breakages from as far as our testing has shown. It's because Angular compiler attaches the styles.js file to the index.html in a script tag with defer.
It needs to be attached with type=module, but Angular can't make that change because it breaks HMR. They also provide no way of hooking into that process for us to patch it ourselves.
>
> **The good news is that the error doesn't propagate to production**, because styles are compiled to a CSS file , so there's no erroneous JS to log an error.
>

Source: [Advanced Angular Micro Frontends with Dynamic Module Federation](https://nx.dev/recipes/angular/dynamic-module-federation-with-angular).

> **Note**
>
> This error doesn't happen on the Angular 12 apps because those have `output.scriptType` set to `text/javascript` instead of `module` which also avoids the root cause of the problem described above.
> 

### Why are all the Angular code demos done using either Angular 12 or Angular 16?

Beginning with Angular 13, the CLI is emitting EcmaScript modules. This affects module federation setup since it affects how the remote exposes the webpack module and therefore how the shell can consume it. This means that the Angular 16 examples should work down to Angular 13 version, except in some cases where some Angular API to load the component dynamically is being used that might not exist or have changed since Angular 13. For Angular 12 versions we need to adjust the code. 
