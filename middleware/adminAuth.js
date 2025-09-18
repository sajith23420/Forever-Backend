import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {
        // Accept token from either Authorization header (Bearer ...) or a custom 'token' header
        const authHeader = req.headers.authorization || req.headers.token;

        if (!authHeader) {
            return res.status(401).json({ success: false, message: "Not authorized. Login again." });
        }

        // If header is in the form 'Bearer <token>' extract the token part
        let token = authHeader;
        if (typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('bearer ')) {
            token = authHeader.split(' ')[1];
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // adminLogin signs the concatenation of email+password, so token_decode should be that string
        const expected = String(process.env.ADMIN_EMAIL) + String(process.env.ADMIN_PASSWORD);
        if (token_decode !== expected) {
            return res.status(403).json({ success: false, message: "Not authorized. Login again." });
        }

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Authentication failed" });
    }

}

export default adminAuth; 
