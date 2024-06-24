import sass from "sass";
import { SlideData } from "./types/types";
import { fetchProduct } from "./components/fetchProduct/fetchProduct";

class ImageSlider extends HTMLElement {
  private slidesData: SlideData[] = [];
  private numSlides: number = 0;
  private isLoading: boolean = true;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const ScssInput = `
    .slider {
      position: relative;
      display: flex;
      transition: transform 0.5s ease;
      width: 100%;
      height: 100%;
    
      &__overlay {
        width: 100%;
        height: 100%;
        background-image: linear-gradient(to top, black, transparent);
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
      }
    }
    `;
    const result = sass.compileString(ScssInput);
    const sliderCSS = result.css.toString();

    shadow.innerHTML = `
      <style>
        ${sliderCSS}
      </style>
      <div class="slider" id="slider"></div>
      <div class="slider__overlay"></div>

    `;
    this.initializeSlider();
  }

  private async initializeSlider(): Promise<void> {
    try {
      const { data: products, loading } = await fetchProduct(
        "https://dummyjson.com/products",
        5
      );
      this.isLoading = loading;
      if (!this.isLoading) {
        this.slidesData = products;
        this.numSlides = products.length;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
}

customElements.define("image-slider", ImageSlider);
