import * as RadixTooltip from "@radix-ui/react-tooltip";

export const Tooltip = ({ children, content, width = "300px", ...props }) => (
  <RadixTooltip.Provider>
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Content
        side="top"
        align="center"
        className="bg-[hsl(var(--ae--primary-200))] text-black px-3 py-2 rounded-md shadow-lg text-center z-50"
        style={{ width }}
        sideOffset={5}
        {...props}
      >
        {content}
        <RadixTooltip.Arrow className="fill-[hsl(var(--ae--primary-200))] w-4 h-2.5" />
      </RadixTooltip.Content>
    </RadixTooltip.Root>
  </RadixTooltip.Provider>
);
