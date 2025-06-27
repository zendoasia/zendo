"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { isIOS } from "@/lib/utils";
import { Share, Plus, Home, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IOSInstallDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function IOSInstallDialog({ open, onOpenChangeAction }: IOSInstallDialogProps) {
  const deviceType = isIOS() ? "iOS" : "macOS";
  const isPhone = isIOS();

  const steps = isPhone
    ? [
        {
          icon: <Share size="1.2rem" className="text-blue-600" />,
          title: "Tap the Share button",
          description: "Look for the share icon at the bottom of Safari",
        },
        {
          icon: <Plus size="1.2rem" className="text-blue-600" />,
          title: 'Select "Add to Home Screen"',
          description: "Scroll down in the share menu and tap this option",
        },
        {
          icon: <Home size="1.2rem" className="text-blue-600" />,
          title: "Confirm installation",
          description: "Tap 'Add' to install Zendo on your home screen",
        },
      ]
    : [
        {
          icon: <Share size="1.2rem" className="text-blue-600" />,
          title: "Click the Share button",
          description: "Look for the share icon in Safari's toolbar",
        },
        {
          icon: <Download size="1.2rem" className="text-blue-600" />,
          title: 'Select "Add to Dock"',
          description: "Choose this option from the share menu",
        },
        {
          icon: <Home size="1.2rem" className="text-blue-600" />,
          title: "Confirm installation",
          description: 'Click "Add" to install Zendo in your Dock',
        },
      ];

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Download size="1.2rem" className="text-blue-600 dark:text-blue-400" />
            </div>
            Install Zendo on {deviceType}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Follow these steps to install Zendo as an app on your{" "}
            {isPhone ? "iPhone or iPad" : "Mac"}:
          </p>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {step.icon}
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{step.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">!</span>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">Pro Tip</p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Once installed, Zendo will work offline and feel like a native app with faster
                  loading times!
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              size="sm"
              onClick={() => onOpenChangeAction(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Got it!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
