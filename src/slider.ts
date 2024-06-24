import sass from "sass";
import { SlideData } from "./types/types";
import { fetchProduct } from "./components/fetchProduct/fetchProduct";

class ImageSlider extends HTMLElement {
  private currentIndex: number = 0;
  private slidesData: SlideData[] = [];
  private numSlides: number = 0;
  private slideInterval: NodeJS.Timeout | null = null;
  private slideContent: HTMLElement;
  private sliderButtons: HTMLElement;
  private timeLine: HTMLElement | null = null;
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

      &__slide-content {
        position: absolute;
        z-index: 2;
        top: 50%;
        left: 5%;
        width: 70%;
        color: #fff;
        font-family: "Poppins", sans-serif;
        font-style: normal;
    
        h2 {
          font-size: 2rem;
          font-weight: 400;
          margin-bottom: 0;
        }
    
        p {
          font-size: 1rem;
          color: #cdcdcd;
          margin-top: 0.25rem;
          margin-bottom: 2rem;
        }
    
        button {
          padding: 0.75rem 1rem;
          background: transparent;
          border: 1px solid #a1a1a1;
          color: #fff;
          border-radius: 0.5rem;
          font-size: 1rem;
          margin-right: 0.75rem;
          cursor: pointer;
    
          &#moreInfoBtn {
            background-color: #029d9f;
            border: 1px solid #029d9f;
          }
        }
      }

      &__controls {
        position: absolute;
        bottom: 5%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 90%;
        z-index: 2;
      }

      @media only screen and (max-width: 768px) {
        &__slide-content {
          width: 70%;
    
          h2 {
            font-size: 1.75rem;
          }
    
          p {
            font-size: 1rem;
          }
        }
      }
    
      @media only screen and (max-width: 480px) {
        &__slide-content {
          width: 90%;
        }
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
      <div class="slider__slide-content" id="slideContent"></div>
      <div class="slider__controls">
        <slider-timeline id="timeLine"></slider-timeline>
        <slider-buttons></slider-buttons>
      </div>
    `;
    this.slideContent = shadow.querySelector("#slideContent")!;
    this.sliderButtons = shadow.querySelector("slider-buttons")!;
    this.timeLine = shadow.querySelector("#timeLine")!;

    this.sliderButtons.addEventListener("prev", () => this.prevSlide());
    this.sliderButtons.addEventListener("next", () => this.nextSlide());

    this.initializeSlider();
  }

  connectedCallback() {
    setTimeout(() => {
      this.startSlideInterval();
    }, 500);
  }

  disconnectedCallback() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.sliderButtons.removeEventListener("prev", this.prevSlide);
    this.sliderButtons.removeEventListener("next", this.nextSlide);
  }

  private startSlideInterval() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  private stopSlideInterval() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
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
        this.renderSlides();
        this.updateTimeLine();
        this.renderSlideContent();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  private renderSlides() {
    const slider = this.shadowRoot!.querySelector("#slider")!;
    slider.innerHTML = "";

    this.slidesData.forEach((slideData) => {
      const slideContainer = document.createElement("div");
      slideContainer.classList.add("slider__slide");

      const slide = document.createElement("slide-image") as HTMLImageElement;
      slide.setAttribute("src", slideData.images[0]);
      slide.setAttribute("alt", slideData.title);

      slideContainer.appendChild(slide);
      slider.appendChild(slideContainer);
    });
  }

  private renderSlideContent() {
    const currentSlide = this.slidesData[this.currentIndex];
    this.slideContent.innerHTML = `
      <h2>${currentSlide.title}</h2>
      <p>${currentSlide.description}</p>
      <button id="moreInfoBtn">More Info</button>
      <button id="contactBtn">Contact</button>
    `;
  }

  private changeSlide(newIndex: number) {
    this.stopSlideInterval();
    this.currentIndex = newIndex;
    this.updateSlider();
    this.updateTimeLine();
    this.renderSlideContent();
    this.startSlideInterval();
  }

  private prevSlide() {
    const newIndex = (this.currentIndex - 1 + this.numSlides) % this.numSlides;
    this.changeSlide(newIndex);
  }

  private nextSlide() {
    const newIndex = (this.currentIndex + 1) % this.numSlides;
    this.changeSlide(newIndex);
  }

  private updateSlider() {
    const slider = this.shadowRoot!.getElementById("slider") as HTMLElement;
    slider.style.transform = `translateX(-${this.currentIndex * 100}%)`;
  }

  private updateTimeLine() {
    if (this.timeLine) {
      (this.timeLine as any).setProgress(this.currentIndex, this.numSlides);
    }
  }
}

customElements.define("image-slider", ImageSlider);
