import { validateRequest } from '../../services/auth/validate';
import db from '../../services/db';

async function getRecords(req, res) {
    const ctx = await validateRequest(req);
    if (!ctx.user) return res.status(401);
    const records = await db.records.get({ userID: ctx.user.id });
    res.status(200).json({ records });
}

export default getRecords;
