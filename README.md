# Webpack module federation examples

- [Description](#description)
- [Example's list](#examples-list)

## Description 

Examples of how to setup webpack module federation. 

If you are not familiar with webpack module federation it's recommended that you start by reading and exploring the [basic-ng16](/basic-ng16/README.md) example. Although this example uses angular, it goes over the basics for setting up webpack module federation which you can use with any frontend technology.

## Example's list

1) [basic-ng16](/basic-ng16/README.md): the most bare-bones possible example of how to setup webpack module federation where the shell lazy loads an angular module using angular routing. This example does NOT make use of the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package which is usually used to setup module federation for angular projects. The main idea is to show the basics for learning purposes. Both shell and remote app use angular 16. 
   
2) [angular-architects-ng16](/angular-architects-ng16/README.md): how to setup webpack module federation where the shell lazy loads an angular module using angular routing. Instead of a manual setup that is shown in the [basic-ng16](/basic-ng16/README.md) example, this example used the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package, which is a package that aims to streamline the module federation setup. Both shell and remote app use angular 16. 

3) [dynamic-ng16](/dynamic-ng16/README.md): how to setup webpack module federation where the shell lazy loads an angular module using angular routing. This example is called dynamic because it does NOT require the remote to be declared in the shell's webpack configuration. Both shell and remote app use angular 16. 
 
4) [component-ng16](/component-ng16/README.md): how to setup webpack module federation where the shell dynamically instantiates and adds to the DOM an angular component. This example does NOT use angular routing. It does show how to pass inputs to the angular component. Both shell and remote app use angular 16. 
