import { Coder } from "@project-serum/anchor";
import type { AnchorTypes } from "@saberhq/anchor-contrib";
import { generateErrorMap } from "@saberhq/anchor-contrib";

export type SunnyPoolQuarryIDL = {
  version: "0.0.0";
  name: "sunny_pool_quarry";
  instructions: [
    {
      name: "newPool";
      accounts: [
        {
          name: "creator";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rewarder";
          isMut: false;
          isSigner: false;
        },
        {
          name: "quarry";
          isMut: false;
          isSigner: false;
        },
        {
          name: "pool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "payer";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "internalMint";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "bump";
          type: "u8";
        }
      ];
    },
    {
      name: "initVault";
      accounts: [
        {
          name: "pool";
          isMut: false;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "payer";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "bump";
          type: "u8";
        }
      ];
    },
    {
      name: "initMiner";
      accounts: [
        {
          name: "pool";
          isMut: false;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: false;
          isSigner: false;
        },
        {
          name: "miner";
          isMut: true;
          isSigner: false;
        },
        {
          name: "quarry";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewarder";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "minerVault";
          isMut: false;
          isSigner: false;
        },
        {
          name: "payer";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mineProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "bump";
          type: "u8";
        }
      ];
    },
    {
      name: "depositVendor";
      accounts: [
        {
          name: "vaultOwner";
          isMut: false;
          isSigner: true;
        },
        {
          name: "vaultVendorTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stake";
          accounts: [
            {
              name: "pool";
              isMut: true;
              isSigner: false;
            },
            {
              name: "vault";
              isMut: true;
              isSigner: false;
            },
            {
              name: "rewarder";
              isMut: false;
              isSigner: false;
            },
            {
              name: "quarry";
              isMut: true;
              isSigner: false;
            },
            {
              name: "miner";
              isMut: true;
              isSigner: false;
            },
            {
              name: "minerVault";
              isMut: true;
              isSigner: false;
            },
            {
              name: "tokenProgram";
              isMut: false;
              isSigner: false;
            },
            {
              name: "mineProgram";
              isMut: false;
              isSigner: false;
            },
            {
              name: "clock";
              isMut: false;
              isSigner: false;
            }
          ];
        }
      ];
      args: [];
    },
    {
      name: "stakeInternal";
      accounts: [
        {
          name: "vaultOwner";
          isMut: false;
          isSigner: true;
        },
        {
          name: "internalMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "internalMintTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stake";
          accounts: [
            {
              name: "pool";
              isMut: true;
              isSigner: false;
            },
            {
              name: "vault";
              isMut: true;
              isSigner: false;
            },
            {
              name: "rewarder";
              isMut: false;
              isSigner: false;
            },
            {
              name: "quarry";
              isMut: true;
              isSigner: false;
            },
            {
              name: "miner";
              isMut: true;
              isSigner: false;
            },
            {
              name: "minerVault";
              isMut: true;
              isSigner: false;
            },
            {
              name: "tokenProgram";
              isMut: false;
              isSigner: false;
            },
            {
              name: "mineProgram";
              isMut: false;
              isSigner: false;
            },
            {
              name: "clock";
              isMut: false;
              isSigner: false;
            }
          ];
        }
      ];
      args: [];
    },
    {
      name: "unstakeInternal";
      accounts: [
        {
          name: "vaultOwner";
          isMut: false;
          isSigner: true;
        },
        {
          name: "internalMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "internalMintTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stake";
          accounts: [
            {
              name: "pool";
              isMut: true;
              isSigner: false;
            },
            {
              name: "vault";
              isMut: true;
              isSigner: false;
            },
            {
              name: "rewarder";
              isMut: false;
              isSigner: false;
            },
            {
              name: "quarry";
              isMut: true;
              isSigner: false;
            },
            {
              name: "miner";
              isMut: true;
              isSigner: false;
            },
            {
              name: "minerVault";
              isMut: true;
              isSigner: false;
            },
            {
              name: "tokenProgram";
              isMut: false;
              isSigner: false;
            },
            {
              name: "mineProgram";
              isMut: false;
              isSigner: false;
            },
            {
              name: "clock";
              isMut: false;
              isSigner: false;
            }
          ];
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "withdrawVendor";
      accounts: [
        {
          name: "vaultOwner";
          isMut: false;
          isSigner: true;
        },
        {
          name: "vaultVendorTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stake";
          accounts: [
            {
              name: "pool";
              isMut: true;
              isSigner: false;
            },
            {
              name: "vault";
              isMut: true;
              isSigner: false;
            },
            {
              name: "rewarder";
              isMut: false;
              isSigner: false;
            },
            {
              name: "quarry";
              isMut: true;
              isSigner: false;
            },
            {
              name: "miner";
              isMut: true;
              isSigner: false;
            },
            {
              name: "minerVault";
              isMut: true;
              isSigner: false;
            },
            {
              name: "tokenProgram";
              isMut: false;
              isSigner: false;
            },
            {
              name: "mineProgram";
              isMut: false;
              isSigner: false;
            },
            {
              name: "clock";
              isMut: false;
              isSigner: false;
            }
          ];
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "withdrawFromVault";
      accounts: [
        {
          name: "owner";
          isMut: false;
          isSigner: true;
        },
        {
          name: "pool";
          isMut: false;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vaultTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenDestination";
          isMut: true;
          isSigner: false;
        },
        {
          name: "feeDestination";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "claimRewards";
      accounts: [
        {
          name: "mintWrapper";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mintWrapperProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "minter";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardsTokenMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardsTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "claimFeeTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakeTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stake";
          accounts: [
            {
              name: "pool";
              isMut: true;
              isSigner: false;
            },
            {
              name: "vault";
              isMut: true;
              isSigner: false;
            },
            {
              name: "rewarder";
              isMut: false;
              isSigner: false;
            },
            {
              name: "quarry";
              isMut: true;
              isSigner: false;
            },
            {
              name: "miner";
              isMut: true;
              isSigner: false;
            },
            {
              name: "minerVault";
              isMut: true;
              isSigner: false;
            },
            {
              name: "tokenProgram";
              isMut: false;
              isSigner: false;
            },
            {
              name: "mineProgram";
              isMut: false;
              isSigner: false;
            },
            {
              name: "clock";
              isMut: false;
              isSigner: false;
            }
          ];
        }
      ];
      args: [];
    },
    {
      name: "updateClaimFee";
      accounts: [
        {
          name: "admin";
          isMut: false;
          isSigner: true;
        },
        {
          name: "pool";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "claimFee";
          type: {
            defined: "MegaBPS";
          };
        }
      ];
    }
  ];
  accounts: [
    {
      name: "Pool";
      type: {
        kind: "struct";
        fields: [
          {
            name: "creator";
            type: "publicKey";
          },
          {
            name: "quarry";
            type: "publicKey";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "rewarder";
            type: "publicKey";
          },
          {
            name: "rewardsMint";
            type: "publicKey";
          },
          {
            name: "vendorMint";
            type: "publicKey";
          },
          {
            name: "internalMint";
            type: "publicKey";
          },
          {
            name: "admin";
            type: "publicKey";
          },
          {
            name: "pendingAdmin";
            type: "publicKey";
          },
          {
            name: "fees";
            type: {
              defined: "Fees";
            };
          },
          {
            name: "vaultCount";
            type: "u64";
          },
          {
            name: "totalVendorBalance";
            type: "u64";
          },
          {
            name: "totalInternalBalance";
            type: "u64";
          },
          {
            name: "totalRewardsClaimed";
            type: "u64";
          },
          {
            name: "totalRewardsFeesPaid";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "Vault";
      type: {
        kind: "struct";
        fields: [
          {
            name: "pool";
            type: "publicKey";
          },
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "index";
            type: "u64";
          },
          {
            name: "vendorBalance";
            type: "u64";
          },
          {
            name: "internalBalance";
            type: "u64";
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "Fees";
      type: {
        kind: "struct";
        fields: [
          {
            name: "claimFee";
            type: {
              defined: "MegaBPS";
            };
          },
          {
            name: "vendorFee";
            type: {
              defined: "MegaBPS";
            };
          },
          {
            name: "withdrawFee";
            type: {
              defined: "MegaBPS";
            };
          }
        ];
      };
    },
    {
      name: "MegaBPS";
      type: {
        kind: "struct";
        fields: [
          {
            name: "megaBps";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "WithdrawalType";
      type: {
        kind: "enum";
        variants: [
          {
            name: "Vendor";
          },
          {
            name: "VendorRewards";
          },
          {
            name: "Other";
          }
        ];
      };
    }
  ];
  events: [
    {
      name: "NewPoolEvent";
      fields: [
        {
          name: "pool";
          type: "publicKey";
          index: false;
        },
        {
          name: "creator";
          type: "publicKey";
          index: false;
        },
        {
          name: "rewarder";
          type: "publicKey";
          index: false;
        },
        {
          name: "rewardsMint";
          type: "publicKey";
          index: false;
        },
        {
          name: "vendorMint";
          type: "publicKey";
          index: false;
        }
      ];
    },
    {
      name: "NewVaultEvent";
      fields: [
        {
          name: "vault";
          type: "publicKey";
          index: false;
        },
        {
          name: "pool";
          type: "publicKey";
          index: false;
        },
        {
          name: "vendorMint";
          type: "publicKey";
          index: false;
        },
        {
          name: "owner";
          type: "publicKey";
          index: false;
        }
      ];
    },
    {
      name: "DepositEvent";
      fields: [
        {
          name: "vault";
          type: "publicKey";
          index: false;
        },
        {
          name: "owner";
          type: "publicKey";
          index: false;
        },
        {
          name: "mint";
          type: "publicKey";
          index: false;
        },
        {
          name: "amount";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "WithdrawEvent";
      fields: [
        {
          name: "vault";
          type: "publicKey";
          index: false;
        },
        {
          name: "owner";
          type: "publicKey";
          index: false;
        },
        {
          name: "mint";
          type: "publicKey";
          index: false;
        },
        {
          name: "amount";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "MintPoolEvent";
      fields: [
        {
          name: "vault";
          type: "publicKey";
          index: false;
        },
        {
          name: "amount";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "BurnPoolEvent";
      fields: [
        {
          name: "vault";
          type: "publicKey";
          index: false;
        },
        {
          name: "amount";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "ClaimEvent";
      fields: [
        {
          name: "vault";
          type: "publicKey";
          index: false;
        },
        {
          name: "mint";
          type: "publicKey";
          index: false;
        },
        {
          name: "amount";
          type: "u64";
          index: false;
        },
        {
          name: "initialBalance";
          type: "u64";
          index: false;
        },
        {
          name: "endBalance";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "WithdrawFromVaultEvent";
      fields: [
        {
          name: "vault";
          type: "publicKey";
          index: false;
        },
        {
          name: "mint";
          type: "publicKey";
          index: false;
        },
        {
          name: "withdrawalType";
          type: {
            defined: "WithdrawalType";
          };
          index: false;
        },
        {
          name: "destination";
          type: "publicKey";
          index: false;
        },
        {
          name: "amount";
          type: "u64";
          index: false;
        },
        {
          name: "fees";
          type: "u64";
          index: false;
        }
      ];
    }
  ];
  errors: [
    {
      code: 300;
      name: "Unauthorized";
      msg: "Unauthorized.";
    },
    {
      code: 301;
      name: "InsufficientBalance";
      msg: "Insufficient balance.";
    },
    {
      code: 302;
      name: "VaultInvariant";
      msg: "Vault invariant failed.";
    },
    {
      code: 303;
      name: "DecimalsMismatch";
      msg: "Decimals mismatch.";
    },
    {
      code: 304;
      name: "InvalidMiner";
      msg: "Invalid miner for the given quarry.";
    },
    {
      code: 305;
      name: "InvalidWithdrawMint";
      msg: "Withdraw mint must not be the internal mint.";
    }
  ];
};
export const SunnyPoolQuarryJSON: SunnyPoolQuarryIDL = {
  version: "0.0.0",
  name: "sunny_pool_quarry",
  instructions: [
    {
      name: "newPool",
      accounts: [
        {
          name: "creator",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rewarder",
          isMut: false,
          isSigner: false,
        },
        {
          name: "quarry",
          isMut: false,
          isSigner: false,
        },
        {
          name: "pool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "internalMint",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "bump",
          type: "u8",
        },
      ],
    },
    {
      name: "initVault",
      accounts: [
        {
          name: "pool",
          isMut: false,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "bump",
          type: "u8",
        },
      ],
    },
    {
      name: "initMiner",
      accounts: [
        {
          name: "pool",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: false,
          isSigner: false,
        },
        {
          name: "miner",
          isMut: true,
          isSigner: false,
        },
        {
          name: "quarry",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewarder",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "minerVault",
          isMut: false,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mineProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "bump",
          type: "u8",
        },
      ],
    },
    {
      name: "depositVendor",
      accounts: [
        {
          name: "vaultOwner",
          isMut: false,
          isSigner: true,
        },
        {
          name: "vaultVendorTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stake",
          accounts: [
            {
              name: "pool",
              isMut: true,
              isSigner: false,
            },
            {
              name: "vault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "rewarder",
              isMut: false,
              isSigner: false,
            },
            {
              name: "quarry",
              isMut: true,
              isSigner: false,
            },
            {
              name: "miner",
              isMut: true,
              isSigner: false,
            },
            {
              name: "minerVault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "tokenProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "mineProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "clock",
              isMut: false,
              isSigner: false,
            },
          ],
        },
      ],
      args: [],
    },
    {
      name: "stakeInternal",
      accounts: [
        {
          name: "vaultOwner",
          isMut: false,
          isSigner: true,
        },
        {
          name: "internalMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "internalMintTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stake",
          accounts: [
            {
              name: "pool",
              isMut: true,
              isSigner: false,
            },
            {
              name: "vault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "rewarder",
              isMut: false,
              isSigner: false,
            },
            {
              name: "quarry",
              isMut: true,
              isSigner: false,
            },
            {
              name: "miner",
              isMut: true,
              isSigner: false,
            },
            {
              name: "minerVault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "tokenProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "mineProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "clock",
              isMut: false,
              isSigner: false,
            },
          ],
        },
      ],
      args: [],
    },
    {
      name: "unstakeInternal",
      accounts: [
        {
          name: "vaultOwner",
          isMut: false,
          isSigner: true,
        },
        {
          name: "internalMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "internalMintTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stake",
          accounts: [
            {
              name: "pool",
              isMut: true,
              isSigner: false,
            },
            {
              name: "vault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "rewarder",
              isMut: false,
              isSigner: false,
            },
            {
              name: "quarry",
              isMut: true,
              isSigner: false,
            },
            {
              name: "miner",
              isMut: true,
              isSigner: false,
            },
            {
              name: "minerVault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "tokenProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "mineProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "clock",
              isMut: false,
              isSigner: false,
            },
          ],
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "withdrawVendor",
      accounts: [
        {
          name: "vaultOwner",
          isMut: false,
          isSigner: true,
        },
        {
          name: "vaultVendorTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stake",
          accounts: [
            {
              name: "pool",
              isMut: true,
              isSigner: false,
            },
            {
              name: "vault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "rewarder",
              isMut: false,
              isSigner: false,
            },
            {
              name: "quarry",
              isMut: true,
              isSigner: false,
            },
            {
              name: "miner",
              isMut: true,
              isSigner: false,
            },
            {
              name: "minerVault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "tokenProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "mineProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "clock",
              isMut: false,
              isSigner: false,
            },
          ],
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "withdrawFromVault",
      accounts: [
        {
          name: "owner",
          isMut: false,
          isSigner: true,
        },
        {
          name: "pool",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vaultTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenDestination",
          isMut: true,
          isSigner: false,
        },
        {
          name: "feeDestination",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "claimRewards",
      accounts: [
        {
          name: "mintWrapper",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mintWrapperProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "minter",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardsTokenMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardsTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "claimFeeTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stake",
          accounts: [
            {
              name: "pool",
              isMut: true,
              isSigner: false,
            },
            {
              name: "vault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "rewarder",
              isMut: false,
              isSigner: false,
            },
            {
              name: "quarry",
              isMut: true,
              isSigner: false,
            },
            {
              name: "miner",
              isMut: true,
              isSigner: false,
            },
            {
              name: "minerVault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "tokenProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "mineProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "clock",
              isMut: false,
              isSigner: false,
            },
          ],
        },
      ],
      args: [],
    },
    {
      name: "updateClaimFee",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true,
        },
        {
          name: "pool",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "claimFee",
          type: {
            defined: "MegaBPS",
          },
        },
      ],
    },
  ],
  accounts: [
    {
      name: "Pool",
      type: {
        kind: "struct",
        fields: [
          {
            name: "creator",
            type: "publicKey",
          },
          {
            name: "quarry",
            type: "publicKey",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "rewarder",
            type: "publicKey",
          },
          {
            name: "rewardsMint",
            type: "publicKey",
          },
          {
            name: "vendorMint",
            type: "publicKey",
          },
          {
            name: "internalMint",
            type: "publicKey",
          },
          {
            name: "admin",
            type: "publicKey",
          },
          {
            name: "pendingAdmin",
            type: "publicKey",
          },
          {
            name: "fees",
            type: {
              defined: "Fees",
            },
          },
          {
            name: "vaultCount",
            type: "u64",
          },
          {
            name: "totalVendorBalance",
            type: "u64",
          },
          {
            name: "totalInternalBalance",
            type: "u64",
          },
          {
            name: "totalRewardsClaimed",
            type: "u64",
          },
          {
            name: "totalRewardsFeesPaid",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "Vault",
      type: {
        kind: "struct",
        fields: [
          {
            name: "pool",
            type: "publicKey",
          },
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "index",
            type: "u64",
          },
          {
            name: "vendorBalance",
            type: "u64",
          },
          {
            name: "internalBalance",
            type: "u64",
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "Fees",
      type: {
        kind: "struct",
        fields: [
          {
            name: "claimFee",
            type: {
              defined: "MegaBPS",
            },
          },
          {
            name: "vendorFee",
            type: {
              defined: "MegaBPS",
            },
          },
          {
            name: "withdrawFee",
            type: {
              defined: "MegaBPS",
            },
          },
        ],
      },
    },
    {
      name: "MegaBPS",
      type: {
        kind: "struct",
        fields: [
          {
            name: "megaBps",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "WithdrawalType",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Vendor",
          },
          {
            name: "VendorRewards",
          },
          {
            name: "Other",
          },
        ],
      },
    },
  ],
  events: [
    {
      name: "NewPoolEvent",
      fields: [
        {
          name: "pool",
          type: "publicKey",
          index: false,
        },
        {
          name: "creator",
          type: "publicKey",
          index: false,
        },
        {
          name: "rewarder",
          type: "publicKey",
          index: false,
        },
        {
          name: "rewardsMint",
          type: "publicKey",
          index: false,
        },
        {
          name: "vendorMint",
          type: "publicKey",
          index: false,
        },
      ],
    },
    {
      name: "NewVaultEvent",
      fields: [
        {
          name: "vault",
          type: "publicKey",
          index: false,
        },
        {
          name: "pool",
          type: "publicKey",
          index: false,
        },
        {
          name: "vendorMint",
          type: "publicKey",
          index: false,
        },
        {
          name: "owner",
          type: "publicKey",
          index: false,
        },
      ],
    },
    {
      name: "DepositEvent",
      fields: [
        {
          name: "vault",
          type: "publicKey",
          index: false,
        },
        {
          name: "owner",
          type: "publicKey",
          index: false,
        },
        {
          name: "mint",
          type: "publicKey",
          index: false,
        },
        {
          name: "amount",
          type: "u64",
          index: false,
        },
      ],
    },
    {
      name: "WithdrawEvent",
      fields: [
        {
          name: "vault",
          type: "publicKey",
          index: false,
        },
        {
          name: "owner",
          type: "publicKey",
          index: false,
        },
        {
          name: "mint",
          type: "publicKey",
          index: false,
        },
        {
          name: "amount",
          type: "u64",
          index: false,
        },
      ],
    },
    {
      name: "MintPoolEvent",
      fields: [
        {
          name: "vault",
          type: "publicKey",
          index: false,
        },
        {
          name: "amount",
          type: "u64",
          index: false,
        },
      ],
    },
    {
      name: "BurnPoolEvent",
      fields: [
        {
          name: "vault",
          type: "publicKey",
          index: false,
        },
        {
          name: "amount",
          type: "u64",
          index: false,
        },
      ],
    },
    {
      name: "ClaimEvent",
      fields: [
        {
          name: "vault",
          type: "publicKey",
          index: false,
        },
        {
          name: "mint",
          type: "publicKey",
          index: false,
        },
        {
          name: "amount",
          type: "u64",
          index: false,
        },
        {
          name: "initialBalance",
          type: "u64",
          index: false,
        },
        {
          name: "endBalance",
          type: "u64",
          index: false,
        },
      ],
    },
    {
      name: "WithdrawFromVaultEvent",
      fields: [
        {
          name: "vault",
          type: "publicKey",
          index: false,
        },
        {
          name: "mint",
          type: "publicKey",
          index: false,
        },
        {
          name: "withdrawalType",
          type: {
            defined: "WithdrawalType",
          },
          index: false,
        },
        {
          name: "destination",
          type: "publicKey",
          index: false,
        },
        {
          name: "amount",
          type: "u64",
          index: false,
        },
        {
          name: "fees",
          type: "u64",
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 300,
      name: "Unauthorized",
      msg: "Unauthorized.",
    },
    {
      code: 301,
      name: "InsufficientBalance",
      msg: "Insufficient balance.",
    },
    {
      code: 302,
      name: "VaultInvariant",
      msg: "Vault invariant failed.",
    },
    {
      code: 303,
      name: "DecimalsMismatch",
      msg: "Decimals mismatch.",
    },
    {
      code: 304,
      name: "InvalidMiner",
      msg: "Invalid miner for the given quarry.",
    },
    {
      code: 305,
      name: "InvalidWithdrawMint",
      msg: "Withdraw mint must not be the internal mint.",
    },
  ],
};
export const SunnyPoolQuarryErrors = generateErrorMap(SunnyPoolQuarryJSON);

export const SUNNY_CODER = new Coder(SunnyPoolQuarryJSON);

type SunnyTypes = AnchorTypes<SunnyPoolQuarryIDL>;

export type SunnyPoolData = SunnyTypes["Accounts"]["Pool"];
export type SunnyVaultData = SunnyTypes["Accounts"]["Vault"];
