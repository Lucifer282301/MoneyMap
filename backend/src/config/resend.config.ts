import { Resend } from "resend";
import { ENV } from "./env.config";

export const resend = new Resend(ENV.RESEND_API_KEY);
