import "dotenv/config";
import { OAuth2Client } from "google-auth-library";

export default new OAuth2Client(process.env.GOOGLE_CLIEND_ID);
