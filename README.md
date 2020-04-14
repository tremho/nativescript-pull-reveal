# nativescript-pull-reveal

[![Build Status][build-status]][build-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![TotalDownloads][total-downloads-image]][npm-url]
[![Twitter Follow][twitter-image]][twitter-url]

[build-status]:https://travis-ci.org/tremho/nativescript-pull-reveal.svg?branch=develop
[build-url]:https://travis-ci.org/tremho/nativescript-pull-reveal
[npm-image]:http://img.shields.io/npm/v/nativescript-pull-reveal.svg
[npm-url]:https://npmjs.org/package/nativescript-pull-reveal
[downloads-image]:http://img.shields.io/npm/dm/nativescript-pull-reveal.svg
[total-downloads-image]:http://img.shields.io/npm/dt/nativescript-pull-reveal.svg?label=total%20downloads
[twitter-image]:https://img.shields.io/twitter/follow/Tremho1.svg?style=social&label=Follow%20me
[twitter-url]:https://twitter.com/Tremho1

###### Android
![demo video](android-show1.gif)


###### iOS
![demo video](ios-show1.gif)|

#### (buggy on iOS) 
For reasons not fully understood, the iOS version displays odd and inconsistent behaviors.
These problems include:
- The drawer placement may begin off screen, making it unreachable
- The drawer contents render incorrectly and/or incompletely.
- This condition changes not only between different device/screen sizes, but also with differing sizes of source content.

The Pull Reveal component works well across all tested Android layout sizes.  The only caveat found here is that
very small displays may not be large enough to hold the full drawer content, and thus this bit of content will be
unreachable on these small devices.

## Features
- Panel slides over content from bottom, top, left, right, topLeft, topRight, bottomLeft or bottomRight.
- XML and code declarations
- Can be opened and closed programmatically
- Android and iOS (although, as noted, is currently buggy on iOS)

## Installation

To get started, install the plugin, per normal methods:

```shell
tns plugin add nativescript-pull-reveal
```

## Usage 

Although a Pull Reveal drawer can be added via code alone, the 
more common approach would be to declare it in XML and optionally
communicate with it from the page code, like most other Nativescript
components.

### XML

There are two components to declare in order to set up a
Pull Reveal component.
For the page you wish to include the PullReveal component, you
must first import the namespace for the control in the Page declaration, 
like this:

```xml
<Page
        navigatingTo="onNavigatingTo"
        xmlns="http://schemas.nativescript.org/tns.xsd"
        xmlns:pr="nativescript-pull-reveal"
>
```
This set the prefix `pr` as a reference to the PullReveal plugin module.
You can use any legal namespace variable name here, but `pr` is used 
throughout these examples.

There are two components in the Pull Reveal module you need to 
set up in order to stage a Pull Reveal component to your page.

First, you must declare an enclosing containter as a `PullRevealContext`.
This is done by putting the `<pr:PullRequestContext>` tag at the top of your
page, and encompassing your page layout.

For example, suppose your non-pull-reveal-enhanced page looks like this:

```xml
    <StackLayout> 
        <Image src="~/images/happyface.png"/>
        <Label text="Here is some content"/>
    </StackLayout>
``` 
then you want to wrap it as follows:

```xml
    <pr:PullRevealContext> 
        <StackLayout> 
            <Image src="~/images/happyface.png"/>
            <Label text="Here is some content"/>
        </StackLayout>
    </pr:PullRevealContext>
``` 
Finally, we need to create the PullReveal Drawer itself and 
populate its content:

```xml
    <pr:PullRevealContext> 
        <StackLayout> 
            <Image src="~/images/happyface.png"/>
            <Label text="Here is some content"/>
        </StackLayout>

        <pr:PullRevealDrawer id="pullDrawer" anchor="bottom" backgroundColor="black" color="whitesmoke" >
            <Label text="Item 1"/>
            <Label text="Item 2"/>
            <Label text="Item 3"/>
        </pr:PullRevealDrawer>
    </pr:PullRevealContext>
```
You should be able to put all types of content into the pull reveal drawer,
and indeed, the PullReveal makes a great vehicle for pull-out settings and configuration needs.

The PullReveal accepts the following properties of its own:

- `anchor` is one of 'bottom' or 'top' (defaults to 'bottom' if not
defined) and determines if the Pull Reveal comes down from the top or up
from the bottom.

- `exposed` defines the amount of drawer that should reveal itself into the context when the drawer is closed.
This defines the 'grabble' part of the component.  You may wish to style your drawer appearance to present an
appropriate looking 'handle', but this is of course optional.

Standard properties for layout containers may also be used.  
Styling options may of course also be applied via CSS classes, like other Nativescript components.

### Code

You may prefer to populate the child tree of the Pull Reveal content
via code, particularly if your content is highly dynamic.

