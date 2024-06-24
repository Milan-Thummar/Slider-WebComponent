import sass from "sass";

class SliderTimeLine extends HTMLElement {
  private timeLinesContainer: HTMLDivElement;
  private timeoutID: number | null;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const input = `
      :host {
        width: 60%;

      .slider__timelines {
        display: flex;
        align-items: center;
        justify-content: left;
        gap: 1rem;

        .slider__timeline {
            width: 7rem;
            height: 0.25rem;
            background-color: #a1a1a1;
            border-radius: 0.5rem;
        }

        .slider__timeline-fill {
            height: 100%;
            background-color: #fff;
            transition: width 3s linear;
            border-radius: 0.5rem;
            width: 0;
        }
      }

      @media only screen and (max-width: 1024px) {
        width: 80%;

        .slider__timeline {
            width: 7rem;
        }

        .slider__timelines {
            gap: 10px;
        }
      }

      @media only screen and (max-width: 768px) {
        .slider__timeline {
            width: 4rem;
        }
      }

      @media only screen and (max-width: 480px) {
        width: 90%;
        margin: auto;

        .slider__timelines {
            justify-content: center;
            gap: 0.5rem;
        }

        .slider__timeline {
            width: 3.75rem;
        }
      }
    }
    `;

    const result = sass.compileString(input);
    shadow.innerHTML = `
    <style>
    ${result.css.toString()}
    </style>
      <div class="slider__timelines" id="timeLinesContainer"></div>
    `;

    this.timeLinesContainer = this.shadowRoot!.getElementById(
      "timeLinesContainer"
    ) as HTMLDivElement;
    this.timeoutID = null;
  }

  createTimeLine() {
    const timeLine = document.createElement("div");
    timeLine.classList.add("slider__timeline");
    const timeLineFill = document.createElement("div");
    timeLineFill.classList.add("slider__timeline-fill");
    timeLine.appendChild(timeLineFill);
    this.timeLinesContainer.appendChild(timeLine);
  }

  setTimeLineStyles(
    timeLineFill: HTMLElement,
    transitionDuration: string,
    width: string
  ) {
    timeLineFill.style.transitionDuration = transitionDuration;
    timeLineFill.style.width = width;
  }

  setProgress(index: number, totalSlides: number) {
    this.timeLinesContainer.innerHTML = "";

    for (let i = 0; i < totalSlides; i++) {
      this.createTimeLine();
    }

    const timeLines =
      this.timeLinesContainer.querySelectorAll<HTMLDivElement>(
        ".slider__timeline"
      );

    const activeIndex = index % totalSlides;

    timeLines.forEach((timeLine, currentIndex) => {
      const timeLineFill = timeLine.querySelector<HTMLDivElement>(
        ".slider__timeline-fill"
      );
      if (currentIndex === activeIndex) {
        this.setTimeLineStyles(timeLineFill!, "0s", "0");
        if (this.timeoutID) {
          clearTimeout(this.timeoutID);
        }
        this.timeoutID = window.setTimeout(() => {
          this.setTimeLineStyles(timeLineFill!, "3s", "100%");
        }, 100);
      } else {
        this.setTimeLineStyles(timeLineFill!, "0s", "0");
      }
    });
  }
}

customElements.define("slider-timeline", SliderTimeLine);
