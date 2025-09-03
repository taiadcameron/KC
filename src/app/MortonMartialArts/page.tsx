"use client";

import { useState, useEffect } from "react";

import Image from "next/image";
// Mock components since we don't have Next.js Image
import sideArrow from "../../../public/Group 6.svg";
import img1 from "../../../public/bird.jpg";
import logo from "../../../public/kclgoo.svg";
import { useRouter } from "next/navigation";

export default function MortonMartialArts() {
  const router = useRouter();

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
            <div>
              <p className="text-4xl font-bold ">01</p>
              <div className=" flex  gap-4">
                <p className="">VIEW SITE</p>{" "}
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
              <h1 className="text-4xl font-bold ">MORTON MARTIAL ARTS</h1>
            </div>
          </div>

          <p className="mt-4 break-words ">
            DFDMDMDKSDOSAKDFDMDMDKSDOSAKDFDMDMDKSDOSAKDFDMDMDKSDOSAKDFDMDMDKSDOSAKDFDJADFKDAFMDKFMSDFSDFS
          </p>

          <div className="w-full flex flex-col justify-between">
            <div className="flex justify-between w-full mt-4">
              <p className="text-gray-600">Services</p>
              <p className="font-bold">Web Design / SEO</p>
            </div>
            <div className="flex justify-between w-full">
              <p className="text-gray-600">Tools</p>
              <p className="font-bold">Figma / Framer</p>
            </div>
          </div>
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
                src={img1}
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
                src={img1}
                alt="Bird"
                className=" object-cover transition-transform duration-300 "
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
                src={img1}
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
