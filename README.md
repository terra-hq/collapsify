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
    Control Button:  data-{namespase}-control="{ID}" * multiple elements
    Toggle Content:  data-{namespase}-content="{ID}" * only one element
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

| Option Name       | Type                                     | Default                   | Desc                                                                                                                     |
| ----------------- | ---------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| nameSpace         | string                                   | "collapsify"              | Set namespace for "toggleButtonAttr", "toggleContentAttr" & "toggleSelectOptionsAttr"                                    |
| toggleButtonAttr  | string                                   | "data-collapsify-control" | data attribute for Button Element                                                                                        |
| toggleContentAttr | string                                   | "data-collapsify-content" | data attribute for Content                                                                                               |
| dropdownElement   | HTMLSelectElement                        | -                         | HTML dropdown element for tablets/mobiles                                                                                |
| isTab             | boolean                                  | false                     | The package being used for tabs                                                                                          |
| activeClass       | string                                   | "is-active"               | Add class on opened Element                                                                                              |
| isAnimation       | boolean                                  | true                      | animation Slide                                                                                                          |
| closeOthers       | boolean                                  | true                      | Close others Content                                                                                                     |
| animationSpeed    | number                                   | 400                       | css transition duration(ms)                                                                                              |
| cssEasing         | string                                   | "ease-in-out"             | css transition easing (only isAnimation:true)                                                                            |
| onSlideStart      | (isOpen:boolean,contentID:string)=> void \| Promise<void> | () => void                | Callback on Open/Close Animation Start. **Supports async/await** <br> @param {Boolean} isOpen <br> @param {String} contentID \* Don't ID Attribute |
| onSlideEnd        | (isOpen:boolean,contentID:string)=> void \| Promise<void> | () => void                | Callback on Open/Close Animation End. **Supports async/await** <br> @param {Boolean} isOpen <br> @param {String} contentID \* Don't ID Attribute   |
| onComplete        | () => void \| Promise<void>                               | () => void                | Callback triggered after Collapsify finishes initialization. **Supports async/await**                                                             |

## Methods

Open/Close Content

```javascript
collapsify.open(contentID, [isRunCallback, isAnimation]);
```

```javascript
collapsify.close(contentID, [isRunCallback, isAnimation]);
```

## Samples

### JS

```javascript
//Default Options
const myAccrodion = new Collapsify();

//Full Options
const myAccrodionCustom = new Collapsify({
    nameSpace: "collapsify", // Note: Be sure to set different names when creating multiple instances
    activeClass: "is-active",
    isAnimation: true,
    closeOthers: true,
    animationSpeed: 400,
    cssEasing: "ease",
    onSlideStart: (isOpen, contentID) => {
        console.log(isOpen);
        const buttonEl = document.querySelectorAll(`[data-collapsify-control='${contentID}']`);
        console.log(buttonEl);
    },
    onSlideEnd: (isOpen, contentID) => {
        console.log(isOpen);
        const contentEl = document.querySelector(`[data-collapsify-content='${contentID}']`);
        console.log(contentEl);
    },
    onComplete: () => {
        console.log('myAccrodionCustom is loaded!');
    }
});

// Open by Js
myAccrodion.open("content01");

// Close by Js
myAccrodion.close("content01");
```

### Async/Await Support

Collapsify now supports async/await in all callback functions. The library will wait for async operations to complete before proceeding with animations.

