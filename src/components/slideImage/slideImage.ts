import sass from "sass";

class SlideImage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const src = this.getAttribute("src");
    const alt = this.getAttribute("alt");
    const input = `
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
  
      img {
        width: 100%;
        height: 100vh;
        object-fit: cover;
      }
    }
    `;
    const result = sass.compileString(input);
    if (src && alt) {
      this.shadowRoot!.innerHTML = `
        <style>
        ${result.css.toString()}
        </style>
        <img class="slide-image" src="${src}" alt="${alt}">
      `;
    }
  }
}

customElements.define("slide-image", SlideImage);
