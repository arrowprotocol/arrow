import { utils } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

import { ARROW_ADDRESSES, SUNNY_PROGRAM } from "./constants";

/**
 * Generates the canonical Bank PDA.
 *
 * @param crateToken
 * @param programID
 * @returns
 */
export const generateArrowAddress = (
  mint: PublicKey,
  programID: PublicKey = ARROW_ADDRESSES.ArrowSunny
): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddress(
    [utils.bytes.utf8.encode("arrow"), mint.toBuffer()],
    programID
  );
};

export const generateSunnyVaultAddress = async ({
  pool,
  owner,
}: {
  pool: PublicKey;
  owner: PublicKey;
}): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(
    [
      utils.bytes.utf8.encode("SunnyQuarryVault"),
      pool.toBuffer(),
      owner.toBuffer(),
    ],
    SUNNY_PROGRAM
  );
};

const CREATOR_KEY = new PublicKey(
  "7iAxSFR2dgHxcaASBjAkktgiwPDUYCZYmKz7QAektZ4B"
);

export const generateSunnyPoolAddress = async ({
  quarry,
}: {
  quarry: PublicKey;
}): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(
    [
      utils.bytes.utf8.encode("SunnyQuarryPool"),
      CREATOR_KEY.toBuffer(),
      quarry.toBuffer(),
    ],
    SUNNY_PROGRAM
  );
};
