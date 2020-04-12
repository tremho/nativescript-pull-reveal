
import { Observable } from '@nativescript/core';
import { Label } from '@nativescript/core/ui/label';

let page;
let formStructure, formData;
let drawer;
let foolabs = [];
let pageData = new Observable();

export function onNavigatingTo (args) {
    page = args.object;
    page.bindingContext = pageData;

    drawer = page.getViewById('drawer');

    pageData.set('picSize', 200);
    pageData.set('contentLabel', 'Have a nice day!');

    formStructure = {
        'isReadOnly': false,
        'commitMode': 'Immediate',
        'validationMode': 'Immediate',
        'propertyAnnotations':
            [
                {
                    'name': 'style',
                    'index': 0,
                    'editor': 'SegmentedEditor',
                    'valuesProvider': ['plain', 'wooden', 'metal']
                },
                {
                    'name': 'mainImageSize',
                    'index': 1,
                    'editor': 'Slider',
                    'editorParams': {
                        'min': 100,
                        'max': 300
                    }
                },
                {
                    'name': 'exposed',
                    'index': 3,
                    'editor': 'Slider',
                    'editorParams': {
                        'min': 8,
                        'max': 40
                    }
                },
                {
                    'name': 'foobarLines',
                    'index': 4,
                    'editor': 'Stepper',
                    'editorParams': {
                        'min': 0,
                        'max': 5
                    }
                },
                {
                    'name': 'anchor',
                    'index': 5,
                    'editor': 'SegmentedEditor',
                    'valuesProvider': ['bottom', 'top', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right']
                }
            ]
    };

    formData = {
        // wantserver: true,
        // wantPickedData: true,
        // trackSmoothing: true,
        // accuracySetting: 'auto'
        foobarLines: 0, // stepper 0-5
        mainImageSize: 200, // slider 100-300
        style: 'nomrmal', // segmentedEditor, like acc setting
        exposed: 20, // slider 8-40
        anchor: 'bottom' // segmentedEditor, like acc setting
    };

    pageData.set("formStructure", formStructure);
    pageData.set("formData", formData);
}

export function onPropertyCommitted (args) {
    const pname = args.propertyName;
    const data = pageData.get('formData');
    const value = data[pname];
    switch (pname) {
        case 'foobarLines':
            changeFoobarLines(value);
            break;
        case 'mainImageSize':
            changeMainImageSize(value);
            break;
        case 'style':
            changeStyle(value);
            break;
        case 'exposed':
            changeExposed(value);
            break;
        case 'anchor':
            changeAnchor(value);
            break;
    }
    console.log('value for ' + pname + ' is ' + value);
}

/**
 * This function adds content to the drawer
 * in the form of a series of text labels
 *
 * This demonstrates that we can alter the contents of the drawer in real time.
 *
 * Note that we must recalc the drawer layout after adding
 * because the 'layoutchanged' event isn't firing as expected here
 * for this action.
 * @param value
 */
function changeFoobarLines (value) {
    console.log('change foobar line count to ' + value);
    let newCount = value;
    let oldCount = foolabs.length;
    if (newCount > oldCount) {
        for (let i = oldCount; i < newCount; i++) {
            let label = new Label();
            label.text = 'foobar item ' + (i + 1);
            foolabs.push(label);
            drawer.addChild(label);
        }
    }
    else {
        while (oldCount > newCount) {
            let child = foolabs.pop();
            drawer.removeChild(child);
            oldCount--;
        }
    }
    // We must recalculate the drawer extents, but
    // we also must do that on a timeout to circumvent {N) layout race.
    setTimeout(() => {
        drawer.recalcExtents();
    });
}

/**
 * Changes the size of the happy face image in the main context,
 *
 * This demonstrates we can change the content layout of the main context in real time.
 *
 * @param value
 */
function changeMainImageSize (value) {
    console.log('change main image size to ' + value + '  x ' + value);
    pageData.set('picSize', value);
}

/**
 * Change the CSS style appled to the drawer.
 *
 * This demonstrates the ability to style the drawer appearance
 *
 * @param value
 */
function changeStyle (value) {
    console.log('change style to ' + value);

    drawer.className = 'drawer-' + value;
}

/**
 * Changes the amount of drawer 'handle' to expose for polling when docked in closed position
 *
 * This demonstrates more options control over the drawer appearance and behavior.
 *
 * @param value
 */
function changeExposed (value) {
    console.log('exposed amount changed to ' + value);

    drawer.exposed = value;
}

/**
 * Changes the anchor for the drawer pull.
 *
 * This demonstrates the different anchoring options for where the drawer pull from and docks to.
 *
 * @param value
 */
function changeAnchor (value) {
    console.log('anchor changed to ' + value);

    if (value === 'top-left') value = 'topLeft';
    if (value === 'top-right') value = 'topRight';
    if (value === 'bottom-left') value = 'bottomLeft';
    if (value === 'bottom-right') value = 'bottomRight';

    drawer.anchor = value;

}

