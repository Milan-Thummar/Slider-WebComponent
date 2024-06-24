import sass from "sass";
class SliderButtons extends HTMLElement {
  private prevButton: HTMLElement;
  private nextButton: HTMLElement;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const input = `
        :host {
          display: flex;
          justify-content: end;
          align-items: center;
          gap: 3rem;
          width: 50%;

          button {
              background: none;
              border: none;
              cursor: pointer;
              font-size: 1.5rem;
              color: #a1a1a1;

              &:hover {
                color: #fff;
              }
          }

          @media only screen and (max-width: 768px) {
            width: 20%;
            gap: 1.75rem;
          }

          @media only screen and (max-width: 480px) {
            width: 0;
            button {
                display: none;
            }
          }
        }
      `;
    const result = sass.compileString(input);
    shadow.innerHTML = `
    <style>
      ${result.css.toString()}
    </style>
      <button id="prev">&#10094;</button>
      <button id="next">&#10095;</button>
    `;
    this.prevButton = shadow.getElementById("prev") as HTMLElement;
    this.nextButton = shadow.getElementById("next") as HTMLElement;
  }

  connectedCallback() {
    this.prevButton.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("prev"));
    });

    this.nextButton.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("next"));
    });
  }
}

customElements.define("slider-buttons", SliderButtons);