One example of this is to have an empty PullReveal declared in 
the xml markup:
```xml
    <pr:PullRevealContext> 
        <StackLayout> 
            <Image src="~/images/happyface.png"/>
            <Label text="Here is some content"/>
        </StackLayout>

        <pr:PullRevealDrawer id="pullDrawer"/>
    </pr:PullRevealContext>
```

and in code, get the instance of this by Id, then
fill it with your content items.

```typescript
    import {PullReveal, PullRevealPage} from 'nativescript-pull-reveal';
    const pullDrawer = page.getViewById('pullDrawer');
    const lbl = new Label();
    lbl.text = "Hello World";
    pullDrawer.addChild(lbl);
    //... and so on
```

The plugin demo app shows this feature via the "add/remove foobar lines" option.  Clicking on this stepper
adds or removes child elements to the drawer.


#### Programatically opening and closing 

The `open()` and `close()` methods may be called by hendlers
to control the behavior of the drawer during actions.

For example, consider a slide-down control panel scenario.  On
this panel, there are several actions, implemented as buttons
whose 'tap' property points to a handler within the page code.
At the close of the handler function's operation, it calls the
`close()` method on the PullReveal to shut the drawer.  Something like this:

```typescript
export function handleSetting (args) {
    // assumes pullDrawer was defined previously
    //... handle the action the button represents
    // close the drawer
    pullDrawer.close()
}
```
The `close()` function without parameters will close the 
drawer immediately, with no animation.
However, you can pass an optional parameter containing the
number of milliseconds over which the door should animate closed.
Thus `pullDrawer.close(2000)` would close the door over a 2 second timespan.

There is also an `open()` method that may be called to programatically
open the PullReveal drawer. Like the `close()` method, it also
will accept an optional parameter of milliseconds over which to animate
the opening of the drawer.

This effect may be nice to use as a notification vehicle for various forms of 
information to be presented to a user in certain types of applications.

The plugin demo app shows this feature in the "Auto Open and Close" example.


-----

## Construction and API

`PullRevealContext` inherits from [`GridLayout`](https://docs.nativescript.org/api-reference/classes/_ui_layouts_grid_layout_.gridlayout)  and so has all of the
characteristics of that class.  It is used to provide a parallel context in the page
in which the Pull Reveal drawer can slide over the content.  

`PullRevealDrawer` inherits from [`StackLayout`](https://docs.nativescript.org/api-reference/modules/_ui_layouts_stack_layout_)  and so has all of the
characteristics of that class.  It is used as the parent container for the
content that you add to it.

`PullRevealDrawer` defines the following properties 

| Property | Default | Description |
| --- | --- | --- |
| `exposed` | '' | Optional specification of how much of the drawer should be revealed when closed (DIP width/height) |
| `anchor` | 'bottom' | one of: 'top', 'bottom', 'left', 'right', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'. Defines the origin home position of the control. | 

and the following methods:

| Method | Parameters | Description |
| --- | --- | --- |
| `open` | animTime: number | Opens the panel programatically, if optional animTime parameter is passed, it is the number of milliseconds the opening will take. |
| `close` | animTime: number | Closes the panel programatically, if optional animTime parameter is passed, it is the number of milliseconds the closing will take. |

#### CSS
The demo app utilizes CSS classes to style the drawer, assigning a background color or graphic and padding values.  You can create and apply
similar classes in your own applications to style your drawer as needed.

The plugin itself does not provide any CSS values.

## Known Issues

###### Very first 1.0.0 version was garbage
Don't use the 1.0.0 version, as it was, at best, a failed but inspirational prototype.  It suffered several 
structural failings and only worked in a limited set of contexts.

Version 1.1.0 is a completely re-written approach.
 
###### Problems with iOS!
Version 1.1.0 still has issues though, with inconsistencies on iOS.  
The gist of these problems are listed above, and on the [GitHub issues page](https://github.com/tremho/nativescript-pull-reveal/issues).

###### orientation response
The current version 1.1.0 does not respond properly to an orientation change.    

###### Version 1.0.0
- Found to be very buggy outside of limited demo context
- version 1.0.1 addressed some issues, but ultimately was not a fix.
- Scrapped the approach and started over for 1.1.0    

###### Version 1.1.0
- Working nicely on Android
- Demo context working acceptably on medium-sized iOS device (iphone 11 simulator used to test)

----------
  
## Source code and Contributing

The source for this package is maintained on GitHub at:
https://github.com/tremho/nativescript-pull-reveal

Structure of the project is based on the templates generated
with the [Nativescript Plugin Seed](https://docs.nativescript.org/plugins/building-plugins#the-nativescript-plugin-seed) project.

Comments and contributions welcome!
Please submit your Pull Requests, with as much explanation and examples you can provide to 
support your changes.

Outstanding issues and requests for help are listed here: https://github.com/tremho/nativescript-pull-reveal/issues

Or, feel free to email me at `steve@ohmert.com` to start
a discussion for other suggestions.
 
 
