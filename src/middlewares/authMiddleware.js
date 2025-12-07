import jwt from "jsonwebtoken";

export function authMiddleWare(req, res, next) {

    // Allow methodOverride to convert POST -> PUT/DELETE before auth checks
    if (req.body && req.body._method) {
        req.method = req.body._method.toUpperCase();
    }

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
