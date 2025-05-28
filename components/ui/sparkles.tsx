"use client"
import { useId, useMemo } from "react"
import { useEffect, useState } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import type { Container, SingleOrMultiple } from "@tsparticles/engine"
import { loadSlim } from "@tsparticles/slim"
import { cn } from "@/lib/utils"
import { motion, useAnimation } from "motion/react"

type SparklesHeroProps = {
  words: string
  id?: string
  className?: string
  particleColor?: string
  textClassName?: string
}

export const SparklesHero = (props: SparklesHeroProps) => {
  const { words, id, className, particleColor = "#FFFFFF", textClassName } = props

  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const controls = useAnimation()

  const particlesLoaded = async (container?: Container) => {
    if (container) {
      controls.start({
        opacity: 1,
        transition: {
          duration: 1,
        },
      })
    }
  }

  const generatedId = useId()

  // Split text into individual characters for span wrapping
  const textChars = useMemo(() => {
    return words.split("").map((char, index) => (
      <span key={index} className="inline-block">
        {char === " " ? "\u00A0" : char}
      </span>
    ))
  }, [words])

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      {/* Text */}
      <h1
        className={cn(
          "md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20 mb-4",
          textClassName,
        )}
      >
        {textChars}
      </h1>

      {/* Sparkles and Gradient Container */}
      <div className="w-full h-12 relative">
        {/* Gradient Effects */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

        {/* Sparkles Layer */}
        <motion.div animate={controls} className="absolute inset-0 opacity-0">
          {init && (
            <Particles
              id={id || generatedId}
              className="w-full h-full"
              particlesLoaded={particlesLoaded}
              options={{
                background: {
                  color: {
                    value: "transparent",
                  },
                },
                fullScreen: {
                  enable: false,
                  zIndex: 1,
                },
                fpsLimit: 120,
                interactivity: {
                  events: {
                    onClick: {
                      enable: true,
                      mode: "push",
                    },
                    onHover: {
                      enable: false,
                      mode: "repulse",
                    },
                    resize: { enable: true },
                  },
                  modes: {
                    push: {
                      quantity: 4,
                    },
                    repulse: {
                      distance: 200,
                      duration: 0.4,
                    },
                  },
                },
                particles: {
                  bounce: {
                    horizontal: {
                      value: 1,
                    },
                    vertical: {
                      value: 1,
                    },
                  },
                  collisions: {
                    absorb: {
                      speed: 2,
                    },
                    bounce: {
                      horizontal: {
                        value: 1,
                      },
                      vertical: {
                        value: 1,
                      },
                    },
                    enable: false,
                    maxSpeed: 50,
                    mode: "bounce",
                    overlap: {
                      enable: true,
                      retries: 0,
                    },
                  },
                  color: {
                    value: particleColor,
                    animation: {
                      h: {
                        count: 0,
                        enable: false,
                        speed: 1,
                        decay: 0,
                        delay: 0,
                        sync: true,
                        offset: 0,
                      },
                      s: {
                        count: 0,
                        enable: false,
                        speed: 1,
                        decay: 0,
                        delay: 0,
                        sync: true,
                        offset: 0,
                      },
                      l: {
                        count: 0,
                        enable: false,
                        speed: 1,
                        decay: 0,
                        delay: 0,
                        sync: true,
                        offset: 0,
                      },
                    },
                  },
                  effect: {
                    close: true,
                    fill: true,
                    options: {},
                    type: {} as SingleOrMultiple<string> | undefined,
                  },
                  groups: {},
                  move: {
                    angle: {
                      offset: 0,
                      value: 90,
                    },
                    attract: {
                      distance: 200,
                      enable: false,
                      rotate: {
                        x: 3000,
                        y: 3000,
                      },
                    },
                    center: {
                      x: 50,
                      y: 50,
                      mode: "percent",
                      radius: 0,
                    },
                    decay: 0,
                    distance: {},
                    direction: "none",
                    drift: 0,
                    enable: true,
                    gravity: {
                      acceleration: 9.81,
                      enable: false,
                      inverse: false,
                      maxSpeed: 50,
                    },
                    path: {
                      clamp: true,
                      delay: {
                        value: 0,
                      },
                      enable: false,
                      options: {},
                    },
                    outModes: {
                      default: "out",
                    },
                    random: false,
                    size: false,
                    speed: {
                      min: 0.1,
                      max: 1,
                    },
                    spin: {
                      acceleration: 0,
                      enable: false,
                    },
                    straight: false,
                    trail: {
                      enable: false,
                      length: 10,
                      fill: {},
                    },
                    vibrate: false,
                    warp: false,
                  },
                  number: {
                    density: {
                      enable: true,
                      width: 400,
                      height: 400,
                    },
                    limit: {
                      mode: "delete",
                      value: 0,
                    },
                    value: 800,
                  },
                  opacity: {
                    value: {
                      min: 0.1,
                      max: 1,
                    },
                    animation: {
                      count: 0,
                      enable: true,
                      speed: 4,
                      decay: 0,
                      delay: 0,
                      sync: false,
                      mode: "auto",
                      startValue: "random",
                      destroy: "none",
                    },
                  },
                  reduceDuplicates: false,
                  shadow: {
                    blur: 0,
                    color: {
                      value: "#000",
                    },
                    enable: false,
                    offset: {
                      x: 0,
                      y: 0,
                    },
                  },
                  shape: {
                    close: true,
                    fill: true,
                    options: {},
                    type: "circle",
                  },
                  size: {
                    value: {
                      min: 0.4,
                      max: 1,
                    },
                    animation: {
                      count: 0,
                      enable: false,
                      speed: 5,
                      decay: 0,
                      delay: 0,
                      sync: false,
                      mode: "auto",
                      startValue: "random",
                      destroy: "none",
                    },
                  },
                  stroke: {
                    width: 0,
                  },
                  zIndex: {
                    value: 0,
                    opacityRate: 1,
                    sizeRate: 1,
                    velocityRate: 1,
                  },
                  destroy: {
                    bounds: {},
                    mode: "none",
                    split: {
                      count: 1,
                      factor: {
                        value: 3,
                      },
                      rate: {
                        value: {
                          min: 4,
                          max: 9,
                        },
                      },
                      sizeOffset: true,
                    },
                  },
                  roll: {
                    darken: {
                      enable: false,
                      value: 0,
                    },
                    enable: false,
                    enlighten: {
                      enable: false,
                      value: 0,
                    },
                    mode: "vertical",
                    speed: 25,
                  },
                  tilt: {
                    value: 0,
                    animation: {
                      enable: false,
                      speed: 0,
                      decay: 0,
                      sync: false,
                    },
                    direction: "clockwise",
                    enable: false,
                  },
                  twinkle: {
                    lines: {
                      enable: false,
                      frequency: 0.05,
                      opacity: 1,
                    },
                    particles: {
                      enable: false,
                      frequency: 0.05,
                      opacity: 1,
                    },
                  },
                  wobble: {
                    distance: 5,
                    enable: false,
                    speed: {
                      angle: 50,
                      move: 10,
                    },
                  },
                  life: {
                    count: 0,
                    delay: {
                      value: 0,
                      sync: false,
                    },
                    duration: {
                      value: 0,
                      sync: false,
                    },
                  },
                  rotate: {
                    value: 0,
                    animation: {
                      enable: false,
                      speed: 0,
                      decay: 0,
                      sync: false,
                    },
                    direction: "clockwise",
                    path: false,
                  },
                  orbit: {
                    animation: {
                      count: 0,
                      enable: false,
                      speed: 1,
                      decay: 0,
                      delay: 0,
                      sync: false,
                    },
                    enable: false,
                    opacity: 1,
                    rotation: {
                      value: 45,
                    },
                    width: 1,
                  },
                  links: {
                    blink: false,
                    color: {
                      value: "#fff",
                    },
                    consent: false,
                    distance: 100,
                    enable: false,
                    frequency: 1,
                    opacity: 1,
                    shadow: {
                      blur: 5,
                      color: {
                        value: "#000",
                      },
                      enable: false,
                    },
                    triangles: {
                      enable: false,
                      frequency: 1,
                    },
                    width: 1,
                    warp: false,
                  },
                  repulse: {
                    value: 0,
                    enabled: false,
                    distance: 1,
                    duration: 1,
                    factor: 1,
                    speed: 1,
                  },
                },
                detectRetina: true,
              }}
            />
          )}
        </motion.div>

        {/* Triangular/Pyramid Gradient Mask for smooth fade-out */}
        <div className="absolute inset-0 w-full h-full [mask-image:linear-gradient(to_bottom,white_0%,white_20%,transparent_100%)]"></div>

        {/* Additional side fade for pyramid effect */}
        <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(ellipse_80%_100%_at_center_top,white_0%,white_40%,transparent_80%)]"></div>
      </div>
    </div>
  )
}
