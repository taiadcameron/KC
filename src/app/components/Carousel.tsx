"use client";

import Image from "next/image";
import img1 from "../../public/Stack.png";
import img2 from "../../public/bird.jpg";

import logo from "../../public/kclgoo.svg";
import boxarrow from "../../public/box-arrow.svg";
import arrow2 from "../../public/downarrow.svg";
import { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

export default function Home() {
  const [mobileImageHeight, setMobileImageHeight] = useState(110);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projects = [
    { id: "01", title: "MORTON MARTIAL ARTS", images: [img1, img2] },
    { id: "02", title: "LOCH STOCH", images: [img1, img1] },
    { id: "03", title: "AMARILS", images: [img1, img1] },
  ];
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
  const modalRef = useRef<HTMLDivElement>(null);
  const modalImageRef = useRef<HTMLImageElement>(null);

  // New refs for smooth carousel
  const backgroundImageRef = useRef<HTMLImageElement>(null);
  const nextImageRef = useRef<HTMLImageElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  // Updated handleNextImage with smooth slide animation
  const handleNextImage = useCallback(() => {
    if (selectedProject === null) return;
    const images = projects[selectedProject].images;
    if (images.length <= 1) return;

    const nextIndex = (currentImageIndex + 1) % images.length;
    const currentImg = backgroundImageRef.current;
    const nextImg = nextImageRef.current;

    if (!currentImg || !nextImg) return;

    nextImg.src = images[nextIndex].src;

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentImageIndex(nextIndex);

        // After anim, set up top half-visible image (for infinite effect)
        gsap.set(currentImg, {
          y: "-25vh", // Half-offscreen, half-visible
          opacity: 1,
          scale: 0.95,
        });
        // Snap next image to center
        gsap.set(nextImg, { y: 0, scale: 1, opacity: 1 });

        // Prepare next pending image below for next transition
        const followingIdx = (nextIndex + 1) % images.length;
        nextImg.src = images[followingIdx].src;
        gsap.set(nextImg, {
          opacity: 0.7,
          y: 80,
          scale: 0.9,
          zIndex: 1,
        });
      },
    });

    // STEP 1: Animate center image upward to half-offscreen
    tl.to(
      currentImg,
      {
        y: "-25vh", // Instead of full fade, slides up, half remains visible
        scale: 0.95,
        zIndex: 2,
        duration: 0.9,
        ease: "power3.inOut",
      },
      0
    );

    // STEP 2: Animate bottom image slightly up, then snap to center
    tl.to(
      nextImg,
      {
        y: 10, // Gentle tease upward
        scale: 0.92,
        opacity: 1,
        duration: 0.3,
        ease: "power1.out",
      },
      0.15 // Start just after top begins to move
    ).to(
      nextImg,
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "power3.inOut",
      },
      ">" // Start after previous step finishes
    );
  }, [projects, selectedProject, currentImageIndex]);

  // Calculate mobile image height based on available space
  const calculateMobileImageHeight = useCallback(() => {
    if (typeof window !== "undefined") {
      const viewportHeight = window.innerHeight;

      // Get actual measurements from DOM elements
      const headerElement = headingRef.current?.parentElement?.parentElement;
      const introElement = mobileIntroRef.current;
      const navElement = mobileNavRef.current?.parentElement;
      const projectDetailsHeight = 30 * projects.length; // Project detail lines

      let usedHeight = 0;

      // Add padding
      usedHeight += 16; // p-2 = 8px top + 8px bottom

      // Add header height
      if (headerElement) {
        usedHeight += headerElement.getBoundingClientRect().height;
      } else {
        usedHeight += 200; // fallback
      }

      // Add intro text height
      if (introElement) {
        usedHeight += introElement.getBoundingClientRect().height;
      } else {
        usedHeight += 100; // fallback
      }

      // Add nav section height
      if (navElement) {
        usedHeight += navElement.getBoundingClientRect().height;
      } else {
        usedHeight += 120; // fallback
      }

      // Add project details height and gaps
      usedHeight += projectDetailsHeight;
      usedHeight += 16 * (projects.length + 2); // gaps

      const availableHeight = viewportHeight - usedHeight;
      const imageHeight = Math.max(
        80,
        Math.floor(availableHeight / projects.length)
      );

      setMobileImageHeight(imageHeight);
    }
  }, [projects.length]);

  // Handle project click
  const handleProjectClick = useCallback((index: number) => {
    setSelectedProject(index);
    setCurrentImageIndex(0);
    const rawEl = imagesRef.current[index];
    const imgEl = getImgEl(rawEl as HTMLImageElement);
    if (!imgEl || !overlayRef.current || !backgroundImageRef.current) return;

    setIsModalOpen(true);
    openImgRef.current = imgEl;

    const prevOverflow = document.body.style.overflow;
    (document.body as any).__prevOverflow = prevOverflow;
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

    // Calculate target dimensions (same as background image will be)
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

    // Set up both background images with the SAME dimensions
    const backgroundImg = backgroundImageRef.current;
    const nextImg = nextImageRef.current;

    backgroundImg.src = imgEl.currentSrc || imgEl.src;
    backgroundImg.style.opacity = "0";
    backgroundImg.style.width = `${targetW}px`;
    backgroundImg.style.height = `${targetH}px`;

    if (nextImg && projects[index].images.length > 1) {
      // Set up next image with the following image in sequence
      const nextImageIndex =
        (currentImageIndex + 1) % projects[index].images.length;
      nextImg.src = projects[index].images[nextImageIndex].src;
      nextImg.style.width = `${targetW}px`;
      nextImg.style.height = `${targetH}px`;
      gsap.set(nextImg, {
        opacity: 0.7,
        y: 80, // Fixed distance from center
        scale: 0.9,
      });
    } else if (nextImg) {
      gsap.set(nextImg, { opacity: 0 });
    }

    const overlay = overlayRef.current;
    overlay.style.display = "flex";
    overlay.style.pointerEvents = "auto";

    const ghostContainer = document.getElementById("ghost-container");
    if (ghostContainer) {
      ghostContainer.innerHTML = "";
      ghostContainer.appendChild(ghost);
    }

    imgEl.style.visibility = "hidden";

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
            // Seamless switch to background image
            backgroundImg.style.opacity = "1";
            if (ghost && ghost.parentNode) {
              ghost.parentNode.removeChild(ghost);
            }
            ghostRef.current = null;
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

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    const overlay = overlayRef.current;
    const backgroundImg = backgroundImageRef.current;
    const imgEl = openImgRef.current;
    if (!overlay || !imgEl) return;

    const rect = imgEl.getBoundingClientRect();

    // Create a new ghost image for the close animation
    const closeGhost = document.createElement("img");
    closeGhost.src = backgroundImg?.src || "";

    // Get current background image dimensions
    const currentWidth = backgroundImg?.offsetWidth || 0;
    const currentHeight = backgroundImg?.offsetHeight || 0;
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

    // Hide background image and show close ghost
    if (backgroundImg) backgroundImg.style.opacity = "0";

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
          const prevOverflow = (document.body as any).__prevOverflow || "";
          document.body.style.overflow = prevOverflow;
          setIsModalOpen(false);
          setSelectedProject(null);
        },
      })
      // First animate other elements out
      .to(".overlay-heading, .overlay-logo, .overlay-details, .overlay-view", {
        opacity: 0,
        y: -20,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.in",
      })
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
  }, []);

  // Update the resize handler to handle both images properly
  useEffect(() => {
    const handleResize = () => {
      calculateMobileImageHeight();

      if (!isModalOpen) return;

      const backgroundImg = backgroundImageRef.current;
      const nextImg = nextImageRef.current;
      const imgEl = openImgRef.current;

      if (!imgEl || !backgroundImg) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const ratio =
        imgEl.naturalWidth && imgEl.naturalHeight
          ? imgEl.naturalWidth / imgEl.naturalHeight
          : 1;

      const targetH = Math.min(vh * 0.5, 500);
      const targetW = Math.min(vw * 0.5, targetH * ratio);

      // Update both images size (they're already centered with CSS)
      backgroundImg.style.width = `${targetW}px`;
      backgroundImg.style.height = `${targetH}px`;

      if (nextImg) {
        nextImg.style.width = `${targetW}px`;
        nextImg.style.height = `${targetH}px`;
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
  }, [calculateMobileImageHeight, isModalOpen]);

  // Add interactive hover handlers for linking images and project text
  const handleProjectHover = useCallback(
    (index: number, isHovering: boolean) => {
      const desktopImage = imagesRef.current[index];
      const mobileImage = imagesRef.current[index + 3];
      const projectText = projectTextRefs.current[index];

      if (isHovering) {
        // Image effects
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
        // Text effect
        if (projectText) {
          gsap.to(projectText, {
            fontWeight: "bold",
            duration: 0.2,
            ease: "power2.out",
          });
        }
      } else {
        // Reset effects
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
        // Reset text
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
    // If Next.js gives a wrapper, find the inner <img>
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

  useEffect(() => {
    const handleResize = () => {
      // Recalculate mobile image height
      calculateMobileImageHeight();

      // Handle modal resize
      if (!isModalOpen) return;

      const ghost = ghostRef.current;
      const backgroundImg = backgroundImageRef.current;
      const nextImg = nextImageRef.current;
      const imgEl = openImgRef.current;

      if (!imgEl) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const ratio =
        imgEl.naturalWidth && imgEl.naturalHeight
          ? imgEl.naturalWidth / imgEl.naturalHeight
          : 1;

      const targetH = Math.min(vh * 0.5, 500);
      const targetW = Math.min(vw * 0.5, targetH * ratio);
      const finalLeft = (vw - targetW) / 2;
      const finalTop = (vh - targetH) / 2;

      // Update ghost image position if it exists and is visible
      if (ghost && ghost.style.opacity !== "0") {
        gsap.set(ghost, {
          left: finalLeft,
          top: finalTop,
          width: targetW,
          height: targetH,
        });
      }

      // Update background images size (they're already centered with CSS)
      if (backgroundImg) {
        backgroundImg.style.width = `${targetW}px`;
        backgroundImg.style.height = `${targetH}px`;
      }
      if (nextImg) {
        nextImg.style.width = `${targetW}px`;
        nextImg.style.height = `${targetH}px`;
      }
    };

    // Debounce resize handler
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
  }, [calculateMobileImageHeight, isModalOpen]);

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
      // 1. First: H1 headings with smooth 3D transform
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
      // 2. Second: Images with staggered reveal and blur removal
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
      // 3. Third: Projects section (header and list together but slight stagger)
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
      // 4. Fourth: Intro text with typewriter-like reveal
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
      // 5. Fifth: Navigation
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
      // Mobile elements animation
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
      // Mobile project details (numbers and lines)
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
      // CTA appears LAST after all other animations complete
      .to(
        ctaElement,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "+=0.2" // Small delay after all other animations complete
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
          <div className="flex  gap-4">
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

        {/* Middle section responsive */}
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

          {/* Carousel container with both images */}
          <div
            ref={carouselContainerRef}
            className="relative"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              position: "absolute",
            }}
          >
            {/* Main background image */}
            <Image
              ref={backgroundImageRef}
              alt="Modal background"
              className="object-cover rounded-lg max-h-[350px] max-w-[600px] w-auto h-auto"
              src={projects[selectedProject ?? 0].images[currentImageIndex]}
              width={0}
              height={0}
              priority
            />

            {/* Next image for smooth transitions - visible at bottom */}
            {selectedProject !== null &&
              projects[selectedProject].images.length > 1 && (
                <Image
                  ref={nextImageRef}
                  alt="Next image"
                  className="absolute top-100   rounded-lg"
                  src={
                    projects[selectedProject].images[
                      (currentImageIndex + 1) %
                        projects[selectedProject].images.length
                    ]
                  }
                  width={700}
                  height={500}
                  style={{
                    opacity: 0.7,
                    transform: "translateY(80px) scale(0.9)",
                  }}
                />
              )}
          </div>

          {/* Navigation arrow - positioned just below the main image */}
          {isModalOpen &&
            selectedProject !== null &&
            projects[selectedProject].images.length > 1 && (
              <div
                className="absolute z-20 cursor-pointer"
                style={{
                  left: "50%",
                  top: "70%",
                  transform: "translate(-50%, 40px)", // 40px below center
                }}
              >
                <Image
                  src={arrow2}
                  alt="Next Image"
                  width={32}
                  height={32}
                  onClick={handleNextImage}
                  className="hover:scale-110 transition-transform duration-300 filter hover:opacity-70"
                />
              </div>
            )}

          {/* Ghost image container */}
          <div id="ghost-container" className="relative" />

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
