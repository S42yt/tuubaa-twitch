import { buildServer } from "./server";

const startServer = async () => {
  const server = await buildServer();
  try {
    const PORT = process.env.PORT || 3000;
    await server.listen({ port: Number(PORT), host: "0.0.0.0" });
    console.log("\x1b[36m API server is running on port " + PORT + " \x1b[0m");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

startServer();
