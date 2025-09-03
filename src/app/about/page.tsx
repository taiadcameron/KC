"use client";
import Image from "next/image";
import logo from "../../../public/kclgoo.svg";
import { useRouter } from "next/navigation";
import bg1 from "../../../public/bg1.svg";

const About = () => {
  const router = useRouter();

  return (
    <>
      {/* Top bar */}
      <div className="flex justify-between fixed w-full items-start p-2 lg:p-8 z-10">
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

      <div className="w-full px-2 lg:px-8 flex pt-24 lg:pt-30 justify-between h-screen pb-12">
        <div className="w-full flex-col h-full flex">
          <div className="flex flex-col justify-between">
            <h1 className="mb-2 text-4xl md:text-6xl lg:text-9xl font-black">
              ABOUT US
            </h1>

            <p className="text-sm lg:text-base md:w-3/5 lg:w-1/2">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi
              totam corrupti hic ipsum similique quod voluptatibus at rem
              laboriosam repellat! Temporibus magnam vero, dolorem harum ut vel
              repellat delectus soluta. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Ea perspiciatis quisquam quae consectetur
              reiciendis! Modi optio voluptate totam. Officia quaerat,
              laudantium dolore aliquam ea incidunt sunt architecto provident
              dicta adipisci!
              <br />
              <br />
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed
              perspiciatis sunt, explicabo inventore ipsum alias ipsam
              dignissimos. Fugiat, maiores molestias! Odit aperiam sint
              voluptatum doloremque quod, dolores tempora assumenda velit.
            </p>
          </div>

          <div className="flex lg:mt-12 mt-4 flex-col lg:flex-row">
            <div className="flex flex-col w-full lg:w-1/2 font-bold h-full justify-start gap-8 lg:gap-12">
              <div className="flex justify-between">
                <p className="text-gray-500 w-full">LOCATION</p>
                <div className="flex flex-col w-full text-right lg:text-left">
                  <p>LONDON</p>
                </div>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500 w-full">CONTACT</p>
                <div className="text-right lg:text-left flex w-full flex-col">
                  <p>X</p>
                  <p>FACEBOOK</p>
                  <p>EMAIL</p>
                </div>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500 w-full">TECHNOLOGIES</p>
                <div className="flex text-right lg:text-left w-full flex-col">
                  <p>HTML</p>
                  <p>CSS</p>
                  <p>JAVASCRIPT</p>
                  <p>MONGODB</p>
                  <p>FRAMER</p>
                </div>
              </div>
            </div>

            {/* Image container - full width on mobile/tablet, constrained on desktop */}
            <div className="h-full flex justify-end items-end mt-2 w-full lg:w-1/2">
              {/* Mobile/Tablet: Full width image */}
              <div className="w-full lg:hidden">
                <Image
                  src={bg1}
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto object-cover"
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                />
              </div>

              {/* Desktop: Original constrained image */}
              <div className="hidden lg:block">
                <Image
                  src={bg1}
                  alt=""
                  width={0}
                  height={0}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
