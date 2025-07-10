import Collapsify from './Collapsify.js';

// const myAccrodionCustom = new Collapsify({
//     nameSpace: "collapsify", // Note: Be sure to set different names when creating multiple instances
//     activeClass: "is-active",
//     isAnimation: true,
//     closeOthers: true,
//     animationSpeed: 400,
//     cssEasing: "ease",
//     onSlideStart: (isOpen, contentID) => {
//         console.log(isOpen);
//         const buttonEl = document.querySelectorAll(`[data-collapsify-control='${contentID}']`);
//         console.log(buttonEl);
//     },
//     onSlideEnd: (isOpen, contentID) => {
//         console.log(isOpen);
//         const contentEl = document.querySelector(`[data-collapsify-content='${contentID}']`);
//         console.log(contentEl);
//     },
//     onComplete: () => {
//         console.log('myAccrodionCustom is loaded!');
//     }
// });

// Código corregido con async/await y selectors correctos
var tab = new Collapsify({
    nameSpace: "tab",
    isTab: true,
    dropdownElement: document.querySelector('.js--select-item-a'),
    onSlideStart: async (isOpen, contentID) => {
        console.log('Starting slide animation...');
        console.log('Is open:', isOpen);
        console.log('Content ID:', contentID);
        
        // Obtener el elemento de contenido específico
        const contentEl = document.querySelector(`[data-tab-content='${contentID}']`);
        console.log('Content element:', contentEl);
        
        // Obtener el valor del atributo si lo necesitas
        const attributeValue = contentEl?.getAttribute('data-tab-content');
        console.log('Attribute value:', attributeValue);
        
        // Obtener los botones de control
        const buttonEls = document.querySelectorAll(`[data-tab-control='${contentID}']`);
        console.log('Button elements:', buttonEls);
        
        // Ejemplo de operación asíncrona
        try {
            // Simular una llamada API
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log('Async operation completed in onSlideStart');
        } catch (error) {
            console.error('Error in onSlideStart:', error);
        }
    },
    onSlideEnd: async (isOpen, contentID) => {
        console.log('Ending slide animation...');
        console.log('Final state - Is open:', isOpen);
        console.log('Final state - Content ID:', contentID);
        
        // Ejemplo de otra operación asíncrona
        try {
            await new Promise(resolve => setTimeout(resolve, 50));
            console.log('Async operation completed in onSlideEnd');
        } catch (error) {
            console.error('Error in onSlideEnd:', error);
        }
    },
    onComplete: async () => {
        console.log('Initializing tab system...');
        
        // Ejemplo de operación asíncrona en onComplete
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            console.log('Tab system fully loaded with async support!');
        } catch (error) {
            console.error('Error in onComplete:', error);
        }
    }
});
