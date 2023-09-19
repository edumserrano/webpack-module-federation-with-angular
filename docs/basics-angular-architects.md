# Basics of @angular-architects/module-federation npm package

- [Description](#description)
- [Webpack module federation setup](#webpack-module-federation-setup)
- [What if I want to know what this package is doing for me?](#what-if-i-want-to-know-what-this-package-is-doing-for-me)

## Description

The [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package aims to streamline the setup of webpack module federation for angular projects. For more information read:
- [the readme page for the @angular-architects/module-federation npm package](https://www.npmjs.com/package/@angular-architects/module-federation?activeTab=readme)
- [the tutorial for the @angular-architects/module-federation plugin](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md)

## Webpack module federation setup

To setup webpack module federation using the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) npm package:

- install the package on both the shell and remote apps with:
```
npm i -D @angular-architects/module-federation
```
- configure the remote app to act as a remote via:
```
ng g @angular-architects/module-federation:init --project mfe1-ng16 --port 4201 --type remote
```
- configure the shell app to act as a host via:
```
ng g @angular-architects/module-federation:init --project shell-ng16 --port 4200 --type host
```
- update the `exposes` block on the webpack configuration file for the remote app so that it exposes the desired file.
- update the `remotes` block on the webpack configuration file for the shell app so that it points to the location/URL where the external webpack module from the remote app is available.

> **Note**
> 
> The last step which updates the `remotes` on the shell app might not be necessary. It's possible to leave the `remotes` block on the webpack configuration file for the shell empty and dynamically load the external webpack module using helper functions from the `@angular-architects/module-federation` package. For a code demo see the [dynamic-ng16](../dynamic-ng16/README.md) example. 
>

## What if I want to know what this package is doing for me?

The `@angular-architects/module-federation` npm package does a lot of work for us when configuring webpack module federation for angular. Everything listed in the [Webpack module federation](/basic-ng16/README.md#webpack-module-federation), the [Webpack configuration file](/basic-ng16/README.md#webpack-configuration-file) and the [Angular configuration file](/basic-ng16/README.md#angular-configuration-file) sections of the README for the [basic-ng16](/basic-ng16/README.md#description) example is done by this package.

The webpack configuration file is streamlined with the help of functions such as the `withModuleFederationPlugin` and `shareAll` functions. 