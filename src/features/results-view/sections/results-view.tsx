import React, { useMemo } from "react";
import parse from "html-react-parser";
import { Tooltip } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

export const ResultsViewSection = ({
  images,
}: {
  images: undefined | (string | undefined)[];
}) => {
  const t = useTranslations();

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
      const tmp = images
        .filter((optImage) => optImage !== undefined)
        .map((svg) => svg.substring(svg.indexOf("<svg")))
        .map((svg) => {
          const match = svg.match(/plot-type="([^"]+)"/);
          const plotType = match ? match[1] : null;
          return {
            type: plotType,
            svg: parse(svg, parsingOptions),
          };
        });
      console.log(tmp);
      return tmp;
    }
    return [];
  }, [images]);

  const getCorrectTooltip = (plotType: string): string => {
    const tooltip: string = t(`common.tooltips.${plotType}`);
    if (tooltip === `common.tooltips.${plotType}`) {
      console.log("tooltip not found for type", plotType);
      return "";
    }
    return tooltip;
  };

  return (
    <div className="flex flex-1 p-4 bg-neutral-100 gap-4 rounded overflow-auto">
      <div className="flex flex-1 p-4 bg-neutral-100 gap-4 rounded overflow-auto">
        <div className="flex flex-wrap p-4 mx-auto">
          {imagesToShow.map((plot, index) => {
            if (getCorrectTooltip(plot.type) === "") {
              return <div className="w-full h-auto">{plot.svg}</div>;
            } else {
              return (
                <div key={index} className="w-full 2xl:w-1/2 p-2">
                  <Tooltip content={getCorrectTooltip(plot.type)} width="550px">
                    <div className="w-full h-auto">{plot.svg}</div>
                  </Tooltip>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};
