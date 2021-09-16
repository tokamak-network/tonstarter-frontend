type Remove = {
    token1iD: string;
    token2iD: string;
    token1Amount: string;
    token2Amount: string;
    userAddress: string | null | undefined;
    library: any;
    handleCloseModal: any;
}
export const remove = (args: Remove) => {
console.log(args);

}