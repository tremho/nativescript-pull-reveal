import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout';
import { Label } from 'tns-core-modules/ui/label';
import { PercentLength } from 'tns-core-modules/ui/styling/style-properties';
import { GestureTypes, GestureStateTypes, PanGestureEventData } from "tns-core-modules/ui/gestures";
import { EventData } from 'tns-core-modules/data/observable';
import { screen } from 'tns-core-modules/platform';
import anim = android.R.anim;
const scale = screen.mainScreen.scale;

/**
 * Defines the GridLayout wrapper that must hold the page content
 */
export class CommonWrapper extends GridLayout {
  // a grid is used to allow full-range overlay
}

/**
 * Defines our sliding container that rests at either the bottom or top
 * and slides into the GridLayout (PullRevealPage) to cover the parallel
 * content provided by the user.
 */
export class CommonContents extends StackLayout {
  // this is the drawer itself, and it belongs to its wrapper parent.
  private _isLoaded: boolean;
  private _didLayout: boolean;
  private minxlat: number;
  private maxxlat: number;
  private xlat: number = 0;
  private minHt: number = 30;
  private dragspeed: number = 5;
  private anchor: string;
  private label: string;

  constructor() {
    super();
    // todo: review
    this.width = PercentLength.parse('100%');
    this.paddingBottom = 0;
    this.paddingTop = 0;

    this.anchor = this.get('anchor') || 'bottom';
    this.label = this.get('label') || '';

    this.on('layoutChanged', (eventData: EventData) => {
      const lbl = eventData.object as CommonContents;
      if (this._isLoaded) {
        if (!this._didLayout) {
          this._didLayout = true;
          setTimeout(() => {
            // get the measurements we need
            let mheight = this.getMeasuredHeight();
            let cheight  = this.computeHeight();
            let scheight = mheight / scale;
            const pheight = Number(this.height) || 0;
            const screenHeight = screen.mainScreen.heightDIPs;
            console.log(this.getLocationOnScreen());
            const currentY = this.getLocationOnScreen().y;
            console.log('screenHeight is ' + screenHeight);
            console.log('currentY is ' + currentY);
            console.log('mheight is ' + mheight);
            console.log('cheight is ' + cheight);
            console.log('pheight is ' + pheight);;
            console.log('scale is ' + scale);


            let ty;
            console.log('anchor is ' + this.anchor);
            if (this.anchor === 'bottom') {
              if (this.ios) {
                ty = currentY + screenHeight - cheight + this.minHt * scale;
                this.minxlat = ty - cheight + this.minHt;
                this.maxxlat = ty;
                this.xlat = ty;
                this.height = cheight;
              } else {
                // android bottom
              }
            } else {
              // top...
              if (this.ios) {
                ty = currentY - screenHeight + cheight - this.minHt * scale;
                this.minxlat = ty;
                this.maxxlat = ty + cheight - this.minHt;
                this.xlat = ty;
                this.height = cheight;
              } else {
                // android top
              }
            }
            console.log('------')
            console.log('ty is ' + ty);
            console.log('minxlat is ' + this.minxlat);
            console.log('maxxlat is ' + this.maxxlat);
            console.log('minHt is ' + this.minHt);
            this.translateY = this.xlat;
          });
        }
      }
    });
    this.on('loaded', (eventData: EventData) => {
      this._isLoaded = true;
      ///
      // todo: replace this multiline thing with a stacklayout with icon and label
      ///
      const labelText = this.label;
      const pullLabel = new Label();
      pullLabel.marginBottom = 0;
      pullLabel.paddingBottom = 0;
      pullLabel.fontSize = 10;
      pullLabel.textWrap = true;
      pullLabel.textAlignment = 'center';
      pullLabel.paddingTop = 0;
      let t;
      if (this.anchor === 'bottom') {
        t = '\u21D5\u21D5\n';
        if (labelText) t += labelText;
        this.insertChild(pullLabel, 0);
      } else {
        t = labelText + '\n\u21D5\u21D5';
        this.addChild(pullLabel);
      }
      pullLabel.text = t;

    });

    this.on(GestureTypes.pan, args => { this.onPan(args as PanGestureEventData); });
  }

