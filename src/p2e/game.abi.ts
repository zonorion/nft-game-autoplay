export const GAME_ABI = [
    {
        inputs: [
            {
                internalType: 'address',
                name: '_characters',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_itemGamePlay',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_maincoin',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: '_tokenId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'target',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'xpGain',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'ballGain',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'bool',
                name: 'isWin',
                type: 'bool',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'origin',
                type: 'address',
            },
        ],
        name: 'FightOutcome',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: '_tokenId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'rare',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'origin',
                type: 'address',
            },
        ],
        name: 'hatched',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_to',
                type: 'address',
            },
        ],
        name: '_evolve',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_tokenId',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_class',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_rare',
                type: 'uint256',
            },
        ],
        name: '_hatch',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_adrress',
                type: 'address',
            },
        ],
        name: 'approvePaymentForMainCoin',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'characters',
        outputs: [
            {
                internalType: 'contract ICharacters',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_user',
                type: 'address',
            },
        ],
        name: 'checkBannedUser',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_tokenId',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_stamina',
                type: 'uint256',
            },
        ],
        name: 'claimExtraStamina',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_tokenId',
                type: 'uint256',
            },
            {
                internalType: 'uint256[]',
                name: '_itemIds',
                type: 'uint256[]',
            },
            {
                internalType: 'uint256',
                name: '_winrate',
                type: 'uint256',
            },
        ],
        name: 'combat',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_adrress',
                type: 'address',
            },
        ],
        name: 'energyWithdraw',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'evolve',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'packageId',
                type: 'uint256',
            },
        ],
        name: 'evolvePackage',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_tokenId',
                type: 'uint256',
            },
        ],
        name: 'getExtraStaminaOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_tokenId',
                type: 'uint256',
            },
        ],
        name: 'hatch',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'hatchFee',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bool',
                name: '_maintenance',
                type: 'bool',
            },
        ],
        name: 'isMaintenancemaintenance',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'itemGamePlay',
        outputs: [
            {
                internalType: 'contract IItemGamePlay',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_tokenId',
                type: 'uint256',
            },
        ],
        name: 'listTargetOfCharacter',
        outputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'targetId',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'expMin',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'expMax',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'rewardMin',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'rewardMax',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'winRate',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct GamePlayContract.Target[5]',
                name: '',
                type: 'tuple[5]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'maincoin',
        outputs: [
            {
                internalType: 'contract IMaincoin',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'mintCharacterFee',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalAB',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_newOwner',
                type: 'address',
            },
        ],
        name: 'transferCharactersOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_tokenId',
                type: 'uint256',
            },
            {
                internalType: 'bool',
                name: '_status',
                type: 'bool',
            },
        ],
        name: 'updateBannedCharacter',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_user',
                type: 'address',
            },
            {
                internalType: 'bool',
                name: '_status',
                type: 'bool',
            },
        ],
        name: 'updateBannedUser',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_rare1',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_rare2',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_rare3',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_rare4',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_rare5',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_rare6',
                type: 'uint256',
            },
        ],
        name: 'updateBaseReward',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_characters',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_itemGamePlay',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_maincoin',
                type: 'address',
            },
        ],
        name: 'updateData',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_tokenId',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_stamina',
                type: 'uint256',
            },
        ],
        name: 'updateExtraStamina',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'rare6',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'rare5',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'rare4',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'rare3',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'rare2',
                type: 'uint256',
            },
        ],
        name: 'updateGachaRate',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_newHatchFee',
                type: 'uint256',
            },
        ],
        name: 'updateHatchFee',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_newMintCharacterFee',
                type: 'uint256',
            },
        ],
        name: 'updateMintCharacterFee',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_packageId',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_mintCharacterFee',
                type: 'uint256',
            },
            {
                internalType: 'bool',
                name: '_isEnable',
                type: 'bool',
            },
        ],
        name: 'updatePackageContent',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'targetID',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'MinEXP',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'MaxEXP',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'MinReward',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'MaxReward',
                type: 'uint256',
            },
        ],
        name: 'updateRewardByTargets',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_staminaManager',
                type: 'address',
            },
        ],
        name: 'updateStaminaManager',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
]
