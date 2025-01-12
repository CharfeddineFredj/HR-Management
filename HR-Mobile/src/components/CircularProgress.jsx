/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const CircularProgress = ({ percent, radius, borderWidth, color, shadowColor, bgColor }) => {
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percent) / 100;
  const formattedPercent = percent.toFixed(2); // Format the percentage to two decimal places

  return (
    <View style={{ width: radius * 2, height: radius * 2 }}>
      <Svg width={radius * 2} height={radius * 2}>
        <Circle
          cx={radius}
          cy={radius}
          r={radius - borderWidth / 2}
          stroke={shadowColor}
          strokeWidth={borderWidth}
          fill={bgColor}
        />
        <Circle
          cx={radius}
          cy={radius}
          r={radius - borderWidth / 2}
          stroke={color}
          strokeWidth={borderWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <Text style={{ fontSize: radius / 2.5 }}>{`${formattedPercent}%`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CircularProgress;
