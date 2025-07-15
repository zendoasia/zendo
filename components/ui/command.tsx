"use client";

import React, { useEffect, useState, useContext, type ReactNode } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent as PrimitiveDialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Command = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
}) => {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <PrimitiveDialogContent className="overflow-hidden p-0 max-w-md">
        <Command className="app-font [&_[cmdk-group-heading]]:text-muted-foreground :data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </PrimitiveDialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref: React.ForwardedRef<HTMLInputElement>) => (
  <div className="flex items-center px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "app-font flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

// Add a context to track if any CommandItem is rendered
const CommandItemsRenderedContext = React.createContext<{
  rendered: boolean;
  setRendered: (_v: boolean) => void;
  loading?: boolean;
  error?: boolean;
} | null>(null);

function CommandItemsRenderedProvider({
  children,
  loading,
  error,
}: {
  children: ReactNode;
  loading?: boolean;
  error?: boolean;
}) {
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    setRendered(false);
  }, [children]);
  return (
    <CommandItemsRenderedContext.Provider value={{ rendered, setRendered, loading, error }}>
      {children}
    </CommandItemsRenderedContext.Provider>
  );
}

// Patch CommandItem to set context when rendered
const PatchedCommandItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>((props, ref: React.ForwardedRef<HTMLDivElement>) => {
  const ctx = useContext(CommandItemsRenderedContext);
  useEffect(() => {
    if (ctx && !ctx.rendered) ctx.setRendered(true);
  }, [ctx]);
  return <CommandPrimitive.Item ref={ref} {...props} />;
});
PatchedCommandItem.displayName = CommandPrimitive.Item.displayName;

// Custom CommandEmpty that only shows if no items rendered
const PatchedCommandEmpty = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref: React.ForwardedRef<HTMLDivElement>) => {
  const ctx = useContext(CommandItemsRenderedContext);
  if (ctx && (ctx.rendered || ctx.loading || ctx.error)) return null;
  return (
    <CommandPrimitive.Empty ref={ref} className="app-font py-6 text-center text-sm" {...props} />
  );
});
PatchedCommandEmpty.displayName = CommandPrimitive.Empty.displayName;

// Patch CommandList to wrap children in provider and reset rendered state on each render
const PatchedCommandList = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List> & {
    loading?: boolean;
    error?: boolean;
  }
>(({ children, loading, error, ...props }, ref: React.ForwardedRef<HTMLDivElement>) => {
  return (
    <CommandItemsRenderedProvider loading={loading} error={error}>
      <CommandPrimitive.List ref={ref} {...props}>
        {children}
      </CommandPrimitive.List>
    </CommandItemsRenderedProvider>
  );
});
PatchedCommandList.displayName = CommandPrimitive.List.displayName;

const CommandGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "app-font overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "app-font relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  PatchedCommandList as CommandList,
  PatchedCommandEmpty as CommandEmpty,
  CommandGroup,
  PatchedCommandItem as CommandItem,
  CommandShortcut,
  CommandSeparator,
};
