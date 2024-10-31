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
    particlesOptions = {
        background: {
            color: {
                value: "#6a84c3",
            },
        },
        fpsLimit: 165,
        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: "push",
                },
                onHover: {
                    enable: true,
                    mode: "repulse",
                },
                resize: { enable: true },  // Change this line
            },
            modes: {
                push: {
                    quantity: 4,
                },
                repulse: {
                    distance: 100,
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: "#ffffff",
            },
            links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
            },
            move: {
                direction: MoveDirection.none,
                enable: true,
                outModes: {
                    default: OutMode.bounce,
                },
                random: true,
                speed: 2,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    area: 800,
                },
                value: 90,
            },
            opacity: {
                value: 0.5,
            },
            shape: {
                type: "square",
            },
            size: {
                value: { min: 1, max: 5 },
            },
        },
        detectRetina: true,
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

