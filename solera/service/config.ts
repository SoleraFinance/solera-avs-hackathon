type Chain = {
    url: string,
    tokenAddress: string
};

export const chains = new Map<BigInt, Chain>([
    [42161n, {
        url: "http://127.0.0.1:8546",
        tokenAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    }],
    [137n, {
        url: "http://127.0.0.1:8547",
        tokenAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    }]
]);
