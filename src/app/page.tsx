"use client";

import Image from "next/image";
import img1 from "../../public/Stack.png";
import img2 from "../../public/bird.jpg";
import sideArrow from "../../public/Group 6.svg";

import logo from "../../public/kclgoo.svg";
import boxarrow from "../../public/box-arrow.svg";
import arrow2 from "../../public/downarrow.svg";
import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

export default function Home() {
  const [mobileImageHeight, setMobileImageHeight] = useState(110);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projects = useMemo(
    () => [
      {
        id: "01",
        title: "MORTON MARTIAL ARTS",
        images: [img1, img2, img1, img2],
        url: "/MortonMartialArts",
        desc: "DFDMDMDKSDOSAKDFDMDMDKSDOSAKDFDMDMDKSDOSAKDFDMDMDKSDOSAKDFDMDMDKSDOSAKDFDJADFKDAFMDKFMSDFSDFS",
        services: "Web Design / SEO",
        tools: "Figma / Framer",
      },
      {
        id: "02",
        title: "LOCH STOCH",
        images: [img1, img2],
        url: "#",
        desc: "DFDMDMDKSDOSAKDFDMDMDKSDOSAKDFDMDMDKSDOSAKDFDMDMDKSDOSAKDFDMDMDKSDOSAKDFDJADFKDAFMDKFMSDFSDFS",
        services: "Web Design / SEO",
        tools: "Figma / Framer",
      },
      {
        id: "03",
        title: "AMARILS",
        images: [img1, img2],
        url: "#",
        desc: "DFDMDMDKSDOSAKDFDMDMDKSDOSAKDFDMDMDKSDOSAKDFDMDMDKSDOSAKDFDMDMDKSDOSAKDFDJADFKDAFMDKFMSDFSDFS",
        services: "Web Design / SEO",
        tools: "Figma / Framer",
      },
    ],
    []
  );

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const introText = `Based in London, we are a design and SEO agency that believes a great website is built with intention. We partner with businesses to create considered online experiences that not only look exceptional but perform flawlessly. Our focus is on merging thoughtful design with strategic SEO to ensure you connect meaningfully with your audience and achieve your goals.`;

  const overlayRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLImageElement | null>(null);
  const openImgRef = useRef<HTMLImageElement | null>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(6).fill(null)
  );
  const projectTextRefs = useRef<(HTMLParagraphElement | null)[]>(
    new Array(3).fill(null)
  );
  const mobileProjectsContainerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const modalImageRef = useRef<HTMLDivElement>(null);

  // Handle next image in carousel with vertical animation
  const handleNextImage = useCallback(() => {
    if (selectedProject === null) return;
    const images = projects[selectedProject].images;
    if (images.length <= 1) return;

    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
  }, [selectedProject, currentImageIndex, projects]);

  // Calculate mobile image height based on available space
  const calculateMobileImageHeight = useCallback(() => {
    if (typeof window !== "undefined") {
      const viewportHeight = window.innerHeight;
      const headerElement = headingRef.current?.parentElement?.parentElement;
      const introElement = mobileIntroRef.current;
      const navElement = mobileNavRef.current?.parentElement;
      const projectDetailsHeight = 30 * projects.length;

      let usedHeight = 0;
      usedHeight += 16;

      if (headerElement) {
        usedHeight += headerElement.getBoundingClientRect().height;
      } else {
        usedHeight += 200;
      }

      if (introElement) {
        usedHeight += introElement.getBoundingClientRect().height;
      } else {
        usedHeight += 100;
      }

      if (navElement) {
        usedHeight += navElement.getBoundingClientRect().height;
      } else {
        usedHeight += 120;
      }

      usedHeight += projectDetailsHeight;
      usedHeight += 16 * (projects.length + 2);

      const availableHeight = viewportHeight - usedHeight;
      const imageHeight = Math.max(
        80,
        Math.floor(availableHeight / projects.length)
      );

      setMobileImageHeight(imageHeight);
    }
  }, [projects.length]);

  // Handle project click with ghost animation
  const handleProjectClick = useCallback((index: number) => {
    const rawEl = imagesRef.current[index] || imagesRef.current[index + 3];
    const imgEl = getImgEl(rawEl as HTMLImageElement);
    if (!imgEl || !overlayRef.current) return;

    // Set states first
    setSelectedProject(index);
    setCurrentImageIndex(0);
    setIsModalOpen(true);

    // Store reference and prevent body scroll
    openImgRef.current = imgEl;
    const prevOverflow = document.body.style.overflow;
    (
      document.body as HTMLElement & { __prevOverflow?: string }
    ).__prevOverflow = prevOverflow;
    document.body.style.overflow = "hidden";

    const rect = imgEl.getBoundingClientRect();

    // Create ghost image
    const ghost = document.createElement("img");
    ghostRef.current = ghost;
    ghost.src = imgEl.currentSrc || imgEl.src;
    Object.assign(ghost.style, {
      position: "fixed",
      left: rect.left + "px",
      top: rect.top + "px",
      width: rect.width + "px",
      height: rect.height + "px",
      objectFit: "cover",
      zIndex: "101",
      borderRadius: "8px",
    });

    // Calculate target dimensions
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const ratio =
      imgEl.naturalWidth && imgEl.naturalHeight
        ? imgEl.naturalWidth / imgEl.naturalHeight
        : rect.width / rect.height;

    const targetH = Math.min(vh * 0.5, 400);
    const targetW = Math.min(vw * 0.4, targetH * ratio);
    const finalLeft = (vw - targetW) / 2;
    const finalTop = (vh - targetH) / 2;

    const overlay = overlayRef.current;
    overlay.style.display = "flex";
    overlay.style.pointerEvents = "auto";

    const ghostContainer = document.getElementById("ghost-container");
    if (ghostContainer) {
      ghostContainer.innerHTML = "";
      ghostContainer.appendChild(ghost);
    }

    imgEl.style.visibility = "hidden";

    // Use setTimeout to ensure DOM is updated before animation
    setTimeout(() => {
      // Set up modal image with same dimensions - now targeting first slide
      const modalCarousel = modalImageRef.current;
      const firstSlide = modalCarousel?.querySelector(
        'div[style*="height: 400"]'
      ) as HTMLElement;
      if (firstSlide) {
        const slideImage = firstSlide.querySelector("img") as HTMLImageElement;
        if (slideImage) {
          slideImage.style.opacity = "0";
        }
        firstSlide.style.width = `${targetW}px`;
        firstSlide.style.height = `${targetH}px`;
      }

      gsap
        .timeline()
        .to(overlay, { opacity: 1, duration: 0.3, ease: "power2.out" })
        .to(
          ghost,
          {
            left: finalLeft,
            top: finalTop,
            width: targetW,
            height: targetH,
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: () => {
              // Seamless switch to modal carousel
              const firstSlide = modalCarousel?.querySelector(
                'div[style*="height: 400"]'
              ) as HTMLElement;
              if (firstSlide) {
                const slideImage = firstSlide.querySelector(
                  "img"
                ) as HTMLImageElement;
                if (slideImage) {
                  slideImage.style.opacity = "1";
                }
              }
              if (ghost && ghost.parentNode) {
                ghost.parentNode.removeChild(ghost);
              }
              ghostRef.current = null;
            },
          },
          "<"
        )
        .fromTo(
          ".overlay-heading, .overlay-logo, .overlay-details, .overlay-view, .overlay-carousel-controls",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.4"
        );
    }, 0);
  }, []);

  // Handle modal close with reverse ghost animation
  const handleCloseModal = useCallback(() => {
    const overlay = overlayRef.current;
    const modalCarousel = modalImageRef.current;
    const imgEl = openImgRef.current;
    if (!overlay || !imgEl) return;

    const rect = imgEl.getBoundingClientRect();

    // Get current active slide image
    const currentSlide = modalCarousel?.children[
      currentImageIndex
    ] as HTMLElement;
    const currentSlideImage = currentSlide?.querySelector(
      "img"
    ) as HTMLImageElement;

    // Create a new ghost image for the close animation
    const closeGhost = document.createElement("img");
    closeGhost.src = currentSlideImage?.src || "";

    // Get current modal image dimensions
    const currentWidth = currentSlideImage?.offsetWidth || 0;
    const currentHeight = currentSlideImage?.offsetHeight || 0;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const currentLeft = (vw - currentWidth) / 2;
    const currentTop = (vh - currentHeight) / 2;

    Object.assign(closeGhost.style, {
      position: "fixed",
      left: currentLeft + "px",
      top: currentTop + "px",
      width: currentWidth + "px",
      height: currentHeight + "px",
      objectFit: "cover",
      zIndex: "101",
      borderRadius: "8px",
    });
    // Hide all carousel images immediately
    if (modalCarousel) {
      const allSlides = modalCarousel.querySelectorAll(".carousel-slide img");
      allSlides.forEach((img) => {
        (img as HTMLImageElement).style.opacity = "0";
      });
    }
    // Hide modal image and show close ghost
    if (currentSlideImage) currentSlideImage.style.opacity = "0";

    const ghostContainer = document.getElementById("ghost-container");
    if (ghostContainer) {
      ghostContainer.innerHTML = "";
      ghostContainer.appendChild(closeGhost);
    }

    gsap
      .timeline({
        onComplete: () => {
          // Restore original image
          imgEl.style.visibility = "visible";
          overlay.style.opacity = "0";
          overlay.style.display = "none";
          overlay.style.pointerEvents = "none";

          // Clean up
          if (closeGhost && closeGhost.parentNode) {
            closeGhost.parentNode.removeChild(closeGhost);
          }
          openImgRef.current = null;

          // Restore body scroll
          const prevOverflow =
            (document.body as HTMLElement & { __prevOverflow?: string })
              .__prevOverflow || "";
          document.body.style.overflow = prevOverflow;
          setIsModalOpen(false);
          setSelectedProject(null);
        },
      })
      // First animate other elements out
      .to(
        ".overlay-heading, .overlay-logo, .overlay-details, .overlay-view, .overlay-carousel-controls",
        {
          opacity: 0,
          y: -20,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.in",
        }
      )
      // Then animate the image back to original position
      .to(
        closeGhost,
        {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          duration: 0.7,
          ease: "power3.inOut",
        },
        "-=0.1"
      )
      // Finally fade out overlay
      .to(
        overlay,
        {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        },
        "-=0.1"
      );
  }, [currentImageIndex]);

  // Add interactive hover handlers for linking images and project text
  const handleProjectHover = useCallback(
    (index: number, isHovering: boolean) => {
      const desktopImage = imagesRef.current[index];
      const mobileImage = imagesRef.current[index + 3];
      const projectText = projectTextRefs.current[index];

      if (isHovering) {
        if (desktopImage) {
          gsap.to(desktopImage, {
            filter: "grayscale(0%)",
            scaleX: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });
        }
        if (mobileImage) {
          gsap.to(mobileImage, {
            filter: "grayscale(0%)",
            scaleX: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });
        }
        if (projectText) {
          gsap.to(projectText, {
            fontWeight: "bold",
            duration: 0.2,
            ease: "power2.out",
          });
        }
      } else {
        if (desktopImage) {
          gsap.to(desktopImage, {
            filter: "grayscale(100%)",
            scaleX: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        }
        if (mobileImage) {
          gsap.to(mobileImage, {
            scaleX: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        }
        if (projectText) {
          gsap.to(projectText, {
            fontWeight: "normal",
            duration: 0.2,
            ease: "power2.out",
          });
        }
      }
    },
    []
  );

  const getImgEl = (el: HTMLImageElement | null): HTMLImageElement | null => {
    if (!el) return null;
    if (el.tagName?.toLowerCase() === "img") return el;
    const inner = (el as unknown as HTMLElement)?.querySelector?.("img");
    return (inner as HTMLImageElement) || el;
  };

  const projectsHeaderRef = useRef<HTMLDivElement>(null);
  const projectsListRef = useRef<HTMLDivElement>(null);
  const introTextRef = useRef<HTMLParagraphElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mobileIntroRef = useRef<HTMLParagraphElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const mobileProjectsHeaderRef = useRef<HTMLDivElement>(null);
  const mobileProjectDetailsRef = useRef<(HTMLDivElement | null)[]>(
    new Array(3).fill(null)
  );

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, handleCloseModal]);

  // Initialize carousel position when modal opens
  useEffect(() => {
    if (isModalOpen && selectedProject !== null && modalImageRef.current) {
      const carouselContainer = modalImageRef.current;

      // Kill any existing animations first
      gsap.killTweensOf(carouselContainer);

      // Calculate proper initial position to center the first slide
      const fixedSlideHeight = 400;
      const gapHeight = 150;
      const modalContent = overlayRef.current;
      const containerHeight = modalContent
        ? modalContent.clientHeight
        : window.innerHeight;
      // Position first slide (index 0) in the center of the screen
      const yOffset = containerHeight / 2 - fixedSlideHeight / 2;

      // Set initial position immediately without animation
      gsap.set(carouselContainer, {
        y: yOffset,
        clearProps: "all",
      });
    }
  }, [isModalOpen, selectedProject]);

  // Handle carousel positioning when currentImageIndex changes
  useEffect(() => {
    if (isModalOpen && selectedProject !== null && modalImageRef.current) {
      const carouselContainer = modalImageRef.current;

      const fixedSlideHeight = 400;
      const gapHeight = 150;
      const totalStep = fixedSlideHeight + gapHeight;

      // This offset centers the current slide vertically on the screen:
      // 1. Move container up to the position of current slide
      // 2. Push down by half the total viewport height minus half the slide height, to center slide vertically
      const yOffset =
        -currentImageIndex * totalStep +
        (overlayRef.current?.clientHeight || window.innerHeight) / 2 -
        fixedSlideHeight / 2;

      gsap.to(carouselContainer, {
        y: yOffset,
        duration: 0.6,
        ease: "power2.inOut",
      });
    }
  }, [currentImageIndex, isModalOpen, selectedProject]);

  // Update modal image size on resize and handle carousel positioning
  useEffect(() => {
    const handleResize = () => {
      calculateMobileImageHeight();

      // Handle carousel positioning on resize
      if (isModalOpen && selectedProject !== null && modalImageRef.current) {
        const carouselContainer = modalImageRef.current;
        const fixedSlideHeight = 400;
        const gapHeight = 150;
        const totalStep = fixedSlideHeight + gapHeight;

        // Same positioning logic as the carousel effect
        const yOffset =
          -currentImageIndex * totalStep +
          (overlayRef.current?.clientHeight || window.innerHeight) / 2 -
          fixedSlideHeight / 2;

        // Kill existing animations and set new position
        gsap.killTweensOf(carouselContainer);
        gsap.to(carouselContainer, {
          y: yOffset,
          duration: 0.3,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      }
    };

    let resizeTimeout: NodeJS.Timeout;
    const debouncedHandleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
      clearTimeout(resizeTimeout);
    };
  }, [
    calculateMobileImageHeight,
    isModalOpen,
    selectedProject,
    currentImageIndex,
  ]);

  // Main animation effect
  useEffect(() => {
    const logoElement = logoRef.current;
    const logoContainer = logoContainerRef.current;
    const headingElement = headingRef.current;
    const imageElements = imagesRef.current;
    const projectsHeaderElement = projectsHeaderRef.current;
    const projectsListElement = projectsListRef.current;
    const introTextElement = introTextRef.current;
    const navigationElement = navigationRef.current;
    const ctaElement = ctaRef.current;
    const mobileIntroElement = mobileIntroRef.current;
    const mobileNavElement = mobileNavRef.current;
    const mobileProjectsHeaderElement = mobileProjectsHeaderRef.current;
    const mobileProjectDetailsElements = mobileProjectDetailsRef.current;

    // Initially hide all content
    gsap.set(headingElement, {
      opacity: 0,
      y: 60,
      rotationX: -15,
    });

    gsap.set(imageElements, {
      opacity: 0,
      y: 40,
      scale: 0.95,
      filter: "blur(4px) grayscale(100%)",
      visibility: "hidden",
    });

    gsap.set([projectsHeaderElement, projectsListElement], {
      opacity: 0,
      y: 30,
      x: -20,
    });

    gsap.set(introTextElement, {
      opacity: 0,
      y: 30,
    });

    gsap.set([navigationElement, ctaElement], {
      opacity: 0,
      y: 20,
    });

    gsap.set(
      [mobileIntroElement, mobileNavElement, mobileProjectsHeaderElement],
      {
        opacity: 0,
        y: 30,
      }
    );

    gsap.set(mobileProjectDetailsElements, {
      opacity: 0,
      y: 20,
    });

    // Get the final position of the logo container
    let finalX = 0;
    let finalY = 0;
    if (logoContainer) {
      const containerRect = logoContainer.getBoundingClientRect();
      finalX = containerRect.left;
      finalY = containerRect.top;
    }

    // Set initial state: center of viewport
    gsap.set(logoElement, {
      position: "absolute",
      left: "50vw",
      top: "50vh",
      xPercent: -50,
      yPercent: -50,
      opacity: 0,
      zIndex: 10,
      scale: 1.2,
    });

    // Create animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(logoElement, {
          position: "static",
          left: "auto",
          top: "auto",
          xPercent: 0,
          yPercent: 0,
          zIndex: "auto",
          scale: 1,
        });
      },
    });

    // Logo animation
    tl.to(logoElement, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
    })
      .to(logoElement, {
        opacity: 0.4,
        scale: 1.05,
        duration: 0.8,
        repeat: 2,
        yoyo: true,
        ease: "sine.inOut",
      })
      .to(logoElement, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      })
      .to(logoElement, {
        left: finalX,
        top: finalY,
        xPercent: 0,
        yPercent: 0,
        duration: 1.2,
        ease: "power3.inOut",
      })
      .to(
        headingElement,
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.3"
      )
      .to(
        imageElements,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px) grayscale(100%)",
          visibility: "visible",
          duration: 0.7,
          stagger: {
            amount: 0.4,
            ease: "power2.out",
          },
          ease: "power3.out",
        },
        "-=0.2"
      )
      .to(
        projectsHeaderElement,
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.1"
      )
      .to(
        projectsListElement,
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .to(
        introTextElement,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
        },
        "-=0.3"
      )
      .to(
        navigationElement,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .to(
        [mobileIntroElement, mobileNavElement, mobileProjectsHeaderElement],
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
        },
        "-=0.5"
      )
      .to(
        mobileProjectDetailsElements,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.2"
      )
      .to(
        ctaElement,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4"
      );

    calculateMobileImageHeight();
  }, [calculateMobileImageHeight]);

  return (
    <div className="bg-white h-[100dvh] overflow-clip">
      {/* Main Content */}
      <main
        ref={mainContentRef}
        className="flex flex-col justify-between min-h-[100dvh] p-2 md:p-4 text-black"
      >
        {/* TOP SECTION: Header with Logo and CTA */}
        <div className="flex flex-row justify-between">
          <div className="flex gap-4">
            <div ref={headingRef} className="flex flex-col overflow-hidden">
              <h1 className="text-4xl md:text-8xl lg:text-[140px] leading-none font-black">
                KETER
              </h1>
              <h1 className="text-4xl md:text-8xl lg:text-[140px] leading-none font-black">
                CREATIVE
              </h1>
            </div>
          </div>
          <div
            ref={logoContainerRef}
            className="flex flex-col items-center gap-2"
          >
            <div ref={logoRef} className="logo-container">
              <Image
                src={logo}
                alt="Keter Creative Logo"
                className="h-18 pt-2 md:h-auto w-fit"
                priority
              />
            </div>
            <div
              ref={ctaRef}
              className="text-md font-bold flex flex-col items-center cursor-pointer transition-all duration-300 hidden md:flex"
            >
              <a href="/contact">
                {" "}
                <p> WORK WITH US</p>
              </a>{" "}
              <div>
                <Image src={boxarrow} alt="Arrow icon" width={24} height={24} />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION - DESKTOP LAYOUT */}
        <div>
          <div className="hidden md:flex w-full items-stretch gap-4">
            <div className="w-1/3 flex flex-col justify-between">
              <div>
                <div
                  ref={projectsHeaderRef}
                  className="font-extrabold flex gap-2 text-sm mb-2 items-center"
                >
                  <h3>
                    LATEST <br /> PROJECTS
                  </h3>
                  <Image src={arrow2} alt="Down arrow" width={12} height={12} />
                </div>
                <div ref={projectsListRef} className="flex flex-col text-sm">
                  {projects.map((project, index) => (
                    <p
                      key={project.id}
                      ref={(el) => {
                        projectTextRefs.current[index] = el;
                      }}
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => {
                        if (window.innerWidth >= 768) {
                          handleProjectHover(index, true);
                        }
                      }}
                      onMouseLeave={() => {
                        if (window.innerWidth >= 768) {
                          handleProjectHover(index, false);
                        }
                      }}
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          // md breakpoint
                          window.location.href = projects[index].url;
                        } else {
                          handleProjectClick(index);
                        }
                      }}
                    >
                      {project.title}
                    </p>
                  ))}
                </div>
              </div>
              <div className="lg:mr-16">
                <p ref={introTextRef}>{introText}</p>
              </div>
            </div>

            <div className="w-1/3 flex flex-col justify-center  gap-4">
              {projects.map((project, index) => (
                <div key={project.id}>
                  <Image
                    ref={(el) => {
                      imagesRef.current[index] = el;
                    }}
                    src={project.images[0]}
                    alt={`Showcase of ${project.title}`}
                    className="w-full h-[120px] opacity-0 cursor-pointer transition-all duration-300"
                    style={{ objectFit: "cover" }}
                    onMouseEnter={() => {
                      if (window.innerWidth >= 768) {
                        handleProjectHover(index, true);
                      }
                    }}
                    onMouseLeave={() => {
                      if (window.innerWidth >= 768) {
                        handleProjectHover(index, false);
                      }
                    }}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        // md breakpoint
                        window.location.href = projects[index].url;
                      } else {
                        handleProjectClick(index);
                      }
                    }}
                  />
                </div>
              ))}
            </div>

            <div
              ref={navigationRef}
              className="w-1/3 flex flex-col items-end justify-end text-lg font-medium"
            >
              <p className="cursor-pointer hover:opacity-70 transition-all duration-300">
                <a
                  href="/services"
                  className="hover:font-black"
                  onMouseEnter={(e) => (e.target.style.fontWeight = "bold")}
                  onMouseLeave={(e) => (e.target.style.fontWeight = "normal")}
                >
                  SERVICES
                </a>
              </p>
              <p className="cursor-pointer hover:opacity-70 transition-all duration-300">
                <a
                  href="/about"
                  className="hover:font-black"
                  onMouseEnter={(e) => (e.target.style.fontWeight = "bold")}
                  onMouseLeave={(e) => (e.target.style.fontWeight = "normal")}
                >
                  ABOUT
                </a>
              </p>
              <p className="cursor-pointer hover:opacity-70 transition-all duration-300">
                <a
                  href="/contact"
                  className="hover:font-black"
                  onMouseEnter={(e) => (e.target.style.fontWeight = "bold")}
                  onMouseLeave={(e) => (e.target.style.fontWeight = "normal")}
                >
                  CONTACT
                </a>
              </p>
            </div>
          </div>

          {/* BOTTOM SECTION - MOBILE LAYOUT */}
          <div className="flex flex-col md:hidden w-full items-start gap-2 mt-4 flex-1 mb-4">
            <p ref={mobileIntroRef} className="text-sm">
              {introText}
            </p>

            <div className="flex flex-row-reverse items-end justify-between w-full mt-2">
              <div
                ref={mobileNavRef}
                className="w-full flex flex-col items-end text-md gap-1 font-medium"
              >
                <a href="/services">SERVICES</a>

                <a href="/about">ABOUT</a>

                <a href="/contact">CONTACT</a>
              </div>

              <div
                ref={mobileProjectsHeaderRef}
                className="font-extrabold flex gap-2 text-sm items-center"
              >
                <h3>LATEST PROJECTS</h3>
                <Image src={arrow2} alt="Down arrow" width={12} height={12} />
              </div>
            </div>

            <div
              ref={mobileProjectsContainerRef}
              className="w-full flex flex-col gap-2 flex-1 min-h-0"
            >
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="w-full flex-1 flex flex-col h-full"
                >
                  <Image
                    ref={(el) => {
                      imagesRef.current[index + 3] = el;
                    }}
                    src={project.images[0]}
                    alt={`Showcase of ${project.title}`}
                    className="w-full mb-2 transition-all duration-300 cursor-pointer opacity-0 flex-1 object-cover"
                    style={{
                      height: `${mobileImageHeight}px`,
                      minHeight: `${Math.max(80, mobileImageHeight)}px`,
                      maxHeight: `${mobileImageHeight}px`,
                    }}
                    onMouseEnter={() => {
                      if (window.innerWidth >= 768) {
                        handleProjectHover(index, true);
                      }
                    }}
                    onMouseLeave={() => {
                      if (window.innerWidth >= 768) {
                        handleProjectHover(index, false);
                      }
                    }}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        // md breakpoint
                        window.location.href = projects[index].url;
                      } else {
                        handleProjectClick(index);
                      }
                    }}
                  />
                  <div
                    className="flex items-center w-full flex-shrink-0"
                    ref={(el) => {
                      mobileProjectDetailsRef.current[index] = el;
                    }}
                  >
                    <span className="text-xs mr-4">{project.id}</span>
                    <div className="flex-grow h-[1px] bg-black"></div>
                    <span
                      className="text-xs ml-4 font-semibold cursor-pointer transition-all duration-200"
                      onMouseEnter={() => {
                        if (window.innerWidth >= 768) {
                          handleProjectHover(index, true);
                        }
                      }}
                      onMouseLeave={() => {
                        if (window.innerWidth >= 768) {
                          handleProjectHover(index, false);
                        }
                      }}
                      onClick={() => handleProjectClick(index)}
                    >
                      {project.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* OVERLAY */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-white z-50 opacity-0 flex-col hidden"
        style={{
          pointerEvents: isModalOpen ? "auto" : "none",
          display: isModalOpen ? "flex" : "none",
        }}
      >
        {/* Top bar */}
        <div className="flex justify-between w-full fixed items-start p-4 z-10">
          <div className="overlay-heading text-gray-400">
            <h1 className="text-2xl font-bold">KETER</h1>
            <h1 className="text-2xl font-bold">CREATIVE</h1>
          </div>
          <button
            type="button"
            className="overlay-logo flex flex-col items-center cursor-pointer z-20 bg-transparent border-none"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCloseModal();
            }}
            style={{ pointerEvents: "auto" }}
          >
            <Image src={logo} alt="Logo small" width={40} height={40} />
            <span className="text-sm mt-1">BACK</span>
          </button>
        </div>

        {/* Middle section */}
        <div className="flex flex-1 flex-col md:flex-row items-center justify-between gap-8 px-8 relative">
          {/* Left details */}
          <div className="overlay-details w-full md:w-[33vw] text-left mb-4 md:mb-0 font-bold flex flex-col justify-between h-full pr-24 z-10">
            {selectedProject !== null && (
              <>
                <div className="h-full "></div>
                <div className="h-full flex flex-col justify-end">
                  <p className="text-4xl text-[#BB885D]">
                    {projects[selectedProject].id}
                  </p>
                  <h2 className="text-6xl text-[#BB885D]">
                    {projects[selectedProject].title}
                  </h2>
                </div>
                <div className=" gap-4  h-full flex flex-col justify-end mb-12 ">
                  <p className="text-sm text-gray-500 break-words   ">
                    {projects[selectedProject].desc}
                  </p>
                  <div className="flex text-lg  w-full justify-between">
                    <p className="text-gray-500">SERVICES</p>
                    <p className="  ">{projects[selectedProject].services}</p>
                  </div>
                  <div className="flex w-full justify-between text-lg">
                    <p className="text-gray-500">TOOLS</p>
                    <p className=" ">{projects[selectedProject].tools}</p>
                  </div>{" "}
                </div>
              </>
            )}
          </div>

          {/* Center image container - Vertical Carousel */}
          <div className="w-full md:w-1/4 h-full flex items-center justify-center relative ">
            {selectedProject !== null && (
              <>
                <div
                  ref={modalImageRef}
                  className="absolute left-1/2 top-0 -translate-x-1/2 flex flex-col items-center will-change-transform"
                  style={{
                    height:
                      projects[selectedProject].images.length * (300 + 150),
                  }}
                >
                  {projects[selectedProject].images.map((image, idx) => (
                    <div
                      key={idx}
                      className="carousel-slide overflow-visible"
                      style={{
                        height: 400, // Fixed slide height
                        width: "600px",
                        flexShrink: 0,
                        marginBottom: 150, // Gap between slides
                        padding: "0 1rem",
                        boxSizing: "border-box",
                        opacity: idx === currentImageIndex ? 1 : 0.5,
                        transform: `scale(${
                          idx === currentImageIndex ? 1 : 0.85
                        })`,
                        transition: "opacity 0.3s, transform 0.3s",
                      }}
                    >
                      <Image
                        src={image}
                        alt={`Slide ${idx + 1}`}
                        className="w-full h-full object-cover overflow-visible"
                        width={0}
                        height={400}
                        priority={idx === currentImageIndex}
                      />
                    </div>
                  ))}
                </div>

                {/* Carousel controls */}
                {projects[selectedProject].images.length > 1 && (
                  <div className="overlay-carousel-controls absolute left-1/2 bottom-35 flex gap-4 -translate-x-1/2 cursor-pointer z-10">
                    <button
                      onClick={handleNextImage}
                      className="p-2  hover:bg-black/30 transition bg-white/20 backdrop-blur-sm"
                      aria-label="Next image"
                    >
                      <Image
                        src={boxarrow}
                        alt="Next"
                        className="w-8 h-8 -rotate-180"
                        width={32}
                        height={32}
                      />
                    </button>

                    {/* <div className="flex items-center px-3 py-2 rounded-md bg-white/20 backdrop-blur-sm text-sm">
                      <span>
                        {currentImageIndex + 1} /{" "}
                        {projects[selectedProject].images.length}
                      </span>
                    </div> */}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Ghost image container */}
          <div
            id="ghost-container"
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />

          {/* Right view site */}
          <div className="overlay-view w-full md:w-1/3  mt-4 flex md:mt-0 justify-end gap-4 h-full items-end mb-12">
            {selectedProject !== null && (
              <a
                href={projects[selectedProject].url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold hover:underline"
              >
                View Site
              </a>
            )}{" "}
            <Image
              src={sideArrow}
              alt="Next"
              className="w-8 h-8 "
              width={32}
              height={32}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
