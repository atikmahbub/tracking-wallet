import { Box, Button, ButtonProps, useTheme } from "@mui/material";

const LoginButton: React.FC<ButtonProps> = ({ ...rest }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Button
      {...rest}
      sx={{
        padding: "0.75em 3em",
        minWidth: "190px", // Ensures the button is wide enough
        fontSize: "1rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: isDarkMode ? "#FFFFFF" : "#2A47AB", // Text color according to mode
        backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#FFFFFF", // Light background initially
        border: `2px solid ${isDarkMode ? "#FFFFFF" : "#2A47AB"}`, // Border to match the primary color
        borderRadius: "5px", // Slightly rounded corners
        boxShadow: `0px 4px 12px ${
          isDarkMode ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.2)"
        }`, // Subtle shadow
        cursor: "pointer",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-100%",
          left: "0",
          width: "100%",
          height: "100%",
          background: "rgba(255, 255, 255, 0.3)",
          transition: "all 0.4s ease",
        },
        "&:hover::before": {
          top: "0%",
        },
        "&:hover": {
          background: `linear-gradient(135deg, ${
            isDarkMode ? "#3d5ea3" : "#4b72d2" // Lighter blue for dark and light modes
          }, ${isDarkMode ? "#536ebc" : "#6a88e3"})`, // Softer gradient on hover
          color: "#FFFFFF", // Text turns white on hover
          boxShadow: `0px 6px 16px ${
            isDarkMode ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.3)"
          }`, // Deepen shadow on hover
          transform: "scale(1.05)", // Slight scale up on hover
        },
        "&:active": {
          background: `linear-gradient(135deg, ${
            isDarkMode ? "#2a4b83" : "#3b5ea1" // Slightly darker but still lighter tones
          }, ${isDarkMode ? "#3f5ba0" : "#546fc0"})`, // Lighter gradient on active
          boxShadow: "none",
        },
      }}
    >
      Login
    </Button>
  );
};

export default LoginButton;