  computeHeight () {
    let totalHeight = 0;
    this.eachChildView((child ) => {
      const h = child.getMeasuredHeight() / scale;
      totalHeight += h;
      return true;
    });
    return totalHeight;
  }

  /**
   * Handles the dragging action that moves the panel across the view.
   * @param args
   */
  onPan (args: PanGestureEventData): void {

    const change = args.deltaY;

    if (this.anchor === 'bottom') {
      if (args.state === GestureStateTypes.changed) {
        const change = args.deltaY / this.dragspeed;
        this.xlat += change;
        if (this.xlat < this.minxlat) {
          this.xlat = this.minxlat;
        } else if (this.xlat > this.maxxlat) {
          this.xlat = this.maxxlat;
        }
        this.translateY = this.xlat;
      }
    } else {
      // top
      const change = args.deltaY / this.dragspeed;
      this.xlat += change;
      if (this.xlat < this.minxlat) {
        this.xlat = this.minxlat;
      } else if (this.xlat > this.maxxlat) {
        this.xlat = this.maxxlat;
      }
      this.translateY = this.xlat;
    }
    console.log(`moved ${change}. xlat is ${this.xlat} height is ${this.height} ${this.minxlat}, ${this.maxxlat}`);
  }

  /**
   * Programatically opens the panel to its full extent.
   * If `animTime` is given, the panel will open in steps across the given time
   * @param animTime Number of milliseconds across which panel should open
   *
   */
  public open (animTime: number): void  {
    let step = (this.maxxlat - this.minxlat) / animTime;
    const start = Date.now();
    let ty = this.translateY;
    let limit;
    if (this.anchor === 'bottom') {
      step = -step;
      limit = this.minxlat;
    } else {
      limit = this.maxxlat;
    }
    console.log('opening....');

    if (!animTime) {
      this.translateY = limit;
      return;
    }

    const cycle = () => {
      const tm = Date.now() - start;
      ty += step * tm;
      if (ty < this.minxlat) ty = this.minxlat;
      if (ty > this.maxxlat) ty = this.maxxlat;
      this.translateY = ty;
      if (ty !== limit) {
        setTimeout(cycle);
      }
    };
    setTimeout(cycle);
  }

  /**
   * Programatically opens the panel to its full extent.
   * If `animTime` is given, the panel will close in steps across the given time
   * @param animTime Number of milliseconds across which panel should close
   *
   */
  public close (animTime: number): void {
    let step = (this.minxlat - this.maxxlat) / animTime;
    const start = Date.now();
    let ty = this.translateY;
    let limit;
    if (this.anchor === 'bottom') {
      step = -step;
      limit = this.maxxlat;
    } else {
      limit = this.minxlat;
    }
    console.log('closing....');

    if (!animTime) {
      this.translateY = limit;
      return;
    }

    const cycle = () => {
      const tm = Date.now() - start;
      ty += step * tm;
      if (ty < this.minxlat) ty = this.minxlat;
      if (ty > this.maxxlat) ty = this.maxxlat;
      this.translateY = ty;
      if (ty !== limit) {
        setTimeout(cycle);
      }
    };
    setTimeout(cycle);
  }

  // /**
  //  * Gets the text that should appear on the 'handle' of the drawer.
  //  */
  // public get label() {
  //   return this.get('label') || '';
  // }
  // /**
  //  * Sets the text that should appear on the 'handle' of the drawer.
  //  */
  // public set label(v: string) {
  //   this.set('label', v);
  // }
  // /**
  //  * Gets the position of the drawer home. Either 'top' or 'bottom' (default)
  //  */
  // public get anchor() {
  //   return this.get('anchor') || 'bottom';
  // }
  // /**
  //  * Sets the position of the drawer home. Either 'top' or 'bottom' (default)
  //  */
  // public set anchor(v: string) {
  //   this.set('anchor', v);
  // }
}

