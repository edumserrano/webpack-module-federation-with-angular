# Code demos overall notes

- [Description](#description)
- [Read me before exploring the code demos](#read-me-before-exploring-the-code-demos)
- [Live Reload](#live-reload)
- [Debug](#debug)
- [Console errors](#console-errors)

## Description

The code demos are mainly focused on using Webpack Module Federation with Angular apps but a lot of the concepts explained are applicable regardless of the frontend framework used.

If you're learning about Webpack Module Federation, then I advise you to through the code demos in the order they are presented. **Although each code demo is completely independent and has it's own README, each code demo also builds upon the knowledge and concepts of the previous ones**. Throughout the code and READMEs of the demos you will find links relevant to the concepts being discussed.

## Read me before exploring the code demos

Each code demo is meant to be a completely isolated example for a usage of Webpack Module Federation but build upon the knowledge gained from the previous demo. At a high level, all of the code demos consist of:

1) At least one app, a remote, that exposes a webpack module. The exposed webpack module can be anything: an Angular module, an Angular component, an Angular standalone component, a set of Angular routes, a Web component, a function, etc.
2) One app, a shell/host, that consumes a webpack module at runtime. The way the host consumes the remote webpack module depends on what is exposed on that module. For instance, consuming an Angular module is slightly different from consuming an Angular component.

The code demos explore a variation of methods to expose and consume Angular micro-frontends (MFEs). Angular MFEs can be exposed as an Angular module, Angular component, Angular standalone component, Angular routes, Web Component, etc and they can be consumed by another Angular app by using Angular routing, programatically without Angular routing, by declaring Web Components or Angular wrapper components on the HTML, etc.

There are many ways to expose Angular/Vue/React/etc apps as webpack modules and equally many ways to consume them.

**There is no single best way to do things, some ways might enable functionality that others don't but in the end it's up to you to decide what you prefer for your use case.**

> [!WARNING]
>
> When working with Webpack Module Federation you are the one that has to guarantee that the final app will work as expected.
>
> Webpack Module Federation is just a mechanism for integrating webpack modules at runtime. It does NOT take care of any frontend framework or javascript specific concern.
>
> Webpack Module Federation let's you load JavaScript modules at runtime, you take care of the integration.
>

## Live Reload

Live reload works as expected for all code demo apps. After you start both the shell app and the mfe(s) app(s), if you make changes to an mfe app then the shell app will automatically refresh and load the changes from the mfe app.

## Debug

To debug any of the apps in the code demos:
1) go to apps's URL and open your browser's dev tools. Usually the examples will at least have a shell at http://localhost:4200 and one remote at http://localhost:4201.
2) go to the sources tab and locate the files under webpack:///src.
3) add breakpoints to any file under webpack:///src to help you step through and understand the code.

> [!NOTE]
>
> You can also debug the remote mfe from the shell app. Go to the shell's URL, open the browser's dev tools and **once the remote has been loaded into the shell** you will find the code of the remote under webpack:///src as well.
>

## Console errors

There shouldn't be any console errors on any of the code demos except for:

> Uncaught SyntaxError: Cannot use 'import.meta' outside a module.

This error only happens on the Angular apps and happens because:

> [^1] When serving module federation apps in **dev mode locally**, there'll be an error output to the console, import.meta cannot be used outside of a module, and the script that is coming from is styles.js.
>
> It's a known error output, but it doesn't actually cause any breakages from as far as our testing has shown. It's because Angular compiler attaches the styles.js file to the index.html in a script tag with defer.
It needs to be attached with type=module, but Angular can't make that change because it breaks HMR. They also provide no way of hooking into that process for us to patch it ourselves.
>
> **The good news is that the error doesn't propagate to production**, because styles are compiled to a CSS file , so there's no erroneous JS to log an error.
>

[^1]: [Advanced Angular Micro Frontends with Dynamic Module Federation](https://nx.dev/recipes/angular/dynamic-module-federation-with-angular#dashboard-application).

> [!NOTE]
>
> This error doesn't happen on older Angular apps, such as Angular 12 apps, because those have `output.scriptType` set to `text/javascript` instead of `module` which also avoids the root cause of the problem described above.
>

