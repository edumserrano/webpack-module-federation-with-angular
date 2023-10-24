# Recommendations

- [TODO](#todo)

## TODO

Talk about what I believe are best practices

1) remotes (and maybe even shell), should have a dev mode, see video where he created a dev module using env variables to decide what module to bootstrap. 
2) creating a wrapper/host component. Expose the inputs and outputs again as the correct types instead of being unknown. The benefit of this approach is that now it becomes a regular angular component that you can use as any other angular component you create "locally". Note how the shell organizes the mfes in this example from the video https://github.com/fboeller/microfrontends-with-angular/tree/recording/projects/train-platform/src/micro-frontends.
3) using web components (probably no need for custom events using bubbles true if using a wrapper/host component). Best way to work with web components? Should use bootstrap function that allows for instance to choose the custom element name? Google why would one use web components vs Angular approach. What are the benefits of web components (I already have some links saved)?
4) note about breaking changes, make backwards compatible changes, expose different webpack module until you can delete the original remote module where the new webpack module uses functionality from the original one. This allows consumers to switch to consuming the new webpack module until you can then decommission the old one. Similar idea to API versioning
5) Add a note somewhere/recommended/best practices about this quote from https://www.npmjs.com/package/@angular-architects/module-federation:
    1) It also contains example code on how to do it using a loadRemoteEntry function
    ```
    If somehow possible, load the remoteEntry upfront. This allows Module Federation to take the remote's metadata in consideration when negotiating the versions of the shared libraries.
    ```
    2) Explain that without doing this if you had for instance  a shell using ng-15 and an mfe1 using ng-16 then the version of angular loaded would be ng-15 because that's the higher version that module federation knows about that is required. Calling loadRemoteEntry when loading modules dynamically or declaring your remotes statically in the webpack config remotes entry, let's module federation know about other shared packages and then it choose ng-16 as the highest angular version required. (Assuming angular is shared with strict false and singleton true).