export default function getScrollAnimation() {
  return {
    offscreen: {
      y: 140,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 2,
      },
    },
  };
}
