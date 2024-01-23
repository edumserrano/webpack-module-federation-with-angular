# Recommendations when using Webpack Module Federation

- [Intro](#intro)
- [Use Web components](#use-web-components)
- [Create wrapper components for remotes](#create-wrapper-components-for-remotes)
- [Development platform](#development-platform)
- [Breaking changes in micro frontends](#breaking-changes-in-micro-frontends)
- [Communications between micro frontends](#communications-between-micro-frontends)
- [A note on handling remote import failures](#a-note-on-handling-remote-import-failures)

## Intro

I don't have enough experience with Module Federation to properly back up some of the following statements so I recommend you exercise your own judgment as well. The below are my opinions.

## Use Web components

If you're going to use Webpack Module Federation, I think the best way to expose your remotes is by using [Web components](https://www.webcomponents.org/introduction). Web Components seem to provide the best experience for building micro frontend apps.

Note that:
> Custom components and widgets build on the Web Component standards, will work across modern browsers, and can be used with any JavaScript library or framework that works with HTML.[^2]
>

[^2]: [webcomponents.org](https://www.webcomponents.org/introduction)

Which means that Web components are also the best way for you to build a multi-framework app if you need to.

Lastly, if you always use Web components for building micro frontents then you end up standardizing how your micro frontends apps work in terms of exposing and consuming JS modules which might make a significant difference in large organizations.

## Create wrapper components for remotes

Create wrapper components to encapsulate the remote app you are consuming via Module Federation. This idea is exemplified in the [advanced-ng16 code demo](/code-demos/advanced-ng16/README.md#how-to-structure-your-micro-frontends) and although that code demo is an Angular app, I believe this concept can be used regardless of the frontend framework.

The main goal of using a wrapper component is to bridge the gap between an externally loaded JavaScript module and the consuming app. The wrapper component should contain all the necessary logic to load the mfe and expose any inputs and outputs required. Once you have a wrapper component, you can reuse it throughout your app without worrying with the fact that it's actually an mfe app.

This also means that, once you have a wrapper component, you can use it whilst taking advantage of any frontend framework specific patterns of the shell/host. For example, if the shell is an Angular app and you are consuming a Web component, then creating a wrapper for it will allow you to use Angular routing to load the component which otherwise you would not be able to.

Besides the above benefits, if you always create wrapper components for your remotes then you end up standardizing how your micro frontends apps work in terms of consuming remote JS modules, which might make a significant difference in large organizations.

> [!NOTE]
>
> I was first introduced to this idea by watching [Web Component-based Micro Frontends with Angular](https://www.youtube.com/watch?v=ee17YczpCpU).
>

## Development platform

When creating an mfe app, consider separating the app you run locally whilst in development from the app that you expose as a remote. This allows you to add behavior and even extra UI elements to facilitate the development and manual testing of the mfe app without affecting the exposed app.

Depending on your frontend framework and what you want to expose this might even be a simple task and require very little extra code. Most of the apps in the [code demos](/README.md#code-demos) fit into this description and throughout their READMEs you will find a `Dev platform` section explaining this idea in an appropriate fashion for each code demo.

Even if you have to do some extra code to get this separation I still think it's worth it. Check the `Dev platform and MFE platform` section of the [multi-version-ng](/code-demos/multi-version-ng/README.md#dev-platform-and-mfe-platform) README which talks about the development platform setup for the `mfe3-ng12` app.

> [!NOTE]
>
> The concept for this separation came from watching [Web Component-based Micro Frontends with Angular](https://www.youtube.com/watch?v=ee17YczpCpU).
>

## Breaking changes in micro frontends

In an ideal world the micro frontends are isolated and don't need to communicate with each other. However, in practice it will be unlikely that you have zero communication between your micro frontends. **In this case, I was thinking about what would happen when you need to make breaking changes to one mfe that is being consumed by multiple mfes.**

How can you deploy the changes without breaking your app? How can you deploy in a way that the consuming apps are ready for the breaking changes on the dependant mfe?

I haven't come across articles addressing this so I may be missing something and this isn't a problem at all but I wanted to call it out and get you thinking about it.

I actually think that the answer to this problem is to NOT make breaking changes. Meaning, always make your changes in a backwards compatible format. For example, if you've changed an input or an output in a way that would require changes from your consumers, then find a way to keep the original inputs/outputs working whilst also providing the new inputs/outputs. This would allow the consumers to migrate at their own pace and eventually you could delete the old inputs/outputs.

If the mfe your are changing is imported in different places of your app, you could also consider exposing a second module in the webpack configuration and let consumers change to it when ready. Something like this:

```ts
new ModuleFederationPlugin({
  ...
  exposes: {
    "./my-mfe": "..."
    "./my-mfe-v2": "..."
  },
  ...
})
```

Then deprecate the old module, `my-mfe`, when there's no more consumers. The idea is similar to how one would do API versioning and keep old versions of an endpoint until consumers migrated to the new version.

## Communications between micro frontends

For communications between mfe apps I think you will either:

1) Use the host app to orchestrate the communication between the different micro frontends. Meaning, the host will subscribe to the required events and pass the data to other micro frontends.
2) Publish custom events with `bubbles` true so that micro frontends can subscribe to the event without any orchestration from the host app.
3) Use the [shared section](/README.md#shared-dependencies) of the `ModuleFederationPlugin` configuration to share code across shell and remotes, for instance, code that can maintain state. You could then set the state in one mfe app and read it in another.

Besides frontend communication, you can also use the backend for communication. In a more extreme example, you could have zero communication done via the frontend and have all the communication done via explicit API calls to pull information and by using web sockets you can push updates to the frontend.

## A note on handling remote import failures

If you have a shell app that uses static Module Federation, meaning you declare your remotes in the shell's webpack configuration file, then your remote must be available when the app is starting up. Otherwise the entire app will fail as it fails to fetch the remote.

The same is true when you use dynamic Module Federation and you [load the remote entries at app startup](/docs/shared.md#improve-resolution-of-shared-dependencies-when-using-dynamic-module-federation).

I don't think this is talked enough on the articles about Module Federation but it's important to understand and plan accordingly. No one wants to deploy an app with several mfes and then have it completely failover because one of the mfes failed to load.

**In short, this is a call out for you to remember to graciously handle failures from loading remotes, specially if you're loading the remote entries at app startup. This is not done for you out of the box.**
