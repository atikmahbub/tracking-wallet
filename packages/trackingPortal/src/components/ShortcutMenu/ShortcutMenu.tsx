import {
  Box,
  Button,
  Chip,
  Divider,
  Menu,
  PopoverOrigin,
  styled,
  SxProps,
  Typography,
} from "@mui/material";
import React, { Fragment, useState } from "react";
import { v4 } from "uuid";
import ShortcutIcon from "@mui/icons-material/Shortcut";

export type IMenuItem = {
  id: string;
  name: string;
  onClick?: (value: any) => void;
};

interface IShortcutMenu {
  options: IMenuItem[];
  sx?: SxProps;
  menuSX?: SxProps;
  anchorOrigin?: PopoverOrigin;
}

const StyledChip = styled(Chip)({
  borderRadius: 30,
  margin: "8px",
});

const ShortcutMenu: React.FC<IShortcutMenu> = ({
  options,
  sx,
  menuSX,
  anchorOrigin,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [shortcuts, setShortcuts] = useState<string[]>([]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <Button
        startIcon={<ShortcutIcon />}
        variant="text"
        onClick={handleClick}
        sx={{
          fontWeight: 700,
          color: (theme) =>
            theme.palette.mode === "dark"
              ? theme.palette.primary.darker
              : theme.palette.primary.main,
        }}
      >
        Shortcuts
      </Button>
      <Menu
        id="basic-menu"
        MenuListProps={{
          "aria-labelledby": "basic-menu-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
          ...anchorOrigin,
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          ...menuSX,
        }}
        slotProps={{
          root: {
            sx: {
              p: 0,
            },
          },
          paper: {
            sx: {
              mt: 1.5,
              boxShadow: "0px 16px 16px 0px rgba(110, 98, 166, 0.16)",
              maxWidth: { xs: 390, md: 450 },
              width: "100%",
              maxHeight: 400,
              height: "100%",
            },
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={1}
        >
          <Typography variant="h6" fontWeight={700}>
            Shortcuts
          </Typography>
          <Button
            variant="text"
            sx={{
              fontWeight: 700,
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.primary.darker
                  : theme.palette.primary.main,
            }}
          >
            Manage
          </Button>
        </Box>
        <Divider sx={{ mb: 1 }} />
        {options.map((option) => (
          <StyledChip
            key={option.id}
            label={option.name}
            onClick={() => {
              const list = [...shortcuts];
              if (!list.includes(option.id)) {
                list.push(option.id);
                setShortcuts(list);
              }
            }}
          />
        ))}
        <Divider sx={{ mt: 1, mb: 1 }} />
        {shortcuts.map((item) => {
          const selectedShortcut = options.find((op) => op.id === item);
          return (
            <StyledChip
              key={item}
              label={selectedShortcut?.name}
              onDelete={() => {
                const updatedList = shortcuts.filter(
                  (shortcut) => shortcut !== item
                );
                setShortcuts(updatedList);
              }}
            />
          );
        })}
      </Menu>
    </Fragment>
  );
};

export default ShortcutMenu;
