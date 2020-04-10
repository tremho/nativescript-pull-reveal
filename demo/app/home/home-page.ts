import { EventData } from 'tns-core-modules/data/observable';
import { Page, NavigatedData } from 'tns-core-modules/ui/page'


let page;

export function onNavigatingTo(args: NavigatedData) {
   page = <Page>args.object;
}

export function onNested1 (args: EventData) {
    console.log('Nested 1');
    page.frame.navigate('examples/nested/1-page')
}
export function onNested2 (args: EventData) {
    console.log('Nested 2');
    page.frame.navigate('examples/nested/2-page')
}
export function onNested3 (args: EventData) {
    console.log('Nested 3');
    page.frame.navigate('examples/nested/3-page')
}

export function onFull1 (args: EventData) {
    console.log('Full 1');
    page.frame.navigate('examples/full/1-page')
}
export function onFull2 (args: EventData) {
    console.log('Full 2');
    page.frame.navigate('examples/full/2-page')
}
export function onFull3 (args: EventData) {
    console.log('Full 3');
    page.frame.navigate('examples/full/3-page')
}
