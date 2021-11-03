import type { AnchorTypes } from "@saberhq/anchor-contrib";

import type { ArrowSunnyIDL } from ".";

export * from "../idls/arrow_sunny";

type ArrowSunnyTypes = AnchorTypes<ArrowSunnyIDL, { arrow: ArrowData }>;

export type ArrowSunnyProgram = ArrowSunnyTypes["Program"];

export type ArrowData = ArrowSunnyTypes["Accounts"]["Arrow"];

export type ArrowMiner = ArrowSunnyTypes["Defined"]["ArrowMiner"];
