import { useEffect } from "react";

/**
 * Hook to conditionally render titles based on user preference
 * @param titleText The title text to render if enabled
 * @returns The title text if enabled, empty string if disabled
 */
export const useTitles = () => {
  const getTitle = (): string => {
    return "";
  };

  const removeTitleFromElement = (element: Element) => {
    const currentTitle = element.getAttribute("title");
    if (currentTitle) {
      element.setAttribute("data-original-title", currentTitle);
      element.removeAttribute("title");
    }
  };

  const disableTitles = () => {
    const rootElement = document.documentElement;
    const allElementsWithTitles = document.querySelectorAll("[title]");

    rootElement?.setAttribute("data-titles-disabled", "true");
    rootElement?.removeAttribute("data-titles-enabled");

    allElementsWithTitles.forEach((element) => {
      removeTitleFromElement(element);
    });
  };

  // Handle title visibility globally
  useEffect(() => {
    // Use setTimeout to ensure DOM is fully loaded
    const timeoutId = setTimeout(disableTitles, 100);

    // Set up mutation observer to handle dynamically added elements
    const observer = new MutationObserver((mutations) => {
      let hasTitleChanges = false;
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (
                element.hasAttribute("title") ||
                element.querySelector("[title]")
              ) {
                hasTitleChanges = true;
              }
            }
          });
        }
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "title"
        ) {
          hasTitleChanges = true;
        }
      });

      if (hasTitleChanges) {
        // Remove titles from any new or updated elements
        setTimeout(() => {
          const elementsWithTitles = document.querySelectorAll("[title]");
          elementsWithTitles.forEach((element) => {
            removeTitleFromElement(element);
          });
        }, 0);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["title"],
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return {
    getTitle,
    isTitlesEnabled: false,
  };
};
