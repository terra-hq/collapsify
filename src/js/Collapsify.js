import { u_addClass, u_getAttr, u_removeClass, u_setAttr, u_style } from "@andresclua/jsutil";
import { digElement } from "@terrahq/helpers/digElement";

export default class Collapsify {
    constructor(_options = {}) {
        const nameSpace = _options && "nameSpace" in _options ? _options.nameSpace : "collapsify";
        const defaultOptions = {
            nameSpace: _options && "nameSpace" in _options ? _options.nameSpace : "collapsify",
            toggleButtonAttr: `data-${nameSpace}-control`,
            toggleContentAttr: `data-${nameSpace}-content`,
            toggleSelectOptionsAttr: _options && "dropdownElement" in _options && `data-${nameSpace}-dropdown-item`,
            toggleSelectElement: _options && "dropdownElement" in _options && _options.dropdownElement,
            activeClass: "--is-active",
            isAnimation: _options && "isAnimation" in _options ? _options.isAnimation : true,
            closeOthers: _options && "closeOthers" in _options ? _options.closeOthers : true,
            animationSpeed: _options && "animationSpeed" in _options ? _options.animationSpeed : 400,
            cssEasing: _options && "cssEasing" in _options ? _options.cssEasing : "ease-in-out",
            isTab: _options && "isTab" in _options,
            onSlideStart: _options && "onSlideStart" in _options && _options.onSlideStart,
            onSlideEnd: _options && "onSlideEnd" in _options && _options.onSlideEnd,
            index: _options && "index" in _options && _options.index,
            onComplete: _options && "onComplete" in _options && _options.onComplete,
        };
        this.options = {
            ...defaultOptions,
            ..._options,
        };
        this.toggleContentEls = [].slice.call(document.querySelectorAll(`[${this.options.toggleContentAttr}]`));
        this.toggleButtonEls = [].slice.call(document.querySelectorAll(`[${this.options.toggleButtonAttr}]`));

        if (this.toggleContentEls.length !== 0 || this.toggleButtonEls.length !== 0) {
            this.init();
        }
    }
    init() {
        this.initContentsState(this.toggleContentEls);
        this.handleButtonsEvent(this.toggleButtonEls);
        if (this.options.toggleSelectElement) {
            this.handleDropdownSelectEvent(this.options.toggleSelectElement);
        }
        if (typeof this.options.onComplete === "function") {
            setTimeout(() => {
                this.options.onComplete();
            }, 300);
        }
    }

    isReady = async () => {
        return Promise.all(
            this.toggleContentEls.map(async (element) => {
                await digElement({
                    element: element,
                    search: {
                        type: "style",
                        lookFor: ["max-heigt", "visibility"],
                    },
                    intervalFrequency: 1000,
                    timer: 5000,
                });
            })
        )
            .then(() => {
                if (!window["Collapsify"]) {
                    window["Collapsify"] = [];
                }
                window["Collapsify"][this.options.index] = { isReady: true };
            })
            .catch((error) => console.log(error.message));
    };

    initContentsState(contentEls) {
        this.itemsState = {};
        contentEls.forEach((contentEl) => {
            u_style(contentEl, [{ overflow: "hidden" }]);
            u_style(contentEl, [{ maxHeight: "none" }]);
            const isOpen = Array.from(contentEl.classList).some((classItem) => classItem.includes(this.options.activeClass));
            const id = u_getAttr(contentEl, this.options.toggleContentAttr);
            if (!id) return;
            this.setItemState(id, isOpen);
            if (!isOpen) {
                this.close(id, false, false);
            } else {
                this.open(id, false, false);
            }
        });
    }

    handleButtonsEvent(buttonElement) {
        buttonElement.forEach((buttonEl) => {
            const id = u_getAttr(buttonEl, this.options.toggleButtonAttr);
            if (id) {
                buttonEl.addEventListener("click", this.handleButtonClick);
            }
        });
    }

