import  JSUTIL from '@andresclua/jsutil';

export default class Collapsify {
  constructor(_options = {}) {
    this.jsui = new JSUTIL();
    const nameSpace = _options && "nameSpace" in _options ? _options.nameSpace : "collapsify";
    const defaultOptions = {
      nameSpace: "collapsify",
      toggleButtonAttr: `data-${nameSpace}-control`,
      toggleContentAttr: `data-${nameSpace}-content`,
      activeClass: "--is-active",
      isAnimation: true,
      closeOthers: true,
      animationSpeed: 400,
      cssEasing: "ease-in-out",
      onSlideStart: () => {},
      onSlideEnd: () => {}
    };
    this.options = {
      ...defaultOptions,
      ..._options
    };
    this.toggleContentEls = [].slice.call(document.querySelectorAll(`[${this.options.toggleContentAttr}]`));
    this.toggleButtonEls = [].slice.call(document.querySelectorAll(`[${this.options.toggleButtonAttr}]`));
    
    if (this.toggleContentEls.length !== 0 || this.toggleButtonEls.length !== 0) {
      this.init()
    }
  }
  init(){
    this.initContentsState(this.toggleContentEls);
    this.handleButtonsEvent(this.toggleButtonEls);
  }

  initContentsState(contentEls) {
    this.itemsState = {};
    contentEls.forEach((contentEl) => {
      contentEl.style.overflow = "hidden";
      contentEl.style.maxHeight = "none";
      const isOpen = contentEl.classList.contains(this.options.activeClass);
      const id = contentEl.getAttribute(this.options.toggleContentAttr);
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
      const id = buttonEl.getAttribute(this.options.toggleButtonAttr);
      if (id) {
        buttonEl.addEventListener("click", (e) => {
          e.preventDefault();
          this.toggleSlide(id, true);
        }, false);
      }
    });
  }

  setItemState(id, isOpen) {
    this.itemsState[id] = {
      isOpen: isOpen,
      isAnimating: false
    };
  }

  toggleSlide(id, isRunCallback = true) {
    if (this.itemsState[id]?.isAnimating) return;
    if (this.itemsState[id]?.isOpen === false) {
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
        const closeId = contentEl.getAttribute(this.options.toggleContentAttr);
        if (closeId && closeId !== id) this.close(closeId, false, isAnimation);
      });
    }
    if (isRunCallback !== false) this.options.onSlideStart(true, id);

    const clientHeight = this.getTargetHeight(toggleBody);
    toggleBody.style.visibility = "visible";
    // ! guido aca hice cualquier cagada
    // toggleBody.classList.add(this.options.activeClass);
    let contentHasClass = '';
    if(!toggleBody.classList[0]){
      contentHasClass = this.options.activeClass
      
    }else{
      contentHasClass = toggleBody.classList[0];
      console.log(contentHasClass)
      contentHasClass+= this.options.activeClass;
      toggleBody.classList.add(contentHasClass);

    }

    

    const toggleButton = document.querySelectorAll(`[${this.options.toggleButtonAttr}='${id}']`);
    if (toggleButton.length > 0) {
      [].slice.call(toggleButton).forEach((button) => {
        
         // ! y aca tambien!
        // button.classList.add(this.options.activeClass);

        let buttonHasClass = '';
        if(!button.classList[0]){
         buttonHasClass = this.options.activeClass
        }else{
         buttonHasClass = button.classList[0];
         buttonHasClass+= this.options.activeClass
          button.classList.add(buttonHasClass);

        }

        if (button.hasAttribute("aria-expanded")) {
          button.setAttribute("aria-expanded", "true");
        }
      });
    }

    if (isAnimation) {
      toggleBody.style.overflow = "hidden";
      toggleBody.style.transition = `${this.options.animationSpeed}ms ${this.options.cssEasing}`;
      toggleBody.style.maxHeight = (clientHeight || "1000") + "px";
      setTimeout(() => {
        if (isRunCallback !== false) this.options.onSlideEnd(true, id);
        toggleBody.style.maxHeight = "none";
        toggleBody.style.transition = "";
        toggleBody.style.overflow = "";
        this.itemsState[id].isAnimating = false;
      }, this.options.animationSpeed);
    } else {
      toggleBody.style.maxHeight = "none";
      toggleBody.style.overflow = "";
      this.itemsState[id].isAnimating = false;
    }
    this.itemsState[id].isOpen = true;
    if (toggleBody.hasAttribute("aria-hidden")) {
      toggleBody.setAttribute("aria-hidden", "false");
    }
  }

  close(id, isRunCallback = true, isAnimation = true) {
    if (!id) return;
    if (!Object.prototype.hasOwnProperty.call(this.itemsState, id)) {
      this.setItemState(id, false);
    }
    this.itemsState[id].isAnimating = true;
    if (isRunCallback !== false) this.options.onSlideStart(false, id);

    const toggleBody = document.querySelector(`[${this.options.toggleContentAttr}='${id}']`);
    toggleBody.style.overflow = "hidden";
    toggleBody.classList.remove(this.options.activeClass);
    toggleBody.style.maxHeight = toggleBody.clientHeight + "px";

    setTimeout(() => {
      toggleBody.style.maxHeight = "0px";
    }, 5);

    const toggleButton = document.querySelectorAll(`[${this.options.toggleButtonAttr}='${id}']`);
    if (toggleButton.length > 0) {
      [].slice.call(toggleButton).forEach((button) => {
        button.classList.remove(this.options.activeClass);
        if (button.hasAttribute("aria-expanded")) {
          button.setAttribute("aria-expanded", "false");
        }
      });
    }

    if (isAnimation) {
      toggleBody.style.transition = `${this.options.animationSpeed}ms ${this.options.cssEasing}`;
      setTimeout(() => {
        if (isRunCallback !== false) this.options.onSlideEnd(false, id);
        toggleBody.style.transition = "";
        this.itemsState[id].isAnimating = false;
        toggleBody.style.visibility = "hidden";
      }, this.options.animationSpeed);
    } else {
      this.options.onSlideEnd(false, id);
      this.itemsState[id].isAnimating = false;
      toggleBody.style.visibility = "hidden";
    }
    if (Object.prototype.hasOwnProperty.call(this.itemsState, id)) {
      this.itemsState[id].isOpen = false;
    }
    if (toggleBody.hasAttribute("aria-hidden")) {
      toggleBody.setAttribute("aria-hidden", "true");
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
}