import "./../scss/index.scss";
// @ts-ignore
import Collapsify from "./Collapsify.js";
// @ts-ignore
import UTMParamHandler from "./Cookies.js";

// @ts-ignore
var SimpleExample = new Collapsify({});

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
