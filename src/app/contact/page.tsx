"use client";

import Image from "next/image";
import logo from "../../../public/kclgoo.svg";
import { useRouter } from "next/navigation";
import Cal from "@calcom/embed-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Contact() {
  const router = useRouter();

  // Refs for animation
  const headingRef = useRef<HTMLHeadingElement>(null);
  const socialLinksRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headingElement = headingRef.current;
    const socialLinksElement = socialLinksRef.current;
    const calendarElement = calendarRef.current;

    // Initially hide all content
    gsap.set([headingElement, socialLinksElement, calendarElement], {
      opacity: 0,
      y: 60,
      rotationX: -15,
    });

    // Create animation timeline
    const tl = gsap.timeline();

    tl.to(headingElement, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.5,
    })
      .to(
        socialLinksElement,
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.3"
      )
      .to(
        calendarElement,
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.7,
          ease: "power2.out",
        },
        "-=0.2"
      );
  }, []);

  return (
    <>
      {/* ✅ Top bar always visible */}
      <div className="flex justify-between fixed w-full items-start p-2 lg:p-8 z-20">
        <div className="overlay-heading text-gray-400">
          <h1 className="text-2xl font-bold">KETER</h1>
          <h1 className="text-2xl font-bold">CREATIVE</h1>
        </div>
        <button
          type="button"
          className="overlay-logo flex flex-col items-center cursor-pointer z-20 bg-transparent border-none"
          onClick={() => router.push("/")}
        >
          <Image src={logo} alt="Logo small" width={40} height={40} />
          <span className="text-sm mt-1">BACK</span>
        </button>
      </div>
      <div className="flex w-full h-dvh pt-20 md:pt-30 p-2 md:px-8 ">
        <div className="w-full flex flex-col ">
          <h1
            ref={headingRef}
            className="text-5xl text-center mb-4 md:text-8xl font-extrabold"
          >
            BOOK A CALL
          </h1>
          <div
            ref={socialLinksRef}
            className="font-black flex justify-center mb-4 md:gap-24"
          >
            <div className="flex text-right md:text-left gap-4">
              <p>EMAIL</p>
              <p>FACEBOOK</p>
              <p>INSTAGRAM</p>
              <p>X</p>
            </div>
          </div>
          <div ref={calendarRef} className="">
            <Cal
              className=""
              calLink="ketercreative/15min"
              config={{ theme: "dark", layout: "month_view" }}
            ></Cal>
          </div>
        </div>
      </div>
    </>
  );
}
