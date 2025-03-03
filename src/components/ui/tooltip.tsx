import * as RadixTooltip from "@radix-ui/react-tooltip";

export const Tooltip = ({ children, content, ...props }) => (
  <RadixTooltip.Provider>
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Content
        side="left"
        align="center"
        className="bg-[hsl(var(--ae--primary-200))] text-black px-3 py-2 rounded-md shadow-lg w-[300px] text-center"
        sideOffset={5}
        {...props}
      >
        {content}
        <RadixTooltip.Arrow className="fill-[hsl(var(--ae--primary-200))]" />
      </RadixTooltip.Content>
    </RadixTooltip.Root>
  </RadixTooltip.Provider>
);
