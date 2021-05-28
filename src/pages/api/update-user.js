import db from '../../services/db';
import { validateRequest } from '../../services/auth/validate';

async function updateUser(req, res) {
    const ctx = await validateRequest(req);
    if (!ctx.user) return res.status(401);

    const params = JSON.parse(req.body);
    // Currently, only allow signed-in user to update themselves.
    if (params.id !== ctx.user.id) return res.status(401);

    const data = await db.users.update(params);
    return res.status(200).json({ data });
}

export default updateUser;