    handleButtonClick = (event) => {
        const id = u_getAttr(event.target, this.options.toggleButtonAttr);
        if (id) {
            event.preventDefault();
            this.toggleSlide(id, true);
        }
    };

    handleDropdownSelectEvent(selectElement) {
        this.toggleContentEls.forEach((contentElement) => {
            if (Array.from(contentElement.classList).some((classItem) => classItem.includes(this.options.activeClass))) {
                let id = u_getAttr(contentElement, this.options.toggleContentAttr);
                let selectedOption = document.querySelector(`[${this.options.toggleSelectOptionsAttr} = ${id}]`);
                selectedOption.selected = true;
            }
        });
        selectElement.addEventListener("change", this.handleSelectChange);
    }

    handleSelectChange = (event) => {
        const selectedOption = event.target.options[event.target.selectedIndex];
        const id = u_getAttr(selectedOption, this.options.toggleSelectOptionsAttr);
        this.toggleSlide(id, true);
    };

    setItemState(id, isOpen) {
        this.itemsState[id] = {
            isOpen: isOpen,
            isAnimating: false,
        };
    }

    toggleSlide(id, isRunCallback = true) {
        if (this.itemsState[id]?.isAnimating || (this.options.isTab && this.itemsState[id]?.isOpen)) return;
        if (!this.itemsState[id]?.isOpen) {
            this.open(id, isRunCallback, this.options.isAnimation);
        } else {
            this.close(id, isRunCallback, this.options.isAnimation);
        }
    }

    open(id, isRunCallback = true, isAnimation = true) {
        if (!id) return;
        if (!Object.prototype.hasOwnProperty.call(this.itemsState, id)) {
            this.setItemState(id, false);
        }
        const toggleBody = document.querySelector(`[${this.options.toggleContentAttr}='${id}']`);
        if (!toggleBody) {
            return;
        }
        this.itemsState[id].isAnimating = true;

        if (this.options.closeOthers) {
            [].slice.call(this.toggleContentEls).forEach((contentEl) => {
                const closeId = u_getAttr(contentEl, this.options.toggleContentAttr);
                if (closeId && closeId !== id) this.close(closeId, false, isAnimation);
            });
        }
        if (isRunCallback !== false && this.options.onSlideStart) this.options.onSlideStart(true, id);

        const clientHeight = this.getTargetHeight(toggleBody);

        u_style(toggleBody, [{ visibility: "visible" }]);

        this.toggleActiveClass(toggleBody, true);

        const toggleButton = document.querySelectorAll(`[${this.options.toggleButtonAttr}='${id}']`);
        if (toggleButton.length > 0) {
            [].slice.call(toggleButton).forEach((button) => {
                this.toggleActiveClass(button, true);
                this.toggleAriaAttribute(button, "aria-expanded", true);
            });
        }

        if (isAnimation) {
            u_style(toggleBody, [{ overflow: "hidden" }]);
            u_style(toggleBody, [{ transition: `${this.options.animationSpeed}ms ${this.options.cssEasing}` }]);
            u_style(toggleBody, [{ maxHeight: (clientHeight || "1000") + "px" }]);
            setTimeout(() => {
                if (isRunCallback !== false && this.options.onSlideEnd) this.options.onSlideEnd(true, id);
                u_style(toggleBody, [{ overflow: "" }]);
                u_style(toggleBody, [{ transition: "" }]);
                u_style(toggleBody, [{ maxHeight: "none" }]);
                this.itemsState[id].isAnimating = false;
            }, this.options.animationSpeed);
        } else {
            u_style(toggleBody, [{ maxHeight: "none" }]);
            u_style(toggleBody, [{ overflow: "" }]);
            this.itemsState[id].isAnimating = false;
        }
        this.itemsState[id].isOpen = true;
        this.toggleAriaAttribute(toggleBody, "aria-hidden", true);
    }

