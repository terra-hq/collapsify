
import  JSUTIL from '@andresclua/jsutil';


/**
 * Options Interface
 * Define customizable settings for the component:
 * 
 * - nameSpace (string): Unique identifier to avoid conflicts.
 * - toggleButtonAttr (string): Attribute for control buttons in the DOM.
 * - toggleContentAttr (string): Attribute for content to show or hide.
 * - activeClass (string): CSS class for active elements.
 * - isAnimation (boolean): Enable animations for show/hide.
 * - closeOthers (boolean): Close other elements when one opens.
 * - animationSpeed (number): Animation duration in milliseconds.
 * - cssEasing (string): CSS easing function for animations.
 * - onSlideStart (function): Called when slide animation begins.
 * - onSlideEnd (function): Called when slide animation completes.
 * 
 * Customize the component's behavior and appearance using these options.
 */

export interface Options {
  nameSpace: string;
  toggleButtonAttr: string;
  toggleContentAttr: string;
  activeClass: string;
  isAnimation: boolean;
  closeOthers: boolean;
  animationSpeed: number;
  cssEasing: string;
  onSlideStart: (isOpen: boolean, id: string) => void;
  onSlideEnd: (isOpen: boolean, id: string) => void;
}

/**
 * ItemState Interface
 * 
 * Defines an object structure with string keys, where each key represents an element.
 * Each element is described by two properties:
 * - isOpen: A boolean indicating whether the element is open (true) or closed (false).
 * - isAnimating: A boolean indicating whether the element is in the process of animation (true) or not (false).
 * 
 * This interface is useful for managing and tracking the state of elements, such as in user interface components
 * where elements can be opened, closed, or in the process of animation.
 */
  interface ItemState {
    [key: string]: {
      isOpen: boolean;
      isAnimating: boolean;
    };
  }


  export default class Collapsify {
    
    toggleContentEls: HTMLElement[]; // multiple elements
    toggleButtonEls: HTMLElement[]; // multiple elements
    itemsState: ItemState = {}; // state for each element
    options: Options; // types definition
    jsui: any; // jsui 

    constructor(_options: Partial<Options> = {}) {
      
      /**
        Constructor Options
      */
     
      const nameSpace = typeof _options === "object" && "nameSpace" in _options ? _options.nameSpace : "collapsify";
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
        onSlideEnd: () => {},
      };
      
      this.jsui = new JSUTIL();
 
      /**
        The line of code creates a new set of options called this.options that combines default options and custom options. If custom options have the same name as default options, the custom options replace the defaults.
      */
      this.options = {
        ...defaultOptions, ..._options
      };
      
      // convert an object into a real array, so we can create pop/push,etc
      this.toggleContentEls = [].slice.call(document.querySelectorAll(`[${this.options.toggleContentAttr}]`));
      this.toggleButtonEls = [].slice.call(document.querySelectorAll(`[${this.options.toggleButtonAttr}]`));
      
      console.log('test')
      if (this.toggleContentEls.length !== 0 || this.toggleButtonEls.length !== 0) {
        this.init()
      }

    }

    private init():void{
      this.initContentsState(this.toggleContentEls);
      this.handleButtonsEvent(this.toggleButtonEls);
    }
    /**
     * init Param & show/hide items
     */
    private initContentsState(contentEls: HTMLElement[]) {
      this.itemsState = {};
      contentEls.forEach((contentEl: HTMLElement) => {

        this.jsui.addStyle(contentEl,'overflow','hidden');
        this.jsui.addStyle(contentEl,'maxHeight','none');

        // const isOpen = contentEl.classList.contains(this.options.activeClass);
        // const id = contentEl.getAttribute(this.options.toggleContentAttr);
        // const contentHasClass = contentEl.classList[0]; // ! @nerea lets play with first class
  
        const isOpen = this.jsui.matches(contentEl, [this.options.activeClass]) // 
        const id = this.jsui.getAttr(contentEl, this.options.toggleContentAttr);
       
        if (!id) return;
        this.setItemState(id, isOpen);
        if (!isOpen) {
          this.close(id, false, false);
        } else {
          this.open(id, false, false);
        }
      });
    }
  
    /**
     * Add toggleButton Listners
     */
    handleButtonsEvent(buttonElement: HTMLElement[]) {
   
      buttonElement.forEach((buttonEl: HTMLElement) => {
        const id =  this.jsui.getAttr(buttonEl, this.options.toggleButtonAttr);
        if (id) {
          buttonEl.addEventListener(
            "click",
            (e) => {
              e.preventDefault();
              this.toggleSlide(id, true);
            },
            false
          );
        }
      });

    }
    /**
     * Set state
     */
    private setItemState(id: string, isOpen: boolean) {
      this.itemsState[id] = {
        isOpen: isOpen,
        isAnimating: false
      };
    }
  
    /**
     * button click listner
     * @param  id - accordion ID
     */
    toggleSlide(id: string, isRunCallback = true) {
      if (this.itemsState[id]?.isAnimating) return;
      if (this.itemsState[id]?.isOpen === false) {
        this.open(id, isRunCallback, this.options.isAnimation);
      } else {
        this.close(id, isRunCallback, this.options.isAnimation);
      }
    }
    /**
     * Open accordion
     * @param  id - accordion ID
     */
    open(id: string, isRunCallback = true, isAnimation = true) {
      if (!id) return;
      if (!Object.prototype.hasOwnProperty.call(this.itemsState, id)) {
        this.setItemState(id, false);
      }
      const toggleBody = document.querySelector<HTMLElement>(`[${this.options.toggleContentAttr}='${id}']`);
      if (!toggleBody) {
        return;
      }
      this.itemsState[id].isAnimating = true;
  
      //Close Others
      if (this.options.closeOthers) {
        [].slice.call(this.toggleContentEls).forEach((contentEl: HTMLElement) => {
          const closeId = contentEl.getAttribute(this.options.toggleContentAttr);
          if (closeId && closeId !== id) this.close(closeId, false, isAnimation);
        });
      }
      if (isRunCallback !== false) this.options.onSlideStart(true, id);
  
      //Content : Set getHeight, add activeClass
      const clientHeight = this.getTargetHeight(toggleBody);
      this.jsui.addStyle(toggleBody,'visibility','visible');

      let contentHasClass = '';
      if(!toggleBody.classList[0]){
        contentHasClass = this.options.activeClass
      }else{
        contentHasClass = toggleBody.classList[0];
        contentHasClass+= this.options.activeClass;
      }
      this.jsui.addClass(toggleBody,contentHasClass);
  
      //Button : Add activeClass
      const toggleButton = document.querySelectorAll(`[${this.options.toggleButtonAttr}='${id}']`);
      if (toggleButton.length > 0) {
        [].slice.call(toggleButton).forEach((button: HTMLElement) => {
          
         let buttonHasClass = '';
         if(!button.classList[0]){
          buttonHasClass = this.options.activeClass
         }else{
          buttonHasClass = button.classList[0];
          buttonHasClass+= this.options.activeClass
         }
         
       
          this.jsui.addClass(button,buttonHasClass);
          // button.classList.add(this.options.activeClass);

          if (button.hasAttribute("aria-expanded")) {
            button.setAttribute("aria-expanded", "true");
          }
        });
      }
  
      if (isAnimation) {
        //Slide Animation
        // toggleBody.style.overflow = "hidden";
        // toggleBody.style.transition = `${this.options.animationSpeed}ms ${this.options.cssEasing}`;
        // toggleBody.style.maxHeight = (clientHeight || "1000") + "px";

        this.jsui.addStyle(toggleBody,'overflow','hidden');
        this.jsui.addStyle(toggleBody,'transition',`${this.options.animationSpeed}ms ${this.options.cssEasing}`);
        this.jsui.addStyle(toggleBody, 'max-height', (clientHeight || "1000") + "px");


        setTimeout(() => {
          if (isRunCallback !== false) this.options.onSlideEnd(true, id);
          // toggleBody.style.maxHeight = "none";
          // toggleBody.style.transition = "";
          // toggleBody.style.overflow = "";
          this.jsui.addStyle(toggleBody,'maxHeight','none');
          this.jsui.addStyle(toggleBody,'transition','');
          this.jsui.addStyle(toggleBody,'overflow','');

          this.itemsState[id].isAnimating = false;
        }, this.options.animationSpeed);
      } else {
        //No Animation
        // toggleBody.style.maxHeight = "none";
        // toggleBody.style.overflow = "";
        this.jsui.addStyle(toggleBody, 'max-height', 'none');
        this.jsui.addStyle(toggleBody, 'overflow', '');
        this.itemsState[id].isAnimating = false;
      }
      this.itemsState[id].isOpen = true;
      if (toggleBody.hasAttribute("aria-hidden")) {
        toggleBody.setAttribute("aria-hidden", "false");
      }
    }
    /**
     * Close accordion
     * @param id - accordion ID
     */
    close(id: string, isRunCallback = true, isAnimation = true) {
      if (!id) return;
      if (!Object.prototype.hasOwnProperty.call(this.itemsState, id)) {
        this.setItemState(id, false);
      }
      this.itemsState[id].isAnimating = true;
      if (isRunCallback !== false) this.options.onSlideStart(false, id);
  
      //Content : Set getHeight, remove activeClass
      const toggleBody = document.querySelector(`[${this.options.toggleContentAttr}='${id}']`) as HTMLElement;
      // toggleBody.style.overflow = "hidden";
      this.jsui.addStyle(toggleBody, 'overflow', 'hidden');


      toggleBody.classList.remove(this.options.activeClass);
      // toggleBody.style.maxHeight = toggleBody.clientHeight + "px";
      this.jsui.addStyle(toggleBody, 'max-height', toggleBody.clientHeight + "px");

  
      setTimeout(() => {
        toggleBody.style.maxHeight = "0px";
      }, 5);
  
      //Buttons : Remove activeClass
      const toggleButton = document.querySelectorAll(`[${this.options.toggleButtonAttr}='${id}']`);
      if (toggleButton.length > 0) {
        [].slice.call(toggleButton).forEach((button: HTMLElement) => {
          button.classList.remove(this.options.activeClass);
          if (button.hasAttribute("aria-expanded")) {
            button.setAttribute("aria-expanded", "false");
          }
        });
      }
  
      if (isAnimation) {
        //Slide Animation
        toggleBody.style.transition = `${this.options.animationSpeed}ms ${this.options.cssEasing}`;
        setTimeout(() => {
          if (isRunCallback !== false) this.options.onSlideEnd(false, id);
          toggleBody.style.transition = "";
          this.itemsState[id].isAnimating = false;
          toggleBody.style.visibility = "hidden";
        }, this.options.animationSpeed);
      } else {
        //No Animation
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
    /**
     * Get Elemet Height
     * @param targetEl - target Element
     * @return Height(px)
     */
    getTargetHeight(targetEl: HTMLElement): number | void {
      if (!targetEl) return;
      const cloneEl = targetEl.cloneNode(true) as HTMLElement;
      const parentEl = targetEl.parentNode;
      if (!parentEl) return;
      // bugfix: Radio button being unchecked when collapsed
      const inputElements: HTMLInputElement[] = [].slice.call(cloneEl.querySelectorAll("input[name]"));
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
    /**
   * Destroy accordion
   * @param id - accordion ID
   */
    // destroy(id: string, isRunCallback = true, isAnimation = true) {
    //   if (!id) return;
    //   if (!Object.prototype.hasOwnProperty.call(this.itemsState, id)) {
    //     return;
    //   }
    //   this.itemsState[id].isAnimating = true;
    //   if (isRunCallback !== false) this.options.onSlideStart(false, id);

    //   // Content: Remove maxHeight and activeClass
    //   const toggleBody = document.querySelector(`[${this.options.toggleContentAttr}='${id}']`) as HTMLElement;
    //   toggleBody.style.overflow = "hidden";
    //   toggleBody.classList.remove(this.options.activeClass);
    //   toggleBody.style.maxHeight = "0px";

    //   // Buttons: Remove activeClass
    //   const toggleButton = document.querySelectorAll(`[${this.options.toggleButtonAttr}='${id}']`);
    //   if (toggleButton.length > 0) {
    //     [].slice.call(toggleButton).forEach((button: HTMLElement) => {
    //       button.classList.remove(this.options.activeClass);
    //       if (button.hasAttribute("aria-expanded")) {
    //         button.setAttribute("aria-expanded", "false");
    //       }
    //     });
    //   }

    //   if (isAnimation) {
    //     // Slide Animation
    //     toggleBody.style.transition = `${this.options.animationSpeed}ms ${this.options.cssEasing}`;
    //     setTimeout(() => {
    //       if (isRunCallback !== false) this.options.onSlideEnd(false, id);
    //       toggleBody.style.transition = "";
    //       this.itemsState[id].isAnimating = false;
    //       toggleBody.style.visibility = "hidden";
    //     }, this.options.animationSpeed);
    //   } else {
    //     // No Animation
    //     this.options.onSlideEnd(false, id);
    //     this.itemsState[id].isAnimating = false;
    //     toggleBody.style.visibility = "hidden";
    //   }
    //   if (Object.prototype.hasOwnProperty.call(this.itemsState, id)) {
    //     this.itemsState[id].isOpen = false;
    //   }
    //   if (toggleBody.hasAttribute("aria-hidden")) {
    //     toggleBody.setAttribute("aria-hidden", "true");
    //   }
    // }
  }