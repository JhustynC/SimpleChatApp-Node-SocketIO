import { envs } from "./config/plugins/envs.plugin";
import { AppServer } from "./presentation/server";

(async () => {
  main();
})();

function main() {
  const server = new AppServer({
    port: envs.PORT,
    public_path: envs.PUBLIC_PATH,
  });

  server.start();
}
