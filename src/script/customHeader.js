export class CustomHeader extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
  
      const header = document.createElement('header');
      header.innerHTML = '<h2>Notes App</h2>';
      shadow.appendChild(header);
    }
  }
  
  customElements.define('custom-header', CustomHeader);
  
  export default CustomHeader;
  