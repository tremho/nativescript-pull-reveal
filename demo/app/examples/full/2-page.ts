
import {Observable} from '@nativescript/core'

let page, drawer;
let props = new Observable();

export function onNavigatingTo(args) {
    page = args.object;
    props.set('drawerTime', 1000);
    page.bindingContext = props;

    drawer = page.getViewById('drawer')
}

export function onOpen () {
    const t = props.get('drawerTime');
    drawer.open(t);
}

export function onClose () {
    const t = props.get('drawerTime');
    drawer.close(t);
}

export function onSliderLoaded (args) {
    const slider = args.object;
    slider.on("valueChange", (args) => {
        const v = Math.round(args.value);
        props.set('drawerTime', v);
    })}
