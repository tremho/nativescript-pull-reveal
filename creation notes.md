# Pull Reveal
### Second attempt

- Have it working for positioning from all 8 anchor points
- Drawer must contain any handle decorations, if desired.

- [X] I. change name from PullRevealPage to PullRevealContainer or
PullRevealContext, and from PullReveal to PullRevealDrawer.

- [X] II. make sure we readjust for dynamic changes
    - changing the anchor property
    - changing the exposed property
    - adding an item to the drawer
    - resizing an item in the drawer
    - change via properties, objects
    - change via CSS class name change
    
- [X] III. have drawer images for demo
    - for each ~~anchor point~~ style 
    
- [X] IV. Full Demo:
    __Happy face with drawer containing controls__
    - set anchor
    - set exposed 
    - add items to drawer
    - ~~close drawer (function test)~~
    - change style (demo css)
    - change picture (demo sizes)    
    
- [X] V. nested demo with multiple drawers
    - bottom
    - right
    - topLeft
        
- [X] VI. auto open and close demo
    - Since we don't have this in the drawer
    - nested page demo with button to open.
    - and one to close (could be in the drawer)
    - put a slider in drawer to adjust open/close time.
        - 0 - 5 seconds

- [ ] VII. Test and adjust on all platform sizes
    - [ ] android small (N/A size too small)
    - [X] android medium
    - [X] android large
    - [X] android xlarge
    - [ ] ios small (fails to reveal)
    - [X] ios medium (buggy but will have to do for now)
    - [ ] ios large (fails to reveal)
    - [ ] ios xlarge (fails to reveal)
    
               
- [ ] VIII. prep and publish
    - [ ] clean comments and console and remove `old.common.xx`
    - [ ] label menu with demo names
    - [ ] documentation
    - [ ] update version to 1.1.0
    - [ ] publish to npm (after verified passing build)
                