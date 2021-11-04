import { utils } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

import { ARROW_ADDRESSES, SUNNY_CREATOR_KEY, SUNNY_PROGRAM } from "./constants";

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

export const generateSunnyPoolAddress = async ({
  quarry,
}: {
  quarry: PublicKey;
}): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(
    [
      utils.bytes.utf8.encode("SunnyQuarryPool"),
      SUNNY_CREATOR_KEY.toBuffer(),
      quarry.toBuffer(),
    ],
    SUNNY_PROGRAM
  );
};
