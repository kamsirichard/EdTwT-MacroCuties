interface MacroRingProps {
  protein: number;
  carbs: number;
  fat: number;
  size?: number;
}

export function MacroRing({ protein, carbs, fat, size = 100 }: MacroRingProps) {
  const total = protein + carbs + fat || 1;
  const pPct = (protein / total) * 100;
  const cPct = (carbs / total) * 100;
  const fPct = (fat / total) * 100;

  const r = 40;
  const circumference = 2 * Math.PI * r;
  const cx = 50;
  const cy = 50;

  const pLen = (pPct / 100) * circumference;
  const cLen = (cPct / 100) * circumference;
  const fLen = (fPct / 100) * circumference;

  const gap = 2;
  const pOffset = 0;
  const cOffset = -(pLen + gap);
  const fOffset = -(pLen + gap + cLen + gap);

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
      {/* Background */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="hsl(340 30% 93%)" strokeWidth="12" />
      {/* Protein (blue) */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="hsl(210 80% 60%)"
        strokeWidth="12"
        strokeDasharray={`${pLen - gap} ${circumference - pLen + gap}`}
        strokeDashoffset={-pOffset}
        strokeLinecap="round"
      />
      {/* Carbs (yellow) */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="hsl(45 90% 55%)"
        strokeWidth="12"
        strokeDasharray={`${cLen - gap} ${circumference - cLen + gap}`}
        strokeDashoffset={cOffset}
        strokeLinecap="round"
      />
      {/* Fat (pink) */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="hsl(340 80% 65%)"
        strokeWidth="12"
        strokeDasharray={`${fLen - gap} ${circumference - fLen + gap}`}
        strokeDashoffset={fOffset}
        strokeLinecap="round"
      />
    </svg>
  );
}
