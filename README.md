# @terrahq/collapsify.js

Javascript module for accordion/collapse/tabs written in Vanilla js.
[> examples](https://collapsify-terra.netlify.app/)

## Usage

### Install

```sh
npm install @terrahq/collapsify
```

### Import

```javascript
import Collapsify from "@terrahq/collapsify";
```

### Initialize

```javascript
new Collapsify(options);
```

### Markup

#### Minimum markup

```html
<!--
    Add data attribute, button/content element.
    Control Button:  data-{namespace}-control="{ID}" * multiple elements
    Toggle Content:  data-{namespace}-content="{ID}" * only one element
 -->
<button type="button" data-collapsify-control="uniqID">Show/Hide Content</button>

<div data-collapsify-content="uniqID">Toggle Content</div>
```

#### With `aria-*` attribute for accessibility

```html
<button type="button" data-collapsify-control="uniqID" aria-expanded="false" aria-controls="contentID">Show/Hide Content</button>

<div id="contentID" data-collapsify-content="uniqID" aria-hidden="true">Toggle Content</div>
```

## Options

| Option Name       | Type                                                      | Default                   | Desc                                                                                                                                                |
| ----------------- | --------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| nameSpace         | string                                                    | "collapsify"              | Set namespace for "toggleButtonAttr", "toggleContentAttr" & "toggleSelectOptionsAttr"                                                               |
| toggleButtonAttr  | string                                                    | "data-collapsify-control" | data attribute for Button Element                                                                                                                   |
| toggleContentAttr | string                                                    | "data-collapsify-content" | data attribute for Content                                                                                                                          |
| dropdownElement   | HTMLSelectElement                                         | -                         | HTML dropdown element for tablets/mobiles. Stays in sync with the active tab in both directions: selecting from dropdown activates the tab and vice versa. |
| isTab             | boolean                                                   | false                     | Set to true when using as tabs (prevents closing the active tab)                                                                                    |
| activeClass       | string                                                    | "--is-active"             | Suffix added to the element's first class to form the active class (e.g. `c--btn-a--is-active`)                                                     |
| isAnimation       | boolean                                                   | true                      | Enable animated slide transition                                                                                                                    |
| closeOthers       | boolean                                                   | true                      | Close other content panels when one opens                                                                                                           |
| animationSpeed    | number                                                    | 400                       | CSS transition duration in ms                                                                                                                       |
| cssEasing         | string                                                    | "ease-in-out"             | CSS transition easing (only when isAnimation: true)                                                                                                 |
| onSlideStart      | (isOpen:boolean, contentID:string) => void \| Promise\<void\> | -                     | Callback fired when open/close animation starts. Supports async/await.                                                                              |
| onSlideEnd        | (isOpen:boolean, contentID:string) => void \| Promise\<void\> | -                     | Callback fired when open/close animation ends. Supports async/await.                                                                                |
| onComplete        | () => void \| Promise\<void\>                             | -                         | Callback fired after Collapsify finishes initialization. Supports async/await.                                                                      |

## Methods

```javascript
// Open a content panel
collapsify.open(contentID);

// Close a content panel
collapsify.close(contentID);

// Remove all event listeners
collapsify.destroy();
```

## Samples

### Basic accordion

```javascript
const accordion = new Collapsify({
    nameSpace: "collapsify",
    isAnimation: true,
    closeOthers: true,
    animationSpeed: 400,
    cssEasing: "ease",
    onSlideStart: (isOpen, contentID) => {
        console.log(isOpen, contentID);
    },
    onSlideEnd: (isOpen, contentID) => {
        console.log(isOpen, contentID);
    },
    onComplete: () => {
        console.log('Collapsify is ready!');
    }
});

// Open/close programmatically
accordion.open("content01");
accordion.close("content01");
```

### Tabs with dropdown sync

When `dropdownElement` is provided, the dropdown and the tab buttons stay in sync automatically — clicking a button updates the dropdown, and selecting from the dropdown activates the corresponding tab.

```javascript
const tabs = new Collapsify({
    nameSpace: "tab",
    isTab: true,
    closeOthers: true,
    dropdownElement: document.querySelector(".js--tab-select"),
});
```

```html
<div class="tabs">
    <!-- Tab buttons -->
    <ul>
        <li>
            <button type="button" class="tab__link tab__link--is-active" data-tab-control="tab01" aria-expanded="true">Tab 01</button>
        </li>
        <li>
            <button type="button" class="tab__link" data-tab-control="tab02" aria-expanded="false">Tab 02</button>
        </li>
        <li>
            <button type="button" class="tab__link" data-tab-control="tab03" aria-expanded="false">Tab 03</button>
        </li>
    </ul>

    <!-- Dropdown (mobile) — syncs automatically with active tab -->
    <select class="js--tab-select" aria-label="Tab selector">
        <option value="" disabled>Select</option>
        <option data-tab-dropdown-item="tab01" value="">Tab 01</option>
        <option data-tab-dropdown-item="tab02" value="">Tab 02</option>
        <option data-tab-dropdown-item="tab03" value="">Tab 03</option>
    </select>

    <!-- Tab content -->
    <div class="tab__bd tab__bd--is-active" data-tab-content="tab01" aria-hidden="false">
        <p>Content for Tab 01.</p>
    </div>
    <div class="tab__bd" data-tab-content="tab02" aria-hidden="true">
        <p>Content for Tab 02.</p>
    </div>
    <div class="tab__bd" data-tab-content="tab03" aria-hidden="true">
        <p>Content for Tab 03.</p>
    </div>
</div>
```

### Async/Await callbacks

All callbacks support async/await — useful for API calls, analytics, dynamic content loading, etc.

```javascript
const collapsify = new Collapsify({
    nameSpace: "collapsify",
    onSlideStart: async (isOpen, contentID) => {
        await fetch('/api/track', {
            method: 'POST',
            body: JSON.stringify({ action: isOpen ? 'open' : 'close', contentID })
        });
    },
    onSlideEnd: async (isOpen, contentID) => {
        if (isOpen) {
            const response = await fetch(`/api/content/${contentID}`);
            const data = await response.json();
            document.querySelector(`[data-collapsify-content='${contentID}']`).innerHTML = data.html;
        }
    },
    onComplete: async () => {
        await someInitTask();
        console.log('Ready!');
    }
});
```

## License
