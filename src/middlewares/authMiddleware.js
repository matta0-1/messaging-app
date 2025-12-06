import jwt from "jsonwebtoken";

export function authMiddleWare(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        return res.redirect('/auth/login');
    }

    //const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.clearCookie("token"); 
            return res.redirect('/auth/login');
        }

        req.user = decoded;
        return next();
    });
}
