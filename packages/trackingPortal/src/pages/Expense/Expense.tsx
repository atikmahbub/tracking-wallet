import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const Expense = () => {
  const { user } = useAuth0();
  return (
    <div>
      <pre style={{ color: "#333", fontSize: "14px", whiteSpace: "pre-wrap" }}>
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
};

export default Expense;
