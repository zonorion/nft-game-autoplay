export const MANAGER_ABI = [
    {
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'enum Manager.Status',
                name: 'status',
                type: 'uint8',
            },
        ],
        name: 'GameStatusUpdated',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                internalType: 'string',
                name: 'nonce',
                type: 'string',
            },
            {
                internalType: 'bytes32',
                name: 'hash',
                type: 'bytes32',
            },
            {
                internalType: 'bytes',
                name: 'signature',
                type: 'bytes',
            },
        ],
        name: 'addRewards',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_supporter',
                type: 'address',
            },
        ],
        name: 'addSupporter',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address[]',
                name: '_supporters',
                type: 'address[]',
            },
        ],
        name: 'addSupporters',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: '_name',
                type: 'string',
            },
            {
                internalType: 'uint256',
                name: '_price',
                type: 'uint256',
            },
            {
                internalType: 'uint256[]',
                name: '_levels',
                type: 'uint256[]',
            },
            {
                internalType: 'uint256[]',
                name: '_changes',
                type: 'uint256[]',
            },
        ],
        name: 'addWarriorCard',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'claimRewards',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'string',
                name: 'kind',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'name',
                type: 'string',
            },
            {
                internalType: 'uint256',
                name: 'hp',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'attack',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'defense',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'level',
                type: 'uint256',
            },
            {
                internalType: 'string',
                name: 'nonce',
                type: 'string',
            },
            {
                internalType: 'bytes32',
                name: 'hash',
                type: 'bytes32',
            },
            {
                internalType: 'bytes',
                name: 'signature',
                type: 'bytes',
            },
        ],
        name: 'claimWarrior',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'price',
                type: 'uint256',
            },
            {
                internalType: 'string',
                name: 'kind',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'name',
                type: 'string',
            },
            {
                internalType: 'uint256',
                name: 'hp',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'attack',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'defense',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'level',
                type: 'uint256',
            },
            {
                internalType: 'string',
                name: 'nonce',
                type: 'string',
            },
            {
                internalType: 'bytes32',
                name: 'hash',
                type: 'bytes32',
            },
            {
                internalType: 'bytes',
                name: 'signature',
                type: 'bytes',
            },
        ],
        name: 'createWarrior',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'dragonSlayer',
        outputs: [
            {
                internalType: 'contract IERC20',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getRewards',
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
        name: 'getStatus',
        outputs: [
            {
                internalType: 'enum Manager.Status',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: '_name',
                type: 'string',
            },
        ],
        name: 'getWarriorCard',
        outputs: [
            {
                components: [
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string',
                    },
                    {
                        internalType: 'uint256',
                        name: 'price',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256[]',
                        name: 'levels',
                        type: 'uint256[]',
                    },
                    {
                        internalType: 'uint256[]',
                        name: 'changes',
                        type: 'uint256[]',
                    },
                    {
                        internalType: 'bool',
                        name: 'isValue',
                        type: 'bool',
                    },
                    {
                        internalType: 'uint256',
                        name: 'index',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct Manager.WarriorCard',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getWarriorCards',
        outputs: [
            {
                internalType: 'string[]',
                name: '',
                type: 'string[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'marketFee',
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
        name: 'marketFeeAddress',
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
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
        ],
        name: 'onlySpawer',
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
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
        ],
        name: 'onlySupporter',
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
        inputs: [
            {
                internalType: 'bytes32',
                name: 'hash',
                type: 'bytes32',
            },
            {
                internalType: 'bytes',
                name: 'sig',
                type: 'bytes',
            },
        ],
        name: 'recoverSigner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'h',
                type: 'bytes32',
            },
            {
                internalType: 'uint8',
                name: 'v',
                type: 'uint8',
            },
            {
                internalType: 'bytes32',
                name: 'r',
                type: 'bytes32',
            },
            {
                internalType: 'bytes32',
                name: 's',
                type: 'bytes32',
            },
        ],
        name: 'recoverSigner2',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: '_name',
                type: 'string',
            },
        ],
        name: 'removeWarriorCards',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_duration',
                type: 'uint256',
            },
        ],
        name: 'setClaimRewardsDuration',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_fee',
                type: 'uint256',
            },
        ],
        name: 'setMarketFee',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_feeAddress',
                type: 'address',
            },
        ],
        name: 'setMarketFeeAddress',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_contract',
                type: 'address',
            },
        ],
        name: 'setMasterContract',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_contract',
                type: 'address',
            },
        ],
        name: 'setNFTContract',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'enum Manager.Status',
                name: '_status',
                type: 'uint8',
            },
        ],
        name: 'setStatus',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'hash',
                type: 'bytes32',
            },
            {
                internalType: 'bytes',
                name: 'signature',
                type: 'bytes',
            },
            {
                internalType: 'address',
                name: 'signer',
                type: 'address',
            },
        ],
        name: 'verifySignature',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        stateMutability: 'payable',
        type: 'receive',
    },
]
