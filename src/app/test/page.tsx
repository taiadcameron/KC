"use client";
import Image from "next/image";

import { useRouter } from "next/navigation";
import bg1 from "../../../public/bg1.svg";

export default function Services() {
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
      <div></div>
    </>
  );
}
