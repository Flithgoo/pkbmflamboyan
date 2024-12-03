export default function getScrollAnimation() {
  console.log("coba");
  return {
    offscreen: {
      y: 140,
      opacity: 0,
    },
    onscreen: ({ duration = 1.8 } = {}) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration,
      },
    }),
  };
}
