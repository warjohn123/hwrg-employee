import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Platform,
} from "react-native";
import hashStringToIndex from "../../lib/hashStringToIndex";
import getInitials from "../../lib/getInitials";

type Props = {
  name?: string | null; // user's full name (for initials)
  uri?: string | null; // remote image uri
  size?: number; // diameter in pixels
  fontSize?: number; // override font size
  style?: StyleProp<ViewStyle>; // container style override
  textStyle?: StyleProp<TextStyle>; // initials text override
  imageStyle?: StyleProp<ImageStyle>; // image style override
  accessible?: boolean;
  accessibilityLabel?: string;
};

const DEFAULT_COLORS = [
  "#E57373",
  "#F06292",
  "#BA68C8",
  "#9575CD",
  "#7986CB",
  "#64B5F6",
  "#4FC3F7",
  "#4DB6AC",
  "#81C784",
  "#AED581",
  "#DCE775",
  "#FFF176",
  "#FFD54F",
  "#FFB74D",
  "#A1887F",
];

export default function Avatar({
  name,
  uri,
  size = 48,
  fontSize,
  style,
  textStyle,
  imageStyle,
  accessible = true,
  accessibilityLabel,
}: Props) {
  const initials = useMemo(() => getInitials(name), [name]);

  const bgColor = useMemo(() => {
    const key = (name || initials || "anon").toString();
    const idx = hashStringToIndex(key, DEFAULT_COLORS.length);
    return DEFAULT_COLORS[idx];
  }, [name, initials]);

  const resolvedFontSize = fontSize ?? Math.round(size * 0.4);

  const containerStyle: StyleProp<ViewStyle> = [
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden", // image fits circularly
      backgroundColor: bgColor,
    },
    style,
  ];

  const initialsTextStyle: StyleProp<TextStyle> = [
    {
      fontSize: resolvedFontSize,
      color: "white",
      fontWeight: "600",
      // Slight vertical offset for better visual centering on Android/iOS
      includeFontPadding: false,
      textAlignVertical: "center",
      textAlign: "center",
    } as TextStyle,
    textStyle,
  ];

  const imagePropsStyle: StyleProp<ImageStyle> = [
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      resizeMode: "cover",
    },
    imageStyle,
  ];

  // accessibility label fallback
  const a11yLabel =
    accessibilityLabel ??
    (name ? `${name} avatar` : uri ? "User avatar" : "Placeholder avatar");

  // If uri exists, render image; if it fails to load the image will show nothing.
  // React Native's <Image> doesn't expose load-fail callback easily without onError,
  // but we keep it simple: show Image if uri present; otherwise initials.
  // If you want a local fallback image on error, you can add onError state (see notes below).
  if (uri) {
    return (
      <View
        accessible={accessible}
        accessibilityLabel={a11yLabel}
        style={containerStyle}
      >
        <Image
          source={{ uri }}
          style={imagePropsStyle}
          // @ts-ignore - onError exists but TypeScript sometimes complains on Image props
          onError={() => {
            /* optional: handle load failure by swapping to fallback (requires local state) */
          }}
          // on iOS hide image corner aliasing
          progressiveRenderingEnabled
        />
      </View>
    );
  }

  // No image -> render initials
  return (
    <View
      accessible={accessible}
      accessibilityLabel={a11yLabel}
      style={containerStyle}
    >
      <Text
        selectable={false}
        allowFontScaling={false}
        style={initialsTextStyle}
      >
        {initials}
      </Text>
    </View>
  );
}
