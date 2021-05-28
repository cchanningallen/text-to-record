import db from '../../services/db';
import { validateRequest } from '../../services/auth/validate';

async function createRecord(req, res) {
    const ctx = await validateRequest(req);
    if (!ctx.user) return res.status(401);

    const { title, text, raw, type, createdAt } = JSON.parse(req.body);
    const params = {
        title,
        text,
        raw,
        type,
        createdAt,
        userID: ctx.user.id,
    };
    const data = await db.records.create(params);
    return res.status(200).json({ data });
}

export default createRecord;
