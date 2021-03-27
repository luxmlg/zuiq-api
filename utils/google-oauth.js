import "dotenv/config";
import { OAuth2Client } from "google-auth-library";

export default new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
