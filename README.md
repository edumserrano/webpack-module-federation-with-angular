# Webpack module federation examples

- [Description](#description)
- [Example's list](#examples-list)
- [Debug](#debug)

## Description 

Examples of how to setup webpack module federation. 

If you are not familiar with webpack module federation it's recommended that you start by reading and exploring the [basic-ng16](/basic-ng16/README.md) example. Although this example uses angular, it goes over the basics for setting up webpack module federation which you can use with any frontend technology.

## Example's list

1) [basic-ng16](/basic-ng16/README.md): the most bare-bones possible example of how to setup webpack module federation where the shell lazy loads an angular module using angular routing. This example does NOT make use of the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package which is usually used to setup module federation for angular projects. The main idea is to show the basics for learning purposes. Both shell and remote app use angular 16. 
   
2) [angular-architects-ng16](/angular-architects-ng16/README.md): how to setup webpack module federation where the shell lazy loads an angular module using angular routing. Instead of a manual setup that is shown in the [basic-ng16](/basic-ng16/README.md) example, this example used the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package, which is a package that aims to streamline the module federation setup. Both shell and remote app use angular 16. 

3) [dynamic-ng16](/dynamic-ng16/README.md): how to setup webpack module federation where the shell lazy loads an angular module using angular routing. This example is called dynamic because it does NOT require the remote to be declared in the shell's webpack configuration. Both shell and remote app use angular 16. 
 
4) [component-ng16](/component-ng16/README.md): how to setup webpack module federation where the shell dynamically instantiates and adds to the DOM an angular component. This example does NOT use angular routing. It does show how to pass inputs to the angular component. Both shell and remote app use angular 16. 

5) [component-directive-ng16](/component-directive-ng16/README.md): how to setup webpack module federation where the shell dynamically instantiates and adds to the DOM an angular component using an angular directive. Both shell and remote app use angular 16. 

6) [component-standalone-ng16](/component-standalone-ng16/README.md): how to setup webpack module federation where the shell loads standalone angular components from a remote using angular routing or by dynamically loading the component. This also shows how a remote can expose angular routes and how to consume them in the shell app. Both shell and remote app use angular 16.

7) [web-component-ng16](/web-component-ng16/README.md): how to setup webpack module federation where the shell loads a standalone angular component that is exposed as a web component. Both shell and remote app use angular 16.

## Debug

To debug any of the apps in the examples:
1) go to apps's URL and open your browser's dev tools (usually accessible via F12). Usually the examples will at least have the shell at http://localhost:4200 and one remote at http://localhost:4201.
2) go to the sources tab and locate the files under webpack:///src.
3) add breakpoints to help you step through and understand the code.

> **Note**
>
> You can also debug the remote from the shell. Go to the shell's URL, open the browser's dev tools and **once the remote has been loaded into the shell** you will find the code of the remote under webpack:///src as well.
> 