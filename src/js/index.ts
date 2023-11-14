import "./../scss/index.scss";

// @ts-ignore
import Collapsify from "./Collapsify.js";

// @ts-ignore
var SimpleExample = new Collapsify();

// @ts-ignore
var different = new Collapsify({
    nameSpace: "different",
});

// @ts-ignore
var accordion = new Collapsify({
    nameSpace: "accordion",
});

// @ts-ignore
const nested = new Collapsify({
    nameSpace: "nested",
    closeOthers: false,
});

// @ts-ignore
const tab = new Collapsify({
    nameSpace: "tab",
    closeOthers: true,
    isTab: true,
    dropdownElement: document.querySelector(".js--select-item-a"),
});

// @ts-ignore
const tabTwo = new Collapsify({
    nameSpace: "tabTwo",
    closeOthers: true,
    isTab: true,
    dropdownElement: document.querySelector(".js--select-item-b"),
});

// @ts-ignore
var sliderInstances = {};

// @ts-ignore
const tabThird = new Collapsify({
    nameSpace: "tabThird",
    closeOthers: true,
    isTab: true,
    dropdownElement: document.querySelector(".js--select-item-c"),
    // @ts-ignore
    onSlideStart: (isOpen, contentID) => {
        const contentEl = document.querySelector(`[data-tabThird-content='${contentID}']`);
        if (isOpen && contentEl?.querySelector(".js--slider")) {
            // @ts-ignore
            sliderInstances[contentID] = tns({
                container: contentEl?.querySelector(".js--slider"),
                autoplay: true,
                loop: true,
                mode: "gallery",
                items: 1,
                gutter: 0,
                slideBy: 1,
                controls: false,
                rewind: false,
                swipeAngle: 60,
                lazyload: true,
                autoplayButtonOutput: false,
                speed: 500,
                autoplayTimeout: 3000,
                preventActionWhenRunning: true,
                preventScrollOnTouch: "auto",
                touch: false,
            });
            console.log("init", contentID);
        }
    },
    // @ts-ignore
    onSlideEnd: (isOpen, contentID) => {
        const contentElements = [].slice.call(document.querySelectorAll(`[data-tabThird-content]`));
        contentElements.forEach((contentElement) => {
            // @ts-ignore
            var id = contentElement.getAttribute("data-tabThird-content");
            // @ts-ignore
            if (id != contentID && contentElement.querySelector(".js--slider") && sliderInstances[id]?.version) {
                // @ts-ignore
                sliderInstances[id].destroy();
                console.log("destroy", id);
            }
        });
    },
});
