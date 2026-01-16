import * as React from "react";
import Svg, { G, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const BlackChecker = (props: React.SVGProps<SVGSVGElement>) => (
  <Svg
    width={99}
    height={99}
    viewBox="0 0 99 99"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G filter="url(#filter0_dd_1_126)">
      <Circle
        cx={49.4289}
        cy={49.4289}
        r={47.5}
        fill="url(#paint0_linear_1_126)"
      />
    </G>
    <Circle
      cx={33.033}
      cy={33.033}
      r={33.033}
      transform="matrix(-1 0 0 1 82.4619 16.3959)"
      fill="url(#paint1_linear_1_126)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_1_126"
        x1={10.6091}
        y1={17.8426}
        x2={77.1574}
        y2={88.4898}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#96776E" />
        <Stop offset={1} stopColor="#321111" />
      </LinearGradient>
      <LinearGradient
        id="paint1_linear_1_126"
        x1={6.03649}
        y1={11.0669}
        x2={52.3162}
        y2={60.1972}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#96776E" />
        <Stop offset={1} stopColor="#321111" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default BlackChecker;
