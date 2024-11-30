export class CustomFooter extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
  
      const footer = document.createElement('footer');
      footer.innerHTML = '<p>&copy; 2024 F.Hadi</p>';
  
      shadow.appendChild(footer);
    }
  }
  
  customElements.define('custom-footer', CustomFooter);
  
  export default CustomFooter;
  