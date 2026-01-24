import React, { useMemo } from "react";
import { View } from "react-native";
import Svg, { Polyline, Line, Circle, Text as SvgText } from "react-native-svg";
import { colors } from "@/constants/theme";

type Props = {
  data: number[];         
  height?: number;
  width?: number;         
  yLabel?: string;
};

export default function SimpleLineChart({ data, height = 180, width = 320, yLabel = "kg/ha" }: Props) {
  const padding = 24;

  const { points, minV, maxV } = useMemo(() => {
    const clean = data.map((v) => (Number.isFinite(v) ? v : 0));
    const minVal = Math.min(...clean);
    const maxVal = Math.max(...clean);
    const span = Math.max(1, maxVal - minVal);

    const stepX = (width - padding * 2) / Math.max(1, clean.length - 1);

    const pts = clean
      .map((v, i) => {
        const x = padding + i * stepX;
        const y = padding + (1 - (v - minVal) / span) * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(" ");

    return { points: pts, minV: minVal, maxV: maxVal };
  }, [data, height, width]);

  return (
    <View style={{ backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 10 }}>
      <Svg width={width} height={height}>
        <Line x1={24} y1={height - 24} x2={width - 24} y2={height - 24} stroke={colors.border} strokeWidth={1} />
        <Line x1={24} y1={24} x2={24} y2={height - 24} stroke={colors.border} strokeWidth={1} />

        <SvgText x={4} y={28} fontSize="10" fill={colors.mut}>
          {maxV.toFixed(0)} {yLabel}
        </SvgText>
        <SvgText x={4} y={height - 18} fontSize="10" fill={colors.mut}>
          {minV.toFixed(0)} {yLabel}
        </SvgText>

        <Polyline points={points} fill="none" stroke={colors.primaryDark} strokeWidth={3} />

        {data.map((v, i) => {
          const clean = Number.isFinite(v) ? v : 0;
          const span = Math.max(1, maxV - minV);
          const stepX = (width - 24 * 2) / Math.max(1, data.length - 1);
          const x = 24 + i * stepX;
          const y = 24 + (1 - (clean - minV) / span) * (height - 24 * 2);
          return <Circle key={i} cx={x} cy={y} r={3.5} fill={colors.info} />;
        })}
      </Svg>
    </View>
  );
}
