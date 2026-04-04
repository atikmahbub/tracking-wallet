import { ArrowLeftOutlined } from "@ant-design/icons";
import { Box, Button, Grid2 as Grid, Stack, Typography } from "@mui/material";
import MainCard from "@trackingPortal/components/MainCard";
import { useStoreContext } from "@trackingPortal/contexts/StoreProvider";
import { ERoutes } from "@trackingPortal/routes/ERoutes";
import React from "react";
import { useNavigate } from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";
import toast from "react-hot-toast";
import AlertModal from "@trackingPortal/components/AlertModal";

const ProfilePage = () => {
  const { user, apiGateway } = useStoreContext();
  const navigate = useNavigate();
  const { logout } = useAuth0();
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await apiGateway.userService.deleteAccount(user.userId);
      toast.success("Account deleted successfully");
      setIsAlertOpen(false);
      logout({ logoutParams: { returnTo: window.location.origin } });
    } catch (error) {
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Grid container spacing={3} mt={{ xs: 5, md: 10 }}>
      <Grid size={12}>
        <MainCard
          title={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" fontWeight={600}>
                Profile
              </Typography>

              <Button
                startIcon={<ArrowLeftOutlined />}
                variant="text"
                onClick={() => navigate(ERoutes.Expense)}
              >
                Back to Home
              </Button>
            </Box>
          }
        >
          <Stack spacing={1}>
            <Box display="flex" gap={1.5}>
              <Typography variant="h6">Name:</Typography>
              <Typography variant="h5">{user.name}</Typography>
            </Box>
            <Box display="flex" gap={1.5}>
              <Typography variant="h6">Email:</Typography>
              <Typography variant="h5">{user.email}</Typography>
            </Box>
          </Stack>

          <Box mt={4} pt={2} borderTop="1px solid" borderColor="divider">
            <Typography variant="h6" color="error" gutterBottom>
              Danger Zone
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => setIsAlertOpen(true)}
            >
              Delete Account
            </Button>
          </Box>
        </MainCard>
      </Grid>
      
      <AlertModal
        title="Delete Account"
        description="This will permanently delete your account and all data. This action cannot be undone."
        isOpen={isAlertOpen}
        handleClose={() => setIsAlertOpen(false)}
        onCancelClick={() => setIsAlertOpen(false)}
        onConfirmClick={handleDeleteAccount}
        cancelButtonProps={{ buttonLabel: "Cancel", disabled: isDeleting }}
        confirmButtonProps={{ buttonLabel: isDeleting ? "Deleting..." : "Confirm Delete", color: "error", disabled: isDeleting }}
      />
    </Grid>
  );
};

export default ProfilePage;
