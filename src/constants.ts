import { PublicKey } from "@solana/web3.js";

/**
 * Arrow program addresses.
 */
export const ARROW_ADDRESSES = {
  ArrowSunny: new PublicKey("ARoWLTBWoWrKMvxEiaE2EH9DrWyV7mLpKywGDWxBGeq9"),
};

/**
 * Owner of all fee token accounts.
 */
export const ARROW_FEE_OWNER = new PublicKey(
  "5ZhyZ5846xWtgm68k9Dg2WpechzcxVPxL3yD3zL3H1wm"
);

/**
 * Sunny program id.
 */
export const SUNNY_PROGRAM = new PublicKey(
  "SPQR4kT3q2oUKEJes2L6NNSBCiPW9SfuhkuqC9bp6Sx"
);

/**
 * Key of the Sunny rewarder.
 */
export const SUNNY_REWARDER_KEY = new PublicKey(
  "97PmYbGpSHSrKrUkQX793mjpA2EA9rrQKkHsQuvenU44"
);

/**
 * Key of the Sunny creator.
 */
export const SUNNY_CREATOR_KEY = new PublicKey(
  "7iAxSFR2dgHxcaASBjAkktgiwPDUYCZYmKz7QAektZ4B"
);
