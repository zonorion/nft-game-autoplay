export const DECODELOG_ABI = [
    {
        indexed: true,
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
    },
    {
        indexed: false,
        internalType: 'enum Battle.MonsterLevel',
        name: 'monster',
        type: 'uint8',
    },
    {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address',
    },
    {
        indexed: false,
        internalType: 'enum Battle.BattleResult',
        name: 'result',
        type: 'uint8',
    },
    {
        indexed: false,
        internalType: 'uint256',
        name: 'reward',
        type: 'uint256',
    },
]
