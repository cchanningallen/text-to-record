import { validateRequest } from '../../services/auth/validate';

async function getAuthStatus(req, res) {
    const ctx = await validateRequest(req);
    if (!ctx.user) return res.status(401);
    const { id, email, emailVerified, phone, role } = ctx.user;

    res.status(200).json({
        id,
        email,
        emailVerified,
        phone,
        role,
    });
}

export default getAuthStatus;
