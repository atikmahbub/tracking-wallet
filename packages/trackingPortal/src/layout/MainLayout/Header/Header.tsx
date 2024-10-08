import * as React from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import { useStoreContext } from "@trackingPortal/contexts/StoreProvider";
import { useAuth0 } from "@auth0/auth0-react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Typography, Avatar, useTheme } from "@mui/material";
import { getGreeting } from "@trackingPortal/utils/timeUtils";
import { useNavigate } from "react-router-dom";
import { ERoutes } from "@trackingPortal/routes/ERoutes";

export default function Header() {
  const { user } = useStoreContext();
  const { logout } = useAuth0();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const getMenuItemColor = isDarkMode ? "#fff" : theme.palette.primary.dark;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const withClose = (handler) => {
    handleClose();
    handler();
  };

  return (
    <React.Fragment>
      <Box display="flex" gap={3} alignItems="center">
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              src={user.profilePicture}
              sx={{
                width: 50,
                height: 50,
                bgcolor: isDarkMode ? "#fff" : theme.palette.primary.light,
              }}
            />
          </IconButton>
        </Tooltip>
        <Typography
          variant="h5"
          color={isDarkMode ? "unset" : "primary"}
          sx={{ fontWeight: 600 }}
        >
          {getGreeting()}, {user.name.split(" ")[0]}!
        </Typography>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 2,
          sx: {
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
            width: 220,
            mt: 1.5,
            overflow: "visible",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              left: 10,
              width: 10,
              height: 10,
              bgcolor: theme.palette.background.paper,
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose} sx={{ color: getMenuItemColor }}>
          <ListItemIcon onClick={() => navigate(ERoutes.Profile)}>
            <AccountCircleIcon
              fontSize="small"
              sx={{ color: getMenuItemColor }}
            />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem
          onClick={() =>
            withClose(
              logout({ logoutParams: { returnTo: window.location.origin } })
            )
          }
          sx={{ color: getMenuItemColor }}
        >
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: getMenuItemColor }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
