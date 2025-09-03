"use client";

import Image from "next/image";
import img1 from "../../../public/Stack.png";
import img2 from "../../../public/bird.jpg";

import logo from "../../../public/kclgoo.svg";
import boxarrow from "../../../public/box-arrow.svg";
import arrow2 from "../../../public/downarrow.svg";
import { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

// Vertical Carousel Component (from first page)
const VerticalCarousel = ({ images }) => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const VisibleSlides = 3;
  const fixedSlideHeight = 250;
  const gapHeight = 150;

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const totalStep = fixedSlideHeight + gapHeight;
    const yOffset =
      -currentIndex * totalStep + window.innerHeight / 2 - fixedSlideHeight / 2;

    gsap.to(container, {
      y: yOffset,
      duration: 0.6,
      ease: "power2.inOut",
    });

    const handleResize = () => {
      const newYOffset =
        -currentIndex * totalStep +
        window.innerHeight / 2 -
        fixedSlideHeight / 2;

      gsap.to(container, {
        y: newYOffset,
        duration: 0.3,
        ease: "power2.inOut",
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div
        ref={containerRef}
        className="absolute left-1/2 top-0 -translate-x-1/2 flex flex-col items-center will-change-transform"
        style={{
          height: images.length * (fixedSlideHeight + gapHeight),
        }}
      >
        {images.map((src, idx) => (
          <div
            key={idx}
            style={{
              height: fixedSlideHeight,
              width: "500px",
              flexShrink: 0,
              marginBottom: gapHeight,
              padding: "0 1rem",
              boxSizing: "border-box",
              opacity: idx === currentIndex ? 1 : 0.5,
              scale: idx === currentIndex ? 1 : 0.85,
              transition: "opacity 0.3s, transform 0.3s",
            }}
          >
            <img
              src={typeof src === "string" ? src : src.src}
              alt={`slide-${idx}`}
              className="w-full h-full object-cover rounded-md"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute left-1/2 bottom-[20%] flex gap-4 -translate-x-1/2 cursor-pointer z-10">
        <button
          onClick={nextSlide}
          aria-label="Next"
          className="p-2 rounded-md hover:bg-black/30 transition"
        >
          <Image
            src={boxarrow}
            alt="Next"
            className="w-8 h-8 rotate-180"
            width={32}
            height={32}
            draggable={false}
          />
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [mobileImageHeight, setMobileImageHeight] = useState(110);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projects = [
    {
      id: "01",
      title: "MORTON MARTIAL ARTS",
      images: [img1, img2],
      url: "#",
    },
    {
      id: "02",
      title: "LOCH STOCH",
      images: [img1, img1],
      url: "#",
    },
    {
      id: "03",
      title: "AMARILS",
      images: [img1, img1],
      url: "#",
    },
  ];

  const introText = `Based in London, we are a design and SEO agency that believes a great website is built with intention. We partner with businesses to create considered online experiences that not only look exceptional but perform flawlessly. Our focus is on merging thoughtful design with strategic SEO to ensure you connect meaningfully with your audience and achieve your goals.`;

  const overlayRef = useRef(null);
  const ghostRef = useRef(null);
  const openImgRef = useRef(null);
  const logoRef = useRef(null);
  const logoContainerRef = useRef(null);
  const headingRef = useRef(null);
  const imagesRef = useRef(new Array(6).fill(null));
  const projectTextRefs = useRef(new Array(3).fill(null));
  const mobileProjectsContainerRef = useRef(null);
  const mainContentRef = useRef(null);
  const modalRef = useRef(null);
  const modalImageRef = useRef(null);

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

  // Handle project click (using second page's improved animation)
  const handleProjectClick = useCallback((index) => {
    setSelectedProject(index);
    const rawEl = imagesRef.current[index] || imagesRef.current[index + 3];
    const imgEl = getImgEl(rawEl);
    if (!imgEl || !overlayRef.current) return;

    setIsModalOpen(true);
    openImgRef.current = imgEl;

    const prevOverflow = document.body.style.overflow;
    document.body.__prevOverflow = prevOverflow;
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

    const overlay = overlayRef.current;
    overlay.style.display = "flex";
    overlay.style.pointerEvents = "auto";

    const ghostContainer = document.getElementById("ghost-container");
    if (ghostContainer) {
      ghostContainer.innerHTML = "";
      ghostContainer.appendChild(ghost);
    }

    imgEl.style.visibility = "hidden";

    // Calculate target dimensions for modal image (similar to second page approach)
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const ratio =
      imgEl.naturalWidth && imgEl.naturalHeight
        ? imgEl.naturalWidth / imgEl.naturalHeight
        : rect.width / rect.height;

    const targetH = Math.min(vh * 0.5, 500);
    const targetW = Math.min(vw * 0.5, targetH * ratio);
    const finalLeft = (vw - targetW) / 2;
    const finalTop = (vh - targetH) / 2;

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
            // Keep ghost visible for a moment to ensure smooth handoff to carousel
            setTimeout(() => {
              if (ghost && ghost.parentNode) {
                ghost.parentNode.removeChild(ghost);
              }
              ghostRef.current = null;
            }, 100);
          },
        },
        "<"
      )
      .fromTo(
        ".overlay-heading, .overlay-logo, .overlay-details, .overlay-view",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.4"
      );
  }, []);

  // Handle modal close (using second page's approach)
  const handleCloseModal = useCallback(() => {
    const overlay = overlayRef.current;
    const imgEl = openImgRef.current;
    if (!overlay || !imgEl) return;

    const rect = imgEl.getBoundingClientRect();

    // Create a new ghost image for the close animation
    const closeGhost = document.createElement("img");
    closeGhost.src = imgEl.currentSrc || imgEl.src;

    // Get current modal area dimensions
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const ratio =
      imgEl.naturalWidth && imgEl.naturalHeight
        ? imgEl.naturalWidth / imgEl.naturalHeight
        : 1;

    const currentH = Math.min(vh * 0.5, 500);
    const currentW = Math.min(vw * 0.5, currentH * ratio);
    const currentLeft = (vw - currentW) / 2;
    const currentTop = (vh - currentH) / 2;

    Object.assign(closeGhost.style, {
      position: "fixed",
      left: currentLeft + "px",
      top: currentTop + "px",
      width: currentW + "px",
      height: currentH + "px",
      objectFit: "cover",
      zIndex: "101",
      borderRadius: "8px",
    });

    const ghostContainer = document.getElementById("ghost-container");
    if (ghostContainer) {
      ghostContainer.innerHTML = "";
      ghostContainer.appendChild(closeGhost);
    }

    gsap
      .timeline({
        onComplete: () => {
          imgEl.style.visibility = "visible";
          overlay.style.opacity = "0";
          overlay.style.display = "none";
          overlay.style.pointerEvents = "none";

          if (closeGhost && closeGhost.parentNode) {
            closeGhost.parentNode.removeChild(closeGhost);
          }
          openImgRef.current = null;

          const prevOverflow = document.body.__prevOverflow || "";
          document.body.style.overflow = prevOverflow;
          setIsModalOpen(false);
          setSelectedProject(null);
        },
      })
      .to(".overlay-heading, .overlay-logo, .overlay-details, .overlay-view", {
        opacity: 0,
        y: -20,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.in",
      })
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
      .to(
        overlay,
        {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        },
        "-=0.1"
      );
  }, []);

  // Add interactive hover handlers for linking images and project text
  const handleProjectHover = useCallback((index, isHovering) => {
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
          filter: "grayscale(100%)",
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
  }, []);

  const getImgEl = (el) => {
    if (!el) return null;
    if (el.tagName?.toLowerCase() === "img") return el;
    const inner = el?.querySelector?.("img");
    return inner || el;
  };

  const projectsHeaderRef = useRef(null);
  const projectsListRef = useRef(null);
  const introTextRef = useRef(null);
  const navigationRef = useRef(null);
  const ctaRef = useRef(null);
  const mobileIntroRef = useRef(null);
  const mobileNavRef = useRef(null);
  const mobileProjectsHeaderRef = useRef(null);
  const mobileProjectDetailsRef = useRef(new Array(3).fill(null));

  useEffect(() => {
    const handleResize = () => {
      calculateMobileImageHeight();
    };

    let resizeTimeout;
    const debouncedHandleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
      clearTimeout(resizeTimeout);
    };
  }, [calculateMobileImageHeight, isModalOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isModalOpen) {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, handleCloseModal]);

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

    // Initially hide all content with different starting positions for smoother animations
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

    // Get the final position of the logo container in the layout
    let finalX = 0;
    let finalY = 0;
    if (logoContainer) {
      const containerRect = logoContainer.getBoundingClientRect();
      finalX = containerRect.left;
      finalY = containerRect.top;
    }

    // Set initial state: center of viewport, absolute positioning
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

    // Create a GSAP timeline with modern easing
    const tl = gsap.timeline({
      onComplete: () => {
        // Restore logo to flex layout
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

    // Logo animation: modern fade in with subtle breathing effect
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
      // Rest of the animation timeline...
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
        "+=0.2"
      );

    // Add subtle hover animations for better interactivity
    if (navigationElement) {
      const navItems = navigationElement.querySelectorAll("p");
      navItems.forEach((item) => {
        item.addEventListener("mouseenter", () => {
          gsap.to(item, {
            y: -3,
            duration: 0.3,
            ease: "power2.out",
          });
        });
        item.addEventListener("mouseleave", () => {
          gsap.to(item, {
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });
    }

    if (ctaElement) {
      ctaElement.addEventListener("mouseenter", () => {
        gsap.to(ctaElement, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        });
      });
      ctaElement.addEventListener("mouseleave", () => {
        gsap.to(ctaElement, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    }
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Main Content */}
      <main
        ref={mainContentRef}
        className="flex flex-col justify-between min-h-screen p-2 md:p-4 text-black"
      >
        {/* TOP SECTION: Header with Logo and CTA */}
        <div className="flex flex-row justify-between">
          {/* Logo and Headings Container */}
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
          {/* Work With Us CTA */}
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
              <p>WORK WITH US</p>
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
                      onMouseEnter={() => handleProjectHover(index, true)}
                      onMouseLeave={() => handleProjectHover(index, false)}
                      onClick={() => handleProjectClick(index)}
                    >
                      {project.title}
                    </p>
                  ))}
                </div>
              </div>
              <div className="mr-16">
                <p ref={introTextRef}>{introText}</p>
              </div>
            </div>

            <div className="w-1/3 flex flex-col justify-end gap-4">
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
                    onMouseEnter={() => handleProjectHover(index, true)}
                    onMouseLeave={() => handleProjectHover(index, false)}
                    onClick={() => handleProjectClick(index)}
                  />
                </div>
              ))}
            </div>

            <div
              ref={navigationRef}
              className="w-1/3 flex flex-col items-end justify-end text-lg font-medium"
            >
              <p className="cursor-pointer hover:opacity-70 transition-all duration-300">
                SERVICES
              </p>
              <p className="cursor-pointer hover:opacity-70 transition-all duration-300">
                ABOUT
              </p>
              <p className="cursor-pointer hover:opacity-70 transition-all duration-300">
                CONTACT
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
                <p className="cursor-pointer transition-all duration-300">
                  SERVICES
                </p>
                <p className="cursor-pointer transition-all duration-300">
                  ABOUT
                </p>
                <p className="cursor-pointer transition-all duration-300">
                  CONTACT
                </p>
              </div>

              <div
                ref={mobileProjectsHeaderRef}
                className="font-extrabold flex gap-2 text-sm items-center"
              >
                <h3>LATEST PROJECTS</h3>
                <Image src={arrow2} alt="Down arrow" width={0} height={0} />
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
                    ref={(el) => (imagesRef.current[index + 3] = el)}
                    src={project.images[0]}
                    alt={`Showcase of ${project.title}`}
                    className="w-full mb-2 transition-all duration-300 cursor-pointer opacity-0 flex-1 object-cover"
                    style={{
                      height: `${mobileImageHeight}px`,
                      minHeight: `${Math.max(80, mobileImageHeight)}px`,
                      maxHeight: `${mobileImageHeight}px`,
                    }}
                    onMouseEnter={() => handleProjectHover(index, true)}
                    onMouseLeave={() => handleProjectHover(index, false)}
                    onClick={() => handleProjectClick(index)}
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
                      onMouseEnter={() => handleProjectHover(index, true)}
                      onMouseLeave={() => handleProjectHover(index, false)}
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
          {/* Back button with explicit event handling */}
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

        {/* Middle section with carousel */}
        <div className="flex flex-1 flex-col md:flex-row items-center justify-between gap-8 px-8 relative">
          {/* Left details */}
          <div className="overlay-details w-full md:w-1/4 text-left mb-4 md:mb-0">
            {selectedProject !== null && (
              <>
                <h2 className="text-lg font-semibold">
                  {projects[selectedProject].title}
                </h2>
                <p className="text-sm text-gray-500">
                  ID: {projects[selectedProject].id}
                </p>
              </>
            )}
          </div>

          {/* Center carousel */}
          <div className="w-full md:w-1/2 h-full flex items-center justify-center">
            {selectedProject !== null && (
              <VerticalCarousel images={projects[selectedProject].images} />
            )}
          </div>

          {/* Ghost image container */}
          <div
            id="ghost-container"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          />

          {/* Right view site */}
          <div className="overlay-view w-full md:w-1/4 text-right mt-4 md:mt-0">
            {selectedProject !== null && (
              <a
                href={projects[selectedProject].url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold hover:underline"
              >
                View Site
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
