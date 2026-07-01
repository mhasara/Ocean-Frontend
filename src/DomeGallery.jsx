import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGesture } from "@use-gesture/react";
import "./DomeGallery.css";

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=900&q=85",
];

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const wrapAngleSigned = deg => {
  const angle = (((deg + 180) % 360) + 360) % 360;
  return angle - 180;
};

function buildItems(pool, segments) {
  const xCols = Array.from({ length: segments }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];
  const normalizedImages = pool.map(image => {
    if (typeof image === "string") return { src: image, alt: "" };
    return { src: image.src || "", alt: image.alt || "" };
  });

  return xCols.flatMap((x, column) => {
    const ys = column % 2 === 0 ? evenYs : oddYs;
    return ys.map((y, row) => {
      const image = normalizedImages[(column * ys.length + row) % normalizedImages.length] || { src: "", alt: "" };
      return {
        x,
        y,
        sizeX: 2,
        sizeY: 2,
        src: image.src,
        alt: image.alt,
      };
    });
  });
}

export default function DomeGallery({
  images = DEFAULT_IMAGES,
  fit = 0.5,
  fitBasis = "auto",
  minRadius = 560,
  maxRadius = Infinity,
  padFactor = 0.25,
  overlayBlurColor = "#000000",
  maxVerticalRotationDeg = 5,
  dragSensitivity = 20,
  segments = 35,
  dragDampening = 0.82,
  imageBorderRadius = "18px",
  openedImageBorderRadius = "24px",
  grayscale = false,
}) {
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const sphereRef = useRef(null);
  const inertiaRef = useRef(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotationRef = useRef({ x: 0, y: 0 });
  const [openedImage, setOpenedImage] = useState(null);

  const items = useMemo(() => buildItems(images, segments), [images, segments]);

  const applyTransform = useCallback((xDeg, yDeg) => {
    if (!sphereRef.current) return;
    sphereRef.current.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
  }, []);

  const stopInertia = useCallback(() => {
    if (inertiaRef.current) {
      cancelAnimationFrame(inertiaRef.current);
      inertiaRef.current = null;
    }
  }, []);

  const startInertia = useCallback(
    (vx, vy) => {
      let speedX = clamp(vx, -1.4, 1.4) * 80;
      let speedY = clamp(vy, -1.4, 1.4) * 80;
      const damping = clamp(dragDampening ?? 2, 0, 5);
      const friction = 0.9 + damping * 0.018;
      const stopThreshold = 0.015 - Math.min(damping, 1) * 0.01;
      const maxFrames = Math.round(90 + damping * 54);
      let frames = 0;

      const step = () => {
        speedX *= friction;
        speedY *= friction;
        if ((Math.abs(speedX) < stopThreshold && Math.abs(speedY) < stopThreshold) || frames > maxFrames) {
          inertiaRef.current = null;
          return;
        }
        frames += 1;

        const nextX = clamp(rotationRef.current.x - speedY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg);
        const nextY = wrapAngleSigned(rotationRef.current.y + speedX / 200);
        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
        inertiaRef.current = requestAnimationFrame(step);
      };

      stopInertia();
      inertiaRef.current = requestAnimationFrame(step);
    },
    [applyTransform, dragDampening, maxVerticalRotationDeg, stopInertia]
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const observer = new ResizeObserver(entries => {
      const rect = entries[0].contentRect;
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const minDim = Math.min(width, height);
      const maxDim = Math.max(width, height);
      const aspect = width / height;
      let basis;

      if (fitBasis === "min") basis = minDim;
      else if (fitBasis === "max") basis = maxDim;
      else if (fitBasis === "width") basis = width;
      else if (fitBasis === "height") basis = height;
      else basis = aspect >= 1.3 ? width : minDim;

      const radius = clamp(Math.min(basis * fit, height * 1.35), minRadius, maxRadius);
      const viewerPad = Math.max(8, Math.round(minDim * padFactor));
      root.style.setProperty("--radius", `${Math.round(radius)}px`);
      root.style.setProperty("--viewer-pad", `${viewerPad}px`);
      root.style.setProperty("--overlay-blur-color", overlayBlurColor);
      root.style.setProperty("--tile-radius", imageBorderRadius);
      root.style.setProperty("--enlarge-radius", openedImageBorderRadius);
      root.style.setProperty("--image-filter", grayscale ? "grayscale(1)" : "none");
      applyTransform(rotationRef.current.x, rotationRef.current.y);
    });

    observer.observe(root);
    return () => observer.disconnect();
  }, [
    applyTransform,
    fit,
    fitBasis,
    grayscale,
    imageBorderRadius,
    maxRadius,
    minRadius,
    openedImageBorderRadius,
    overlayBlurColor,
    padFactor,
  ]);

  useEffect(() => () => stopInertia(), [stopInertia]);

  useEffect(() => {
    document.body.classList.toggle("dg-scroll-lock", Boolean(openedImage));
    return () => document.body.classList.remove("dg-scroll-lock");
  }, [openedImage]);

  useGesture(
    {
      onDragStart: () => {
        if (openedImage) return;
        stopInertia();
        startRotationRef.current = { ...rotationRef.current };
      },
      onDrag: ({ movement: [mx, my], last, velocity: [vx, vy], direction: [dx, dy] }) => {
        if (openedImage) return;

        const nextX = clamp(
          startRotationRef.current.x - my / dragSensitivity,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg
        );
        const nextY = wrapAngleSigned(startRotationRef.current.y + mx / dragSensitivity);
        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);

        if (last) {
          startInertia(vx * dx, vy * dy);
        }
      },
    },
    { target: mainRef, eventOptions: { passive: true } }
  );

  return (
    <div
      ref={rootRef}
      className="sphere-root"
      data-enlarging={openedImage ? "true" : undefined}
      style={{
        "--segments-x": segments,
        "--segments-y": segments,
        "--overlay-blur-color": overlayBlurColor,
        "--tile-radius": imageBorderRadius,
        "--enlarge-radius": openedImageBorderRadius,
        "--image-filter": grayscale ? "grayscale(1)" : "none",
      }}
    >
      <main ref={mainRef} className="sphere-main">
        <div className="stage">
          <div ref={sphereRef} className="sphere">
            {items.map((item, index) => (
              <div
                className="item"
                key={`${item.x}-${item.y}-${index}`}
                style={{
                  "--offset-x": item.x,
                  "--offset-y": item.y,
                  "--item-size-x": item.sizeX,
                  "--item-size-y": item.sizeY,
                }}
              >
                <button
                  aria-label={item.alt || "Open gallery image"}
                  className="item__image"
                  onClick={() => setOpenedImage(item)}
                  type="button"
                >
                  <img alt={item.alt} draggable={false} src={item.src} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="overlay" />
        <div className="overlay overlay--blur" />
        <div className="edge-fade edge-fade--top" />
        <div className="edge-fade edge-fade--bottom" />

        <button className="dome-enlarge" onClick={() => setOpenedImage(null)} type="button">
          {openedImage ? <img alt={openedImage.alt} src={openedImage.src} /> : null}
        </button>
      </main>
    </div>
  );
}
