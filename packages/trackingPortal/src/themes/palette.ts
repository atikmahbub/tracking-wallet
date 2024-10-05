// material-ui
import { alpha, createTheme } from "@mui/material/styles";

// third-party
import {
  presetDarkPalettes,
  presetPalettes,
  PalettesProps,
} from "@ant-design/colors";

// project import
import ThemeOption from "@trackingPortal/themes/theme";

// types
import { PaletteThemeProps } from "@trackingPortal/types/theme";
import { PresetColor, ThemeMode } from "@trackingPortal/types/config";

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const Palette = (mode: ThemeMode, presetColor: PresetColor) => {
  const colors: PalettesProps =
    mode === "dark" ? presetDarkPalettes : presetPalettes;

  let greyPrimary = [
    "#ffffff",
    "#fafafa",
    "#f5f5f5",
    "#f0f0f0",
    "#d9d9d9",
    "#bfbfbf",
    "#8c8c8c",
    "#595959",
    "#262626",
    "#141414",
    "#000000",
  ];
  let greyAscent = ["#fafafa", "#bfbfbf", "#434343", "#1f1f1f"];
  let greyConstant = ["#fafafb", "#e6ebf1"];

  if (mode === "dark") {
    greyPrimary = [
      "#000000",
      "#141414",
      "#23272E",
      "#595959",
      "#8c8c8c",
      "#bfbfbf",
      "#d9d9d9",
      "#f0f0f0",
      "#f5f5f5",
      "#fafafa",
      "#ffffff",
    ];
    // greyPrimary.reverse();
    greyAscent = ["#fafafa", "#bfbfbf", "#434343", "#1f1f1f"];
    greyConstant = ["#121212", "#d3d8db"];
  }
  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

  const paletteColor: PaletteThemeProps = ThemeOption(
    colors,
    presetColor,
    mode
  );

  return createTheme({
    palette: {
      mode,
      common: {
        black: "#000",
        white: "#fff",
      },
      ...paletteColor,
      text: {
        primary:
          mode === "dark"
            ? alpha(paletteColor.grey[900]!, 0.87)
            : paletteColor.grey[700],
        secondary:
          mode === "dark"
            ? alpha(paletteColor.grey[900]!, 0.45)
            : paletteColor.grey[500],
        disabled:
          mode === "dark"
            ? alpha(paletteColor.grey[900]!, 0.1)
            : paletteColor.grey[400],
      },
      action: {
        disabled: paletteColor.grey[300],
      },
      divider:
        mode === "dark"
          ? alpha(paletteColor.grey[900]!, 0.05)
          : paletteColor.grey[200],
      background: {
        paper: mode === "dark" ? paletteColor.grey[100] : paletteColor.grey[0],
        default: mode === "light" ? "#F0F8FF" : "#0F1215",
      },
    },
  });
};

export default Palette;
