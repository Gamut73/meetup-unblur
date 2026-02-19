function removeBlur(root = document) {
  const blurred = root.querySelectorAll('.blur-sm, [class*="blur-"]');
  blurred.forEach((element) => {
    [...element.classList]
      .filter((klass) => klass.includes("blur-"))
      .forEach((klass) => element.classList.remove(klass));

    if (element.style.filter) {
      element.style.filter = "none";
    }
  });
}

removeBlur();

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList && [...node.classList].some((c) => c.includes("blur-"))) {
            removeBlur(node.parentElement || document);
          }
          removeBlur(node);
        }
      });
    }

    if (
      mutation.type === "attributes" &&
      mutation.attributeName === "class" &&
      mutation.target.classList
    ) {
      const hasBlur = [...mutation.target.classList].some((c) =>
        c.includes("blur-")
      );
      if (hasBlur) {
        removeBlur(mutation.target.parentElement || document);
      }
    }
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["class"],
});
