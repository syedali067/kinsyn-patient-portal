interface ScrollOptions {
  behavior?: 'smooth' | 'auto';
}

export const scrollToHash = (options?: ScrollOptions) => {
  const hash = window.location.hash;

  if (hash) {
    const targetId = hash.slice(1);
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView(options);
    }
  }
};