```javascript
// Example with async/await callbacks
const asyncCollapsify = new Collapsify({
    nameSpace: "async-example",
    onSlideStart: async (isOpen, contentID) => {
        console.log('Starting animation...');
        
        // Example: Track analytics
        try {
            await fetch('/api/track-interaction', {
                method: 'POST',
                body: JSON.stringify({ 
                    action: isOpen ? 'open' : 'close',
                    contentID: contentID 
                })
            });
            console.log('Analytics tracked successfully');
        } catch (error) {
            console.error('Failed to track analytics:', error);
        }
    },
    onSlideEnd: async (isOpen, contentID) => {
        console.log('Animation completed');
        
        // Example: Load content dynamically when opened
        if (isOpen) {
            try {
                const response = await fetch(`/api/content/${contentID}`);
                const data = await response.json();
                
                const contentEl = document.querySelector(`[data-async-example-content='${contentID}']`);
                if (contentEl) {
                    contentEl.innerHTML = data.html;
                }
            } catch (error) {
                console.error('Failed to load dynamic content:', error);
            }
        }
    },
    onComplete: async () => {
        console.log('Initializing...');
        
        // Example: Initialize other components after Collapsify is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('Collapsify fully initialized with async support!');
    }
});
```

**Key Features:**
- All callbacks (`onSlideStart`, `onSlideEnd`, `onComplete`) support async functions
- The library waits for async operations to complete before continuing
- Perfect for API calls, dynamic content loading, analytics tracking, etc.
- Maintains backward compatibility with synchronous callbacks

## HTML Examples

### Basic Collapse/Toggle

```html
<!-- Simple collapse - single content that can be toggled -->
<button type="button" data-collapsify-control="content01" aria-expanded="false" aria-controls="basicContent01">
    Show/Hide Content
</button>
<div id="basicContent01" data-collapsify-content="content01" aria-hidden="true">
    <p>This content can be toggled open and closed.</p>
</div>
```

### Accordion

```html
<!-- Accordion - multiple sections, only one open at a time -->
<div class="accordion">
    <!-- Section 1 -->
    <button type="button" class="is-active" data-collapsify-control="accordion01" aria-expanded="true" aria-controls="accordionContent01">
        Section 1 Title
    </button>
    <div id="accordionContent01" class="is-active" data-collapsify-content="accordion01" aria-hidden="false">
        <p>Content for section 1. This section is open by default.</p>
    </div>

    <!-- Section 2 -->
    <button type="button" data-collapsify-control="accordion02" aria-expanded="false" aria-controls="accordionContent02">
        Section 2 Title
    </button>
    <div id="accordionContent02" data-collapsify-content="accordion02" aria-hidden="true">
        <p>Content for section 2.</p>
    </div>

    <!-- Section 3 -->
    <button type="button" data-collapsify-control="accordion03" aria-expanded="false" aria-controls="accordionContent03">
        Section 3 Title
    </button>
    <div id="accordionContent03" data-collapsify-content="accordion03" aria-hidden="true">
        <p>Content for section 3.</p>
    </div>
</div>
```

### Tabs

```html
<!-- Tabs - navigation buttons + content panels -->
<div class="tabs">
    <!-- Tab Navigation -->
    <div class="tab-nav">
        <button type="button" class="is-active" data-tab-control="tab01" aria-expanded="true">
            Tab 1
        </button>
        <button type="button" data-tab-control="tab02" aria-expanded="false">
            Tab 2
        </button>
        <button type="button" data-tab-control="tab03" aria-expanded="false">
            Tab 3
        </button>
        
        <!-- Optional: Dropdown for mobile -->
        <select class="tab-dropdown">
            <option value="" disabled selected>Select Tab</option>
            <option data-tab-dropdown-item="tab01" value="">Tab 1</option>
            <option data-tab-dropdown-item="tab02" value="">Tab 2</option>
            <option data-tab-dropdown-item="tab03" value="">Tab 3</option>
        </select>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
        <div class="is-active" data-tab-content="tab01" aria-hidden="false">
            <p>Content for Tab 1. This tab is active by default.</p>
        </div>
        <div data-tab-content="tab02" aria-hidden="true">
            <p>Content for Tab 2.</p>
        </div>
        <div data-tab-content="tab03" aria-hidden="true">
            <p>Content for Tab 3.</p>
        </div>
    </div>
</div>
```

### Nested Accordion

