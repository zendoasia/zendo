"use client"
import { useId, useRef, useEffect, useState, useCallback } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import type { Container } from "@tsparticles/engine"
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
  const { words, id, className, particleColor, textClassName } = props

  const [init, setInit] = useState(false)
  const [textDimensions, setTextDimensions] = useState({ width: 0, height: 0 })
  const textRef = useRef<HTMLHeadingElement>(null)

  const [theme, setTheme] = useState<"light" | "dark">("dark")

  useEffect(() => {
    const detectTheme = () => {
      const isDark = document.documentElement.classList.contains("dark")
      setTheme(isDark ? "dark" : "light")
    }

    detectTheme()

    // Watch for theme changes
    const observer = new MutationObserver(detectTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  // Compute particle color based on theme
  const computedParticleColor = particleColor || (theme === "dark" ? "#FFFFFF" : "#000000")

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  // Debounced resize handler for better performance
  const measureText = useCallback(() => {
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect()
      setTextDimensions({ width: rect.width, height: rect.height })
    }
  }, [])

  useEffect(() => {
    measureText()

    let timeoutId: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(measureText, 100)
    }

    window.addEventListener("resize", debouncedResize)
    return () => {
      window.removeEventListener("resize", debouncedResize)
      clearTimeout(timeoutId)
    }
  }, [words, measureText])

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

  // Calculate sparkle area dimensions based on text
  const sparkleHeight = Math.max(textDimensions.height * 0.3, 32) // 30% of text height, minimum 32px
  const sparkleWidth = textDimensions.width || 0 // Use exact text width, no minimum

  // Fixed particle count independent of text size - more particles for better effect
  const particleCount = 400

  return (
    <span className={cn("relative inline-block", className)}>
      {/* Text for SEO & accessibility */}
      <h1
        ref={textRef}
        className={cn("md:text-7xl text-3xl lg:text-9xl font-bold text-center text-black dark:text-white relative z-20", textClassName)}
        style={{ position: "relative" }}
      >
        {words}
      </h1>

      {/* Sparkles and Gradient Container - positioned absolutely below text with gap */}
      {textDimensions.width > 0 && textDimensions.height > 0 && (
        <span
          className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none will-change-transform"
          style={{
            top: `${textDimensions.height + 8}px`,
            width: `${sparkleWidth}px`,
            height: `${sparkleHeight}px`,
            contain: "layout style paint",
          }}
        >
          {/* Gradient Effects - constrained to exact text width */}
          <span
            className="absolute top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] blur-sm transform-gpu"
            style={{
              left: `${sparkleWidth * 0.15}px`,
              width: `${sparkleWidth * 0.7}px`,
            }}
          />
          <span
            className="absolute top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px transform-gpu"
            style={{
              left: `${sparkleWidth * 0.15}px`,
              width: `${sparkleWidth * 0.7}px`,
            }}
          />
          <span
            className="absolute top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] blur-sm transform-gpu"
            style={{
              left: `${sparkleWidth * 0.35}px`,
              width: `${sparkleWidth * 0.3}px`,
            }}
          />
          <span
            className="absolute top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px transform-gpu"
            style={{
              left: `${sparkleWidth * 0.35}px`,
              width: `${sparkleWidth * 0.3}px`,
            }}
          />

          {/* Sparkles Layer */}
          <motion.span
            animate={controls}
            className="absolute inset-0 opacity-0 block transform-gpu will-change-transform"
            style={{ contain: "layout style paint" }}
          >
            {init && (
              <Particles
                id={id || generatedId}
                className="w-full h-full transform-gpu"
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
                  fpsLimit: 60,
                  interactivity: {
                    events: {
                      onClick: {
                        enable: false,
                      },
                      onHover: {
                        enable: false,
                      },
                      resize: { enable: true },
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
                      enable: false,
                    },
                    color: {
                      value: computedParticleColor,
                    },
                    move: {
                      direction: "none",
                      enable: true,
                      outModes: {
                        default: "out",
                      },
                      random: true,
                      speed: {
                        min: 0.1,
                        max: 0.8,
                      },
                      straight: false,
                    },
                    number: {
                      density: {
                        enable: true,
                        width: 400,
                        height: 400,
                      },
                      value: particleCount,
                    },
                    opacity: {
                      value: {
                        min: 0.1,
                        max: 1,
                      },
                      animation: {
                        enable: true,
                        speed: 3,
                        sync: false,
                        mode: "auto",
                        startValue: "random",
                      },
                    },
                    reduceDuplicates: true,
                    shape: {
                      type: "circle",
                    },
                    size: {
                      value: {
                        min: 0.4,
                        max: 1,
                      },
                      animation: {
                        enable: false,
                      },
                    },
                    stroke: {
                      width: 0,
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
                  },
                  detectRetina: true,
                  smooth: true,
                  style: {
                    position: "absolute",
                  },
                }}
              />
            )}
          </motion.span>

          {/* Pyramid Gradient Masks with GPU acceleration */}
          <span className="absolute inset-0 w-full h-full [mask-image:linear-gradient(to_bottom,white_0%,white_20%,transparent_100%)] pointer-events-none transform-gpu" />
          <span className="absolute inset-0 w-full h-full [mask-image:radial-gradient(ellipse_80%_100%_at_center_top,white_0%,white_40%,transparent_80%)] pointer-events-none transform-gpu" />
        </span>
      )}
    </span>
  )
}