    close(id, isRunCallback = true, isAnimation = true) {
        if (!id) return;
        if (!Object.prototype.hasOwnProperty.call(this.itemsState, id)) {
            this.setItemState(id, false);
        }
        this.itemsState[id].isAnimating = true;
        if (isRunCallback !== false && this.options.onSlideStart) this.options.onSlideStart(false, id);

        const toggleBody = document.querySelector(`[${this.options.toggleContentAttr}='${id}']`);
        u_style(toggleBody, [{ overflow: "hidden" }]);
        u_style(toggleBody, [{ maxHeight: toggleBody.clientHeight + "px" }]);

        this.toggleActiveClass(toggleBody, false);

        setTimeout(() => {
            u_style(toggleBody, [{ maxHeight: "0px" }]);
        }, 5);

        const toggleButton = document.querySelectorAll(`[${this.options.toggleButtonAttr}='${id}']`);
        if (toggleButton.length > 0) {
            [].slice.call(toggleButton).forEach((button) => {
                this.toggleActiveClass(button, false);
                this.toggleAriaAttribute(button, "aria-expanded", false);
            });
        }

        if (isAnimation) {
            u_style(toggleBody, [{ transition: `${this.options.animationSpeed}ms ${this.options.cssEasing}` }]);
            setTimeout(() => {
                if (isRunCallback !== false && this.options.onSlideEnd) this.options.onSlideEnd(false, id);
                u_style(toggleBody, [{ transition: "" }]);
                this.itemsState[id].isAnimating = false;
                u_style(toggleBody, [{ visibility: "hidden" }]);
            }, this.options.animationSpeed);
        } else {
            this.options.onSlideEnd && this.options.onSlideEnd(false, id);
            this.itemsState[id].isAnimating = false;
            u_style(toggleBody, [{ visibility: "hidden" }]);
        }
        if (Object.prototype.hasOwnProperty.call(this.itemsState, id)) {
            this.itemsState[id].isOpen = false;
        }
        this.toggleAriaAttribute(toggleBody, "aria-hidden", false);
    }

    toggleActiveClass(toggleElement, active) {
        const elementFilteredClass =
            !toggleElement.classList[0] || toggleElement.classList[0].startsWith("--is-active") ? this.options.activeClass : toggleElement.classList[0] + this.options.activeClass;
        if (active) {
            u_addClass(toggleElement, elementFilteredClass);
        } else {
            u_removeClass(toggleElement, elementFilteredClass);
        }
    }

    toggleAriaAttribute(toggleElement, attribute, active) {
        if (u_getAttr(toggleElement, attribute)) {
            if (attribute === "aria-expanded") {
                u_setAttr(toggleElement, attribute, active);
            } else {
                u_setAttr(toggleElement, attribute, !active);
            }
        }
    }

    getTargetHeight(targetEl) {
        if (!targetEl) return;
        const cloneEl = targetEl.cloneNode(true);
        const parentEl = targetEl.parentNode;
        if (!parentEl) return;
        const inputElements = [].slice.call(cloneEl.querySelectorAll("input[name]"));
        if (inputElements.length !== 0) {
            const suffix = "-" + new Date().getTime();
            inputElements.forEach((input) => {
                input.name += suffix;
            });
        }
        cloneEl.style.maxHeight = "none";
        cloneEl.style.opacity = "0";
        parentEl.appendChild(cloneEl);
        const clientHeight = cloneEl.clientHeight;
        parentEl.removeChild(cloneEl);
        return clientHeight;
    }

    destroy = () => {
        this.toggleButtonEls.forEach((buttonEl) => {
            const id = u_getAttr(buttonEl, this.options.toggleButtonAttr);
            if (id) {
                buttonEl.removeEventListener("click", this.handleButtonClick);
            }
        });

        if (this.options.toggleSelectElement) {
            this.options.toggleSelectElement.removeEventListener("change", this.handleSelectChange);
        }
    };
}
