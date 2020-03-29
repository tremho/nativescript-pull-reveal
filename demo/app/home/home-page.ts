import { PullReveal } from 'nativescript-pull-reveal';
import { EventData } from 'tns-core-modules/data/observable';

/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import { NavigatedData, Page } from "tns-core-modules/ui/page";

let pullDrawer;

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    pullDrawer = page.getViewById('pullDrawer')
}

export function closeDrawer (args:EventData) {
    console.log('close drawer');
    pullDrawer.close(3000);
    setTimeout(() => {
        console.log('starting open')
        pullDrawer.open(2000)
    }, 5000)
}
