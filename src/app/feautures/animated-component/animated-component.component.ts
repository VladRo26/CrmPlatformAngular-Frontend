import { Component, AfterViewInit } from '@angular/core';
// If using the CDN, declare anime; if installed via npm, import it
declare var anime: any;

@Component({
  selector: 'app-animated-text',
  standalone: true,
  template: `<h3 class="c2">DEVLINK CRM</h3>`,
  styles: [`
    .c2 {
      font-weight: bold;
      font-size: 2.8em;
      text-transform: uppercase;
      letter-spacing: 0.5em;
      text-align: top;
      margin: 1rem 0;
      margin-bottom: 2rem;
      white-space: nowrap; 
    }
    .c2 .letter {
      display: inline-block;
      line-height: 1em;
    }
  `]
})
export class AnimatedTextComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // Wrap every letter in a span
    const textWrapper = document.querySelector('.c2');
    if (textWrapper && textWrapper.textContent) {
      textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter' style='display:inline-block;'>$&</span>");
    }

    // Run the Anime.js timeline
    anime.timeline({ loop: true })
      .add({
        targets: '.c2 .letter',
        translateX: [40, 0],
        translateZ: 0,
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 1200,
        delay: (el: any, i: number) => 500 + 30 * i
      })
      .add({
        targets: '.c2 .letter',
        translateX: [0, -30],
        opacity: [1, 0],
        easing: "easeInExpo",
        duration: 1100,
        delay: (el: any, i: number) => 100 + 30 * i
      });
  }
}
