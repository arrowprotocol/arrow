import type { KeyedAccountInfo } from "@solana/web3.js";

import { ARROW_CODER } from "./constants";
import type { ArrowData } from "./programs/arrowSunny";

/**
 * Parses an Arrow.
 */
export const parseArrow = (data: KeyedAccountInfo): ArrowData =>
  ARROW_CODER.ArrowSunny.accountParsers.arrow(data.accountInfo.data);
