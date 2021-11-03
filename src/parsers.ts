import { Coder } from "@project-serum/anchor";
import type { KeyedAccountInfo } from "@solana/web3.js";

import { ArrowSunnyJSON } from "./idls/arrow_sunny";
import type { ArrowData } from "./programs/arrowSunny";

const ARROW_CODER = new Coder(ArrowSunnyJSON);

export const parseArrow = (data: KeyedAccountInfo): ArrowData =>
  ARROW_CODER.accounts.decode<ArrowData>("Arrow", data.accountInfo.data);
