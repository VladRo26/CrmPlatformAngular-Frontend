import { Injectable, inject } from '@angular/core';
import { NgxParticlesModule } from "@tsparticles/angular";
import { MoveDirection, OutMode, Container} from "@tsparticles/engine";
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
import { NgParticlesService } from "@tsparticles/angular";

@Injectable({
    providedIn: 'root',
})
export class ParticlesService {
    private particlesService = inject(NgParticlesService);
    particlesOptions = 
    {
        background: {
            color: {
              value: "#6a84c3"
            }
          },
          fpsLimit: 165,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push"
              },
              onHover: {
                enable: true,
                mode: "repulse"
              },
              resize: {
                enable: true
              }
            },
            modes: {
              push: {
                quantity: 4
              },
              repulse: {
                distance: 100,
                duration: 0.4
              }
            }
          },
          particles: {
            color: {
              value: "#ffffff"
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1
            },
            move: {
              direction: MoveDirection.none,  // Use the enum instead of the string "none"
              enable: true,
              outModes: {
                default: OutMode.bounce      // Use the enum value OutMode.bounce
              },
              random: true,
              speed: 2,
              straight: false
            },
            wobble: {
              distance: 5,
              enable: false,
              speed: {
                angle: 50,
                move: 10
              }
            },
            number: {
                density: {
                  enable: true,
                  area: 500    // Reduced from 1000 to 500; adjust as needed
                },
                value: 200
              },
            opacity: {
              value: 0.5
            },
            collisions: {
              absorb: {
                speed: 2
              }
            },
            shape: {
              type: "square"
            },
            rotate: {
              value: 2,
              animation: {
                enable: false,
                speed: 0,
                decay: 0,
                sync: true
              },
              direction: "clockwise",
              path: false
            },
            orbit: {
              animation: {
                count: 0,
                enable: false,
                speed: 1,
                decay: 0,
                delay: 0,
                sync: false
              },
              enable: false,
              opacity: 1,
              rotation: {
                value: 45
              },
              width: 1
            },
            size: {
              value: { min: 1, max: 7 }
            }
          },
          pauseOnBlur: true,
          detectRetina: true
        };
      

    initParticles() {
        this.particlesService.init(async (engine) => {
          await loadSlim(engine);
        });

        
}

particlesLoaded(container: Container): void {
    console.log('Particles loaded:', container);
    // Any additional logic you want to handle after particles load
  }

}

