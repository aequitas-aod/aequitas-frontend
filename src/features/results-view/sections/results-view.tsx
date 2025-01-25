import React, { useMemo } from "react";
import parse from "html-react-parser";

export const ResultsViewSection = ({
  images,
}: {
  images: string[] | undefined;
}) => {
  const parsingOptions = {
    replace: (domNode) => {
      if (domNode.tagName === "svg") {
        domNode.attribs.class = "w-full h-auto";
      }
      return domNode;
    },
  };

  const imagesToShow = useMemo(() => {
    if (images && images.length > 0) {
      const parsedImages: string[] = images;
      return parsedImages
        .map((svg) => svg.substring(svg.indexOf("<svg")))
        .map((svg) => parse(svg, parsingOptions));
    }
    return [];
  }, [images]);

  return (
    <div className="flex flex-1 p-4 bg-neutral-100 gap-4 rounded overflow-auto">
      <div className="flex flex-1 p-4 bg-neutral-100 gap-4 rounded overflow-auto">
        <div className="flex flex-wrap p-4 mx-auto">
          {imagesToShow.map((svg, index) => (
            <div key={index} className="w-full 2xl:w-1/2 p-2">
              {svg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
