# Pitfalls

- [TODO](#todo)

## TODO

https://www.angulararchitects.io/en/blog/pitfalls-with-module-federation-and-angular/
https://www.angulararchitects.io/en/blog/multi-framework-and-version-micro-frontends-with-module-federation-the-good-the-bad-the-ugly/

> **Warning**
>
> When working with Webpack Module Federation you are the one that has to guarantee that the final app will work as expected. 
> 
> **Webpack Module Federation is **just** a mechanism for integrating webpack modules at runtime. It does NOT take care of any frontend framework or javascript specific concern.** This means that you might have to do code so that when the remote is loaded into the host everything works as expected. Scenarios where you might have to do extra code apart from setting up Webpack Module Federation:
> 
> - if both your host and your remote use Angular and both use routing. Otherwise, you might find that routing changes in the remote don't affect the shell as you expect or vice versa. 
> - if you want to load different Angular versions. If you simply try to more than one different version of Angular you will get an error about the fact that Angular Platform can only be instantiated once.
> - if want to have your host/shell consuming remotes implemented in different frontend technologies (Angular/Vue/React/etc).  
>
> And the list goes on... Don't be afraid though, there's always a way to get things to work. Just don't expect that everything will work out of the box. The [code demos list](../README.md#code-demos) gives you plenty of examples to get started and hopefully enough so that you can then adjust to any scenario that might not be listed here. 

mainly reference the pitfall article from angular architects and a bit of code on that youtube video where they propagate route changes to angular components.
    1)  Mention this is required because:
    ```
    Note that in a micro frontend world routing can be a bit tricky (even if you don't mix frontend technologies and write everything in Angular for instance). You might want your several components to react to a route change, you might just want to have an internal route change that doesnt change the url, etc etc
    Each scenario will require you to do the appropriate code, these things don't work out of the box. See Angular pitfalls article and the method they provide to connect Angular routers.

    ALSO

    Note somewhere that the bootstrap that connects the router events might be something similar to this https://github.dev/fboeller/microfrontends-with-angular/blob/72f63c1fc6ea3f804557b0877b45bb810bdea992/projects/train-platform/src/micro-frontends/micro-frontend-routing.directive.ts#L48
    ```