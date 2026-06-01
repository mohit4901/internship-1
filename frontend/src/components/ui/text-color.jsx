"use client";

import React from "react";

export function TextColor() {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="mb-10 mt-4 md:mt-6 w-full max-w-7xl px-2">
        <div className="relative p-8 w-full h-full flex justify-center items-center [mask-image:radial-gradient(200rem_24rem_at_center,white,transparent)]">
          <h1 className="tracking-tighter flex select-none px-3 py-2 flex-col lg:flex-row justify-center items-center text-center text-7xl font-extrabold leading-none sm:text-8xl">
            <span
              data-content="Learn."
              className="before:animate-gradient-background-1 relative before:absolute before:bottom-4 before:left-0 before:top-0 before:z-0 before:w-full before:px-2 before:content-[attr(data-content)] sm:before:top-0"
            >
              <span className="from-gradient-1-start to-gradient-1-end animate-gradient-foreground-1 bg-gradient-to-r bg-clip-text px-2 text-transparent sm:px-5">
                Learn.
              </span>
            </span>
            <span
              data-content="Test."
              className="before:animate-gradient-background-2 relative before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:w-full before:px-2 before:content-[attr(data-content)] sm:before:top-0"
            >
              <span className="from-gradient-2-start to-gradient-2-end animate-gradient-foreground-2 bg-gradient-to-r bg-clip-text px-2 text-transparent sm:px-5">
                Test.
              </span>
            </span>
            <span
              data-content="Analyse."
              className="before:animate-gradient-background-3 relative before:absolute before:bottom-1 before:left-0 before:top-0 before:z-0 before:w-full before:px-2 before:content-[attr(data-content)] sm:before:top-0"
            >
              <span className="from-gradient-3-start to-gradient-3-end animate-gradient-foreground-3 bg-gradient-to-r bg-clip-text px-2 text-transparent sm:px-5">
                Analyse.
              </span>
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
}
