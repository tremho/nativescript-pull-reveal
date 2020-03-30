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

![demo video](android-movie.gif)


## Features
- Panel slides over content from top or from bottom
- XML and code declarations
- Can be open and closed programmatically
- Android and iOS

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

First, you must declare your page is hosting a PullReveal context.
This is done by putting the `<pr:PullRequestPage>` tag at the top of your
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
    <pr:PullRevealPage> 
        <StackLayout> 
            <Image src="~/images/happyface.png"/>
            <Label text="Here is some content"/>
        </StackLayout>
    </pr:PullRevealPage>
``` 
Finally, we need to create the PullReveal Drawer itself and 
populate its content:

```xml
    <pr:PullRevealPage> 
        <StackLayout> 
            <Image src="~/images/happyface.png"/>
            <Label text="Here is some content"/>
        </StackLayout>

        <pr:PullReveal id="pullDrawer" anchor="bottom" label="This is an example" backgroundColor="black" color="whitesmoke" >
            <Label text="Item 1"/>
            <Label text="Item 2"/>
            <Label text="Item 3"/>
        </pr:PullReveal>
    </pr:PullRevealPage>
```
You should be able to put all types of content into the pull reveal drawer,
and indeed, the PullReveal makes a great vehicle for pull-out settings and configuration needs.

The PullReveal accepts the following properties of its own:

- `anchor` is one of 'bottom' or 'top' (defaults to 'bottom' if not
defined) and determines if the Pull Reveal comes down from the top or up
from the bottom.

- `label` defines an optional text label that can be seen the visible
'grabbable' part of the component.  Use this for UI hints such as 'pull up to reveal settings', 
or similar.

Standard properties for layout containers may also be used.  
Styling options may of course also be applied via CSS classes, like other Nativescript components.

### Code

You may prefer to populate the child tree of the Pull Reveal content
via code, particularly if your content is highly dynamic.

One example of this is to have an empty PullReveal declared in 
the xml markup:
```xml
    <pr:PullRevealPage> 
        <StackLayout> 
            <Image src="~/images/happyface.png"/>
            <Label text="Here is some content"/>
        </StackLayout>

        <pr:PullReveal id="pullDrawer"/>
    </pr:PullRevealPage>
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


-----

## Construction and API

`PullRevealPage` inherits from [`GridLayout`](https://docs.nativescript.org/api-reference/classes/_ui_layouts_grid_layout_.gridlayout)  and so has all of the
characteristics of that class.  It is used to provide a parallel context in the page
in which the Pull Reveal drawer can slide over the content.  

`PullReveal` inherits from [`StackLayout`](https://docs.nativescript.org/api-reference/modules/_ui_layouts_stack_layout_)  and so has all of the
characteristics of that class.  It is used as the parent container for the
content that you add to it.

`PullReveal` defines the following properties 

| Property | Default | Description |
| --- | --- | --- |
| `label` | '' | Optional text to appear on the exposed portion of the PullReveal control |
| `anchor` | 'bottom' | either 'top' or 'bottom'. Defines the origin home position of the control. |

and the following methods:

| Method | Parameters | Description |
| --- | --- | --- |
| `open` | animTime: number | Opens the panel programatically, if optional animTime parameter is passed, it is the number of milliseconds the opening will take. |
| `close` | animTime: number | Closes the panel programatically, if optional animTime parameter is passed, it is the number of milliseconds the closing will take. |

#### CSS
The exposed portion of the Pull Reveal drawer consists of the 'handle', which features the text of two double - ended
arrows  (unicode 21D5) at the outermost edge, and followed by the label text, if it has been provided
using the 'label' property.

THe 'handle' portion of this area is tagged with the CSS class name 'pull-reveal-handle'
and the 'label' portion has the class name 'pull-reveal-label'.  These may be defined in your
application CSS to adjust appearances somewhat.
Be advised there may be unwanted side effects of changing the sizing of these elements very much. 

## Known Issues

###### Still early in development!
On 3/29/2020 the first version (1.0.0) was released for testing.

As issues arise, they will be recorded in this space.

###### Version 1.0.0
- Not working properly on iOS. 
  - Bottom anchor label is too low, exposed portion too small
  - slide stops not working or not in correct position
  - Top anchor beyond screen, making it unusable.  

###### Version 1.0.1
- Fixes the primary issues of version 1.0.0.
- Behavior is consistent between platforms for nominal use cases.

A few known issues remain:
  
- There is buggy behavior in Nativescript layout handling under iOS that may interfere with proper placement of
nested containers within the revealed content.  This issue is being investigated with Nativescript community experts.   
- Changing the handle or label sizes via CSS may not always result in the correctly
computed drawer stops and/or reveal sizing.  
- Changing properties (label, anchor) programatically has no effect. 
----------
  
 

## Source code and Contributing

The source for this package is maintained on GitHub at:
https://github.com/tremho/nativescript-pull-reveal

Structure of the project is based on the templates generated
with the [Nativescript Plugin Seed](https://docs.nativescript.org/plugins/building-plugins#the-nativescript-plugin-seed) project.

Comments and contributions welcome!
Please submit your Pull Requests, with as much explanation and examples you can provide to 
support your changes.

Feel free to email me at `steve@ohmert.com` to start
a discussion for other suggestions.
 
 
