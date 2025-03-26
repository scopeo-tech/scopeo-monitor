import morgan from "morgan";
import logger from "../lib/util/logger";

const morganMiddleware = morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()), 
    },
  });

export default morganMiddleware;