export function requireAdmin(req, res, next) {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ error: "Endpoint is restricted to admin access only" });
    }
    next();
}