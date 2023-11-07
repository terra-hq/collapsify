import './../scss/index.scss';
// @ts-ignore
import Collapsify from './Collapsify.js';
// @ts-ignore
import UTMParamHandler from './Cookies.js';

// @ts-ignore
var SimpleExample = new Collapsify({})

// @ts-ignore
var different = new Collapsify({
    nameSpace:'different',
})

// @ts-ignore
const nested = new Collapsify({
    nameSpace: "nested",
    closeOthers: false
});

