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
  private wpwidth: number;
  private wpheight: number;
  private pwidth: number;
  private pheight: number;
  private hwidth: number;
  private hheight: number;
  private minylat: number;
  private maxylat: number;
  private ylat: number = 0;
  private minxlat: number;
  private maxxlat: number;
  private xlat: number = 0;
  private minHt: number = 0;
  private dragspeed: number = 5;
  private _anchor: string;
  private _exposed: number;
  private label: string;
  // private grabArea: StackLayout; // not using a container due to bug
  private pullLabel: Label;
  private pullHandle: Label;

  constructor() {
    super();
    // todo: review
    this.paddingBottom = 0;
    this.paddingTop = 0;


    this._anchor = this.get('anchor') || 'bottom';
    this.label = this.get('label') || '';

    this.on('layoutChanged', (eventData: EventData) => {
      // console.log('LAYOUT CHANGED');
      const lbl = eventData.object as CommonContents;
      if (this._isLoaded) {
        if (!this._didLayout) {
          this._didLayout = true;
          setTimeout(() => {
            this.calcExtents();
            this.enforceExtents();
            this.close();
            this.translateY = this.ylat = this.maxylat;
          });
        }
      }
    });
    this.on('loaded', (eventData: EventData) => {
      // console.log('--onloaded event');
      this._isLoaded = true;
    });

    this.on(GestureTypes.pan, args => { this.onPan(args as PanGestureEventData); });
  }

  computeHeight ( view ) {
    let totalHeight = 0;
    view.eachChildView(child  => {
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

    if (args.state === GestureStateTypes.changed) {
      const xchange = args.deltaX / this.dragspeed;
      const ychange = args.deltaY / this.dragspeed;
      this.xlat += xchange;
      this.ylat += ychange;
      this.enforceExtents();
    }
    // console.log(`@ ${this.xlat}, ${this.ylat} of ${this.minxlat}, ${this.minylat} to ${this.maxxlat}, ${this.maxylat}`);
  }
  public recalcExtents() {
    this.calcExtents();
    if (this._anchor === 'bottom') {
      this.translateY = this.ylat = this.minylat;
    }
    this.enforceExtents();
  }
  public enforceExtents() {
    if (this.xlat < this.minxlat) {
      this.xlat = this.minxlat;
    } else if (this.xlat > this.maxxlat) {
      this.xlat = this.maxxlat;
    }
    if (this.ylat < this.minylat) {
      this.ylat = this.minylat;
    } else if (this.ylat > this.maxylat) {
      this.ylat = this.maxylat;
    }
    this.translateX = this.xlat;
    this.translateY = this.ylat;
  }

  public calcExtents () {
    // get the measurements we need
    const wrapper = this.parent as GridLayout;
    this.wpheight = wrapper.getMeasuredHeight() / scale;
    this.wpwidth = wrapper.getMeasuredWidth() / scale;

    this.width = this.wpwidth;

    let mheight = this.getMeasuredHeight();
    let cheight = this.computeHeight(this);
    let cwcheight = this.computeHeight(wrapper) - cheight;
    let scheight = mheight / scale;
    const screenHeight = screen.mainScreen.heightDIPs;

    const currentY = this.getLocationOnScreen().y;
    // console.log('screenHeight is ' + screenHeight);
    // console.log('currentY is ' + currentY);
    // console.log('mheight is ' + mheight);
    // console.log('cheight is ' + cheight);
    // console.log('cwcheight is ' + cwcheight);
    // console.log('scheight is ' + scheight);
    // console.log('scale is ' + scale);
    // console.log('minHt is ' + this.minHt);
    this.pheight = this.getMeasuredHeight() / scale;
    this.pwidth = this.getMeasuredWidth() / scale;
    // console.log(`Wrapper Pixel width and height ${this.wpwidth} x ${this.wpheight}`);
    // console.log(`Content Pixel width and height ${this.pwidth} x ${this.pheight}`);
    this.hwidth = this.hheight = this.exposed;
    // console.log(`Handle width and height ${this.hwidth} x ${this.hheight}`);

    let diff = (this.pheight - cwcheight) / 2;
    if (cwcheight !== this.wpheight && this._anchor === 'top') {
      diff = 0;
    }
    if (cwcheight > this.wpheight) {
      diff = 0;
    }
    // console.log('height diff is ' + diff);

    this.height = this.pheight;


    let ty = 0;
    let tx = 0;
    // console.log('anchor is ' + this._anchor);
    if (this._anchor === 'bottom') {
      ty = this.pheight - this.hheight - diff;
      this.maxylat = ty;
      this.minylat = ty - cheight + this.hheight;
      this.minxlat = this.maxxlat = 0;
    } else if (this._anchor === 'top') {
      ty = this.hheight - this.pheight + diff;
      this.minylat = ty;
      this.maxylat = diff;
      this.minxlat = this.maxxlat = 0;
    } else if (this._anchor === 'left') {
      tx = this.hwidth - this.pwidth;
      this.minxlat = tx;
      this.maxxlat = 0;
      this.minylat = this.maxylat = 0;
    } else if (this._anchor === 'right') {
      tx = this.pwidth - this.hwidth;
      this.maxxlat = tx;
      this.minxlat = 0;
      this.minylat = this.maxylat = 0;
    } else if (this._anchor === 'topLeft') {
      ty = this.hheight - this.pheight;
      this.minylat = ty;
      this.maxylat = 0;
      tx = this.hwidth - this.pwidth;
      this.minxlat = tx;
      this.maxxlat = 0;
    } else if (this._anchor === 'topRight') {
      ty = this.hheight - this.pheight;
      this.minylat = ty;
      this.maxylat = 0;
      tx = this.pwidth - this.hwidth;
      this.maxxlat = tx;
      this.minxlat = 0;
    } else if (this._anchor === 'bottomLeft') {
      ty = this.pheight - this.hheight;
      this.maxylat = ty;
      this.minylat = 0;
      tx = this.hwidth - this.pwidth;
      this.minxlat = tx;
      this.maxxlat = 0;
    } else if (this._anchor === 'bottomRight') {
      ty = this.pheight - this.hheight;
      this.maxylat = ty;
      this.minylat = 0;
      tx = this.pwidth - this.hwidth;
      this.maxxlat = tx;
      this.minxlat = 0;
    }
    // this.height = cheight;
  }

  /**
   * Programatically opens the panel to its full extent.
   * If `animTime` is given, the panel will open in steps across the given time
   * @param animTime Number of milliseconds across which panel should open
   *
   */
  public open (animTime: number): void  {
    let step = (this.maxylat - this.minylat) / animTime;
    const start = Date.now();
    let ty = this.translateY;
    let limit;
    if (this._anchor === 'bottom') {
      step = -step;
      limit = this.minylat;
    } else {
      limit = this.maxylat;
    }
    // console.log('opening....');

    if (!animTime) {
      this.translateY = limit;
      return;
    }

    const cycle = () => {
      const tm = Date.now() - start;
      ty += step * tm;
      if (ty < this.minylat) ty = this.minylat;
      if (ty > this.maxylat) ty = this.maxylat;
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
  public close (animTime: number = 0): void {
    this.recalcExtents();
    let stepy = animTime && (this.minylat - this.maxylat) / animTime;
    let stepx = animTime && (this.minxlat - this.maxxlat) / animTime;
    const start = Date.now();
    let ty = this.translateY;
    let tx = this.translateX;
    let limitx, limity;
    if (this._anchor.indexOf('bottom') === 0) {
      stepy = -stepy;
      limity = this.maxylat;
    } else {
      limity = this.minylat;
    }
    if (this._anchor.indexOf('ight') !== -1) {
      stepx = -stepx;
      limitx = this.maxxlat;
    } else {
      limitx = this.minxlat;
    }

    if (!animTime) {
      // console.log(`minx ${this.minxlat} miny ${this.minylat}, maxx ${this.maxxlat} maxy ${this.maxylat}`)
      // console.log(`closing ${this.anchor} at ${limitx}, ${limity}`);
      setTimeout(() => {
        this.translateY = this.ylat = limity;
        this.translateX = this.xlat = limitx;
      });
      return;
    }

    const cycle = () => {
      const tm = Date.now() - start;
      ty += stepy * tm;
      if (ty < this.minylat) ty = this.minylat;
      if (ty > this.maxylat) ty = this.maxylat;
      this.translateY = ty;
      tx += stepx * tm;
      if (tx < this.minxlat) tx = this.minxlat;
      if (tx > this.maxxlat) tx = this.maxxlat;
      this.translateX = tx;
      if (ty !== limity || tx !== limitx) {
        setTimeout(cycle);
      }
    };
    setTimeout(cycle);
  }

  /**
   * Gets the position of the drawer home. Either 'top' or 'bottom' (default)
   */
  public get anchor() {
    return this._anchor || 'bottom';
  }
  /**
   * Sets the position of the drawer home. Either 'top' or 'bottom' (default)
   */
  public set anchor(v: string) {
    this._anchor = v;
    if (this._didLayout) {
      this.recalcExtents();
      this.close();
    }
  }

  public get exposed() {
    return Number(this._exposed) || 8;
  }
  public set exposed(v) {
    this._exposed = Number(v);
    if (this._didLayout) {
      this.recalcExtents();
      // this.close();
    }
  }
}

