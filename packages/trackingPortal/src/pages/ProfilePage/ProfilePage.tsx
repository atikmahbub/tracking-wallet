import { ArrowLeftOutlined } from "@ant-design/icons";
import { Box, Button, Grid2 as Grid, Stack, Typography } from "@mui/material";
import MainCard from "@trackingPortal/components/MainCard";
import { useStoreContext } from "@trackingPortal/contexts/StoreProvider";
import { ERoutes } from "@trackingPortal/routes/ERoutes";
import React from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useStoreContext();
  const navigate = useNavigate();
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
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default ProfilePage;
