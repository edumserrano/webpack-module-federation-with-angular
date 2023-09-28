# Webpack module federation examples

- [Description](#description)
- [Read me before exploring the code demos](#read-me-before-exploring-the-code-demos)
- [Code demos](#code-demos)
- [Debug](#debug)

## Description 

This repo came about as a result of my journey to learn how to use [webpack module federation](https://webpack.js.org/concepts/module-federation/).

There's a learning curve required to understand how to work with webpack module federation, which is even higher if you're not confortable with frontend development, and so I thought it would be useful to consolidate my learnings, code experiments and research articles into one place. 

**I hope this repo makes it easier for those who want to learn about webpack module federation.**

## Read me before exploring the code demos

Some of the code demos are variations of a concept where the main difference is how a remote webpack module is exposed. The main thing to keep in mind is that, at a high level, all of the code demos consist of:

1) An app that exposes a webpack module (a remote). The exposed webpack module can be anything: an Angular module, an Angular component, an Angular standalone component, a set of Angular routes, a web component, a function, etc. 
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
> The examples are mainly focused on using module federation with Angular apps but several concepts explained here are applicable regardless of the frontend technology used.
>

1) [basic-ng16](/code-demos/basic-ng16/README.md): the most bare-bones possible example of how to setup webpack module federation where the shell lazy loads an Angular module using Angular routing. This code demo does NOT make use of the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package which is usually used to setup module federation for Angular projects. The main idea is to show the basics for learning purposes. Both shell and remote app use Angular 16. 
   
2) [angular-architects-ng16](/code-demos/angular-architects-ng16/README.md): how to setup webpack module federation where the shell lazy loads an Angular module using Angular routing. Instead of a manual setup that is shown in the [basic-ng16](/code-demos/basic-ng16/README.md) code demo, this code demo used the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package, which is a package that aims to streamline the module federation setup. Both shell and remote app use Angular 16. 

3) [dynamic-ng16](/code-demos/dynamic-ng16/README.md): how to setup webpack module federation where the shell lazy loads an Angular module using Angular routing. This code demo is called dynamic because it does NOT require the remote to be declared in the shell's webpack configuration. Both shell and remote app use Angular 16. 
 
4) [component-ng16](/code-demos/component-ng16/README.md): how to setup webpack module federation where the shell dynamically instantiates and adds to the DOM an Angular component. This code demo does NOT use Angular routing. It does show how to pass inputs to the Angular component. Both shell and remote app use Angular 16. 

5) [component-directive-ng16](/code-demos/component-directive-ng16/README.md): how to setup webpack module federation where the shell dynamically instantiates and adds to the DOM an Angular component using an Angular directive. Both shell and remote app use Angular 16. 

6) [component-standalone-ng16](/code-demos/component-standalone-ng16/README.md): how to setup webpack module federation where the shell loads standalone Angular components from a remote using Angular routing or by dynamically loading the component. This also shows how a remote can expose Angular routes and how to consume them in the shell app. Both shell and remote app use Angular 16.

7) [web-component-ng16](/code-demos/web-component-ng16/README.md): how to setup webpack module federation where the shell loads a standalone Angular component that is exposed as a web component. Both shell and remote app use Angular 16.

## Debug

To debug any of the apps in the examples:
1) go to apps's URL and open your browser's dev tools (usually accessible via F12). Usually the examples will at least have the shell at http://localhost:4200 and one remote at http://localhost:4201.
2) go to the sources tab and locate the files under webpack:///src.
3) add breakpoints to help you step through and understand the code.

> **Note**
>
> You can also debug the remote from the shell. Go to the shell's URL, open the browser's dev tools and **once the remote has been loaded into the shell** you will find the code of the remote under webpack:///src as well.
> 