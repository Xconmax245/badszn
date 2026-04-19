export type DividerVariant = "wave" | "slash" | "tear" | "scoop" | "arrow" | "doublewave"

export default function SectionDivider({
  variant = "wave",
  fill = "#000",        // color of the section ABOVE
  background = "transparent"
}: {
  variant?: DividerVariant
  fill?: string
  background?: string
}) {
  const paths: Record<DividerVariant, string> = {
    wave:       "M0,30 L0,15 C30,30 70,0 100,15 L100,30 Z",
    slash:      "M0,30 L0,10 L100,30 Z",
    tear:       "M0,30 L0,15 L5,22 L10,12 L15,25 L20,8 L25,20 L30,5 L35,22 L40,10 L45,20 L50,5 L55,24 L60,12 L65,22 L70,8 L75,20 L80,10 L85,25 L90,12 L95,22 L100,15 L100,30 Z",
    scoop:      "M0,30 L0,0 Q50,40 100,0 L100,30 Z",
    arrow:      "M0,30 L0,0 L50,25 L100,0 L100,30 Z",
    doublewave: "M0,30 L0,15 Q25,30 50,15 T100,15 L100,30 Z",
  }

  return (
    <div
      className="w-full overflow-hidden leading-[0] -mb-px"
      style={{ background }}
    >
      <svg
        viewBox="0 0 100 30"
        preserveAspectRatio="none"
        className="w-full h-[60px] md:h-[80px]"
      >
        <path d={paths[variant]} fill={fill} />
      </svg>
    </div>
  )
}
