import "module-alias/register";

import app from "@tracking/app";
import { PrismaClient } from "@prisma/client";

const PORT = process.env.PORT || 5050;
const prisma = new PrismaClient();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
