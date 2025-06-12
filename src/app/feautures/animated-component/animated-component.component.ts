import { Component, AfterViewInit } from '@angular/core';
// If using the CDN, declare anime; if installed via npm, import it
declare var anime: any;

@Component({
  selector: 'app-animated-text',
  standalone: true,
  template: `
    <h3 class="c2">DEVLINK CRM</h3>
  `,
  styles: [`
    /* Host wrapper centers the heading */
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      padding: 0 1rem;
      box-sizing: border-box;
    }

    /* Shrink-to-fit heading, centered text */
    .c2 {
      display: inline-block;
      margin: 1rem 0;
      font-weight: bold;
      font-size: clamp(1.4rem, 5vw, 2.8rem);
      text-transform: uppercase;
      letter-spacing: 0.15em;
      line-height: 1.2;
      text-align: center;
    }

    /* Per-letter spans for animation */
    .c2 .letter {
      display: inline-block;
      line-height: 1;
    }

    /* Responsive tweak for very small screens */
    @media (max-width: 480px) {
      .c2 {
        font-size: clamp(1.2rem, 8vw, 2rem);
        letter-spacing: 0.1em;
      }
    }
  `]
})
export class AnimatedTextComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // Wrap every non-space character in a span.  
    const textWrapper = document.querySelector('.c2');
    if (textWrapper && textWrapper.textContent) {
      textWrapper.innerHTML = textWrapper.textContent
        .replace(/\S/g, "<span class='letter'>$&</span>");
    }

    // Anime.js timeline
    anime.timeline({ loop: true })
      .add({
        targets: '.c2 .letter',
        translateX: [40, 0],
        translateZ: 0,
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1200,
        delay: (el: any, i: number) => 500 + 30 * i
      })
      .add({
        targets: '.c2 .letter',
        translateX: [0, -30],
        opacity: [1, 0],
        easing: 'easeInExpo',
        duration: 1100,
        delay: (el: any, i: number) => 100 + 30 * i
      });
  }
}