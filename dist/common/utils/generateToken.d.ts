interface JwtUser {
    id: number;
    email: string;
}
declare const generateToken: (user: JwtUser) => string;
export default generateToken;
//# sourceMappingURL=generateToken.d.ts.map