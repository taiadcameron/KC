"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import sideArrow from "../../../public/Group 6.svg";
import img1 from "../../../public/bird.jpg";
import logo from "../../../public/kclgoo.svg";

import mma1 from "../../../public/ls/ls1.png";
import mma2 from "../../../public/ls/ls2.png";
import mma3 from "../../../public/ls/ls3.png";
import mma4 from "../../../public/ls/ls4.png";
import mma5 from "../../../public/ls/ls5.png";

import { useRouter } from "next/navigation";
import boxarrow from "../../../public/box-arrow.svg";

import { gsap } from "gsap";
export default function LochStock() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  // Refs for animation
  const projectNumberRef = useRef<HTMLParagraphElement>(null);
  const viewSiteRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const projectNumberElement = projectNumberRef.current;
    const viewSiteElement = viewSiteRef.current;
    const titleElement = titleRef.current;
    const descriptionElement = descriptionRef.current;
    const servicesElement = servicesRef.current;
    const toolsElement = toolsRef.current;

    // Initially hide all text content
    gsap.set(
      [
        projectNumberElement,
        viewSiteElement,
        titleElement,
        descriptionElement,
        servicesElement,
        toolsElement,
      ],
      {
        opacity: 0,
        y: 30,
      }
    );

    // Create animation timeline
    const tl = gsap.timeline();

    tl.to(projectNumberElement, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.5,
    })
      .to(
        viewSiteElement,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.5"
      )
      .to(
        titleElement,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
        },
        "-=0.3"
      )
      .to(
        descriptionElement,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.2"
      )
      .to(
        [servicesElement, toolsElement],
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.3"
      );
  }, []);

  return (
    <>
      {/* Fixed text overlay */}
      <div className="fixed w-full h-screen z-10  overflow-visible   flex flex-col  ">
        <div className="flex justify-between w-full items-start p-4 z-10 ">
          <div className="overlay-heading text-gray-400">
            <h1 className="text-2xl font-bold">KETER</h1>
            <h1 className="text-2xl font-bold">CREATIVE</h1>
          </div>
          <button
            type="button"
            className="overlay-logo flex flex-col items-center cursor-pointer z-20 bg-transparent border-none pointer-events-auto"
            onClick={() => router.push("/")}
          >
            <Image src={logo} alt="Logo small" width={40} height={40} />
            <span className="text-sm mt-1 ">BACK</span>
          </button>
        </div>

        <div className="p-4">
          <div className="flex w-full justify-between items-top">
            <div className="flex flex-col justify-between">
              <p
                ref={projectNumberRef}
                className="text-4xl text-[#BF814C] font-bold "
              >
                01
              </p>
              <div ref={viewSiteRef} className=" flex  gap-4">
                <a href="https://www.lochandstock.co.uk/">
                  {" "}
                  <p className="">VIEW SITE</p>{" "}
                </a>
                <Image
                  src={sideArrow}
                  alt="Next"
                  className="w-6 h-6 "
                  width={12}
                  height={12}
                />
              </div>
            </div>
            <div className="w-1/2">
              <h1 ref={titleRef} className="text-4xl font-bold text-[#BF814C] ">
                LOCH STOCK
              </h1>
            </div>
          </div>

          <p ref={descriptionRef} className="mt-4 break-words ">
            DFDMDMDKSDOSAKDFDMDMDKSDOSAKDFDMDMDKSDOSAKDFDMDMDKSDOSAKDFDMDMDKSDOSAKDFDJADFKDAFMDKFMSDFSDFS
          </p>

          <div className="w-full flex flex-col justify-between">
            <div ref={servicesRef} className="flex justify-between w-full mt-4">
              <p className="text-gray-600">Services</p>
              <p className="font-bold">Web Design</p>
            </div>
            <div ref={toolsRef} className="flex justify-between w-full">
              <p className="text-gray-600">Tools</p>
              <p className="font-bold">Figma / Framer</p>
            </div>
          </div>
        </div>
        <div className="font-bold w-full   flex justify-center flex-col items-center gap-2 mt-12">
          <p>SCROLL</p>{" "}
          <Image
            src={boxarrow}
            alt="Next"
            className="w-8 h-8 -rotate-180"
            width={32}
            height={32}
          />
        </div>
      </div>

      {/* Scrollable content with parallax images */}
      <div className="relative max-w-3xl m-auto">
        {/* Background for better contrast */}
        <div className="fixed "></div>

        {/* Parallax images container */}
        <div className="">
          {/* First image */}
          <div className="flex justify-center items-end min-h-screen ">
            <div className="p-2 overflow-hidden ">
              <Image
                src={mma1}
                alt="Bird"
                className="w-full h-full object-cover transition-transform duration-300 "
              />
            </div>
          </div>

          {/* Second image */}
          <div
            className="flex justify-center items-center min-h-screen p-2"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          >
            <div className="overflow-hidden ">
              <Image
                src={mma2}
                alt="Bird"
                className=" object-cover transition-transform duration-300 "
              />
            </div>
          </div>
          {/* Third image */}
          <div
            className="flex justify-center items-center min-h-screen p-2"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          >
            <div className="overflow-hidden ">
              <Image
                src={mma3}
                alt="Bird"
                className=" object-cover transition-transform duration-300 "
              />
            </div>
          </div>
          {/* 4 image */}
          <div
            className="flex justify-center items-center min-h-screen p-2"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          >
            <div className="overflow-hidden ">
              <Image
                src={mma4}
                alt="Bird"
                className=" object-cover transition-transform duration-300 "
              />
            </div>
          </div>
          {/* 5 image */}
          <div
            className="flex justify-center items-center min-h-screen p-2"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          >
            <div className="overflow-hidden ">
              <Image
                src={mma5}
                alt="Bird"
                className=" object-cover transition-transform duration-300 "
              />
            </div>
          </div>

          {/* Additional spacing for smooth scrolling */}
          <div className="h-screen"></div>
        </div>
      </div>
    </>
  );
}
