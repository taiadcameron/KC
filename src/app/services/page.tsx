"use client";

import Image from "next/image";
import logo from "../../../public/kclgoo.svg";
import { useRouter } from "next/navigation";
import bg1 from "../../../public/bg1.svg";
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";

export default function Services() {
  const router = useRouter();

  // expanded background state
  const [expanded, setExpanded] = useState(false);

  // track which service is clicked
  const [activeService, setActiveService] = useState<"websites" | "seo" | null>(
    null
  );

  const handleServiceClick = (service: "websites" | "seo") => {
    setActiveService(service);
    setExpanded(true);
  };

  const handleClose = () => {
    setActiveService(null);
    setTimeout(() => {
      setExpanded(false);
    }, 1000); // timeout to ensure overlay fully exits
  };

  const mainContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.3,
        staggerDirection: -1,
      },
    },
  };

  const overlayContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.3,
        delayChildren: 1.0,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.3,
        staggerDirection: -1,
      },
    },
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -30,
      transition: { duration: 0.6, ease: "easeIn" },
    },
  };

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

      <div className="h-dvh overflow-clip flex flex-col">
        {/* ✅ Main content (fades away when expanded) */}
        <AnimatePresence>
          {!expanded && (
            <motion.div
              key="main-content"
              className="px-2 lg:px-8 pt-30 z-10 relative flex flex-col justify-between h-1/2"
              variants={mainContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div variants={childVariants}>
                <motion.h1
                  variants={childVariants}
                  className="mb-2 text-4xl md:text-6xl lg:text-8xl font-black"
                >
                  OUR <br />
                  SERVICES
                </motion.h1>

                <motion.p
                  variants={childVariants}
                  className="text-sm lg:text-base md:w-3/5 lg:w-1/2"
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi
                  totam corrupti hic ipsum similique quod voluptatibus at rem
                  laboriosam repellat!
                </motion.p>
              </motion.div>

              {/* Services - Mobile */}
              <motion.div
                variants={childVariants}
                className="block md:hidden mt-4"
              >
                <p className="text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing{" "}
                </p>
                <div className="w-full flex justify-between items-center gap-2">
                  <p
                    className="text-sm font-semibold cursor-pointer"
                    onClick={() => handleServiceClick("websites")}
                  >
                    WEBSITES
                  </p>
                  <div className="h-0.5 bg-black w-full"></div>
                  <p
                    className="text-sm font-semibold cursor-pointer"
                    onClick={() => handleServiceClick("seo")}
                  >
                    SEO
                  </p>
                </div>
              </motion.div>

              {/* Services - Desktop */}
              <motion.div
                variants={childVariants}
                className="hidden md:flex w-full  items-center gap-3 lg:gap-4 mt-4 h-fit "
              >
                <p className="text-sm lg:text-base whitespace-nowrap flex-shrink-0">
                  reiciendis! Modi optio voluptate totam. Officia quaerat,
                  laudantium dolore
                </p>

                <div className="h-1 bg-black flex-grow min-w-4"></div>

                <p
                  className="text-sm lg:text-base font-semibold cursor-pointer"
                  onClick={() => handleServiceClick("websites")}
                >
                  WEBSITES
                </p>

                <div className="h-1 bg-black lg:w-20 flex-shrink-0"></div>

                <p
                  className="text-sm lg:text-base font-semibold cursor-pointer"
                  onClick={() => handleServiceClick("seo")}
                >
                  SEO
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ✅ Background Image */}
        <motion.div
          key="background-image"
          className="px-2 w-full fixed bottom-0 left-0 right-0 m-auto z-0"
          initial={{ height: "48vh", width: "99%" }}
          animate={{ height: expanded ? "85vh" : "48vh", width: "99%" }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            delay: expanded ? 0.3 : 0,
          }}
        >
          <Image
            src={bg1}
            alt=""
            className="w-full h-full object-cover"
            fill
            priority
          />
        </motion.div>

        {/* ✅ Service Detail Overlay on top of image */}
        <AnimatePresence>
          {expanded && activeService && (
            <motion.div
              key={activeService}
              className="absolute inset-0 flex flex-col text-white pt-35 px-6 z-10 overflow-y-auto"
              variants={overlayContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ delay: 1.5 }}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-5 right-8 text-white text-lg cursor-pointer mt-32"
              >
                (Close)
              </button>

              {activeService === "websites" && (
                <>
                  <motion.h1
                    variants={childVariants}
                    className="text-4xl md:text-9xl font-bold mb-4"
                  >
                    WEBSITES
                  </motion.h1>
                  <motion.p
                    variants={childVariants}
                    className="text-base max-w-4xl"
                  >
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. At
                    mollitia alias, perspiciatis illo consequatur officiis
                    quaerat excepturi temporibus fugit eveniet incidunt rerum
                    nesciunt nostrum omnis harum culpa. Hic, dicta repellendus.
                    <br />
                    <br />
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Illo repellendus, assumenda minus consectetur eligendi quae,
                    porro fuga modi officia tempore quidem labore sapiente
                    commodi? Soluta, exercitationem? Adipisci debitis magni
                    voluptatem.
                  </motion.p>

                  <motion.div
                    variants={childVariants}
                    className="lg:max-w-2/5 mt-12"
                  >
                    <div className="grid grid-cols-2 grid-rows-2 gap-8">
                      <div className="flex flex-col gap-2">
                        <p>01</p>
                        <div className="bg-white h-0.5 w-1/4"></div>
                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Perspiciatis praesentium accusamus dolores totam
                          neque est aperiam, nesciunt saepe odit eos.
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <p>02</p>
                        <div className="bg-white h-0.5 w-1/4"></div>
                        <p>
                          Dolorum consequatur excepturi, sapiente ullam rerum
                          quasi deserunt a placeat dolore ipsa mollitia.
                        </p>
                      </div>

                      <div></div>

                      <div className="flex row-start-2 flex-col gap-2">
                        <p>03</p>
                        <div className="bg-white h-0.5 w-1/4"></div>
                        <p>
                          Architecto reiciendis perferendis delectus natus,
                          possimus beatae dignissimos provident laboriosam.
                        </p>
                      </div>
                      <div className="flex row-start-2 flex-col gap-2">
                        <p>04</p>
                        <div className="bg-white h-0.5 w-1/4"></div>
                        <p>
                          Architecto reiciendis perferendis delectus natus,
                          possimus beatae dignissimos provident laboriosam.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    variants={childVariants}
                    className="mt-8 border-y-2 w-fit px-12  flex justify-center  py-2"
                  >
                    <Link href="/contact" className="text-white text-xl  ">
                      GET IN TOUCH
                    </Link>
                  </motion.div>
                </>
              )}

              {activeService === "seo" && (
                <>
                  <motion.h1
                    variants={childVariants}
                    className="text-4xl md:text-9xl font-bold mb-4"
                  >
                    SEO
                  </motion.h1>
                  <motion.p
                    variants={childVariants}
                    className="text-base max-w-3xl"
                  >
                    Our SEO strategies help your business rank higher on Google,
                    drive traffic, and increase conversions. With keyword
                    research, technical optimization, and high-quality content,
                    we’ll ensure you stand out from your competition.
                    <br />
                    <br />
                    We focus on long-term growth and measurable results — making
                    sure your customers can actually find you when it matters.
                  </motion.p>

                  <motion.div
                    variants={childVariants}
                    className="w-full md:max-w-3xl mt-4 md:mt-12"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <p>01</p>
                        <div className="bg-white h-0.5 w-1/4"></div>
                        <p>
                          In-depth keyword research to refine your audience
                          targeting and drive relevant traffic.
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p>02</p>
                        <div className="bg-white h-0.5 w-1/4"></div>
                        <p>
                          On-page and technical SEO improvements to boost speed,
                          structure, and crawlability.
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p>03</p>
                        <div className="bg-white h-0.5 w-1/4"></div>
                        <p>
                          Backlink building and content strategies that move you
                          up in search rankings.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    variants={childVariants}
                    className="mt-8 border-y-2 w-full md:w-fit px-12  flex justify-center  py-2"
                  >
                    <Link href="/contact" className="text-white text-xl  ">
                      GET IN TOUCH
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