```html
<!-- Nested accordion - accordion inside accordion -->
<div class="nested-accordion">
    <!-- Parent Section -->
    <button type="button" data-collapsify-control="parentContent" aria-expanded="false" aria-controls="parentContentDiv">
        Parent Section
    </button>
    <div id="parentContentDiv" data-collapsify-content="parentContent" aria-hidden="true">
        <p>Parent content...</p>
        
        <!-- Child Accordion -->
        <button type="button" data-collapsify-control="childContent" aria-expanded="false" aria-controls="childContentDiv">
            Child Section
        </button>
        <div id="childContentDiv" data-collapsify-content="childContent" aria-hidden="true">
            <p>Child content nested inside parent.</p>
        </div>
    </div>
</div>
```

### JavaScript Initialization for Each Case

```javascript
// Basic Collapse
const collapse = new Collapsify();

// Accordion (closeOthers: true ensures only one section open)
const accordion = new Collapsify({
    closeOthers: true
});

// Tabs (isTab: true prevents closing active tab)
const tabs = new Collapsify({
    nameSpace: "tab",
    isTab: true,
    closeOthers: true,
    dropdownElement: document.querySelector('.tab-dropdown')
});

// Nested Accordion (separate instances for parent and child)
const parentAccordion = new Collapsify({
    nameSpace: "collapsify"
});
```

### JS

```javascript
//Tab example
const tab = new Collapsify({
    nameSpace: "tab",
    closeOthers: true,
    isTab: true,
    dropdownElement: document.querySelector(".js--select-item-a"),
});
```

### HTML

```html
<div class="c--tabs-a">
    <div class="c--tabs-a__hd">
        <ul class="c--tabs-a__hd__list">
            <li class="c--tabs-a__hd__list__list-item">
                <button
                    class="c--tabs-a__hd__list__list-item__link c--tabs-a__hd__list__list-item__link--is-active js--select-tab"
                    type="button"
                    data-tab-control="tabContent-01"
                    aria-expanded="false"
                >
                    Tab 01
                </button>
            </li>
            <li class="c--tabs-a__hd__list__list-item">
                <button class="c--tabs-a__hd__list__list-item__link js--select-tab" type="button" data-tab-control="tabContent-02" aria-expanded="false">Tab 02</button>
            </li>
            <li class="c--tabs-a__hd__list__list-item">
                <button class="c--tabs-a__hd__list__list-item__link js--select-tab" type="button" data-tab-control="tabContent-03" aria-expanded="false">Tab 03</button>
            </li>
        </ul>

        <div class="c--tabs-a__hd__selector">
            <select aria-label="tab selector" class="c--tabs-a__hd__selector__item js--select-item-a">
                <option value="" disabled="" selected="">Select</option>
                <option data-tab-dropdown-item="tabContent-01" value="">option 01</option>
                <option data-tab-dropdown-item="tabContent-02" value="">option 02</option>
                <option data-tab-dropdown-item="tabContent-03" value="">option 03</option>
            </select>
        </div>
    </div>
    <div class="c--tabs-a__bd c--tabs-a__bd--is-active" data-tab-content="tabContent-01" aria-hidden="true">
        <p>
            Content First: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores nostrum amet excepturi eum. Quo labore, est inventore incidunt debitis voluptatum qui itaque iste quam,
            asperiores aliquid illum optio atque quidem.
        </p>
    </div>
    <div class="c--tabs-a__bd" data-tab-content="tabContent-02" aria-hidden="true">
        <p>
            Content Second: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores nostrum amet excepturi eum. Quo labore, est inventore incidunt debitis voluptatum qui itaque iste quam,
            asperiores aliquid illum optio atque quidem.
        </p>
    </div>
    <div class="c--tabs-a__bd" data-tab-content="tabContent-03" aria-hidden="true">
        <p>
            Content Third: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores nostrum amet excepturi eum. Quo labore, est inventore incidunt debitis voluptatum qui itaque iste quam,
            asperiores aliquid illum optio atque quidem.
        </p>
    </div>
</div>
```

## License
