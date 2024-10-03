import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import React from "react";

const Expense = () => {
  const { logout, isAuthenticated, user } = useAuth0();
  return (
    <div>
      <pre style={{ color: "#333", fontSize: "14px", whiteSpace: "pre-wrap" }}>
        {JSON.stringify(user, null, 2)}
      </pre>
      <Button onClick={() => logout()}>log out</Button>
    </div>
  );
};

export default Expense;
