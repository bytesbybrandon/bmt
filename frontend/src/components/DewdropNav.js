import { motion } from "framer-motion";
import { DROPS, dropletPosition } from "@/utils/webGeometry";
import { useTheme } from "@/utils/theme";

export const DewdropNav = ({ metrics, onSelect, onHover, struckId, disabled, quick = false }) => {
  const narrow = metrics.w < 640;
  const theme = useTheme();
  const dew = parseFloat(theme.split(":")[2] || "0.75");
  const size = Math.round(18 * (0.85 + dew * 0.5));
  return (
    <>
      {DROPS.map((d, i) => {
        const frac = narrow ? d.dist * 0.72 : d.dist;
        const p = dropletPosition(metrics, d.angle, frac);
        const labelStyle = { marginTop: 8 };
        if (p.x > metrics.w - 110) {
          labelStyle.right = 8;
        } else if (p.x < 110) {
          labelStyle.left = 8;
        } else {
          labelStyle.left = "50%";
          labelStyle.transform = "translateX(-50%)";
        }
        return (
          <motion.button
            key={d.id}
            data-testid={`nav-droplet-${d.id}`}
            type="button"
            aria-label={d.label}
            className="group absolute z-30"
            style={{ left: p.x, top: p.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: quick ? 0.1 + i * 0.07 : 1.5 + i * 0.15,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={() => onSelect({ id: d.id, x: p.x, y: p.y, index: i })}
            onMouseEnter={() => onHover?.(i)}
            disabled={disabled}
          >
            <span
              className={`droplet droplet-aura block -translate-x-1/2 -translate-y-1/2 transition-[transform,opacity,width,height] duration-700 ease-out group-hover:scale-[1.7] ${
                struckId === d.id ? "scale-50 opacity-60" : ""
              }`}
              style={{ width: size, height: size }}
            />
            <span
              className="absolute top-full whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.32em] text-neutral-300 opacity-80 transition-[opacity,color] duration-300 group-hover:text-amber-100 group-hover:opacity-100"
              style={labelStyle}
            >
              {d.label}
            </span>
          </motion.button>
        );
      })}
    </>
  );
};
