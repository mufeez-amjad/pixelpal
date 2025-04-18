import { Request, Response } from 'express';
import { ApiError } from './apierror';

export function handle<Params, Body, Returns>(
	fn: (params: Params, body: Body) => Promise<Returns>
): (
	req: Request<Params>,
	res: Response<Returns | { name?: string; error: string }>
) => Promise<void> {
	return async (req, res) => {
		res.set('Access-Control-Allow-Origin', '*');
		
		try {
			const returns = await fn(req.params, req.body);
			res.json(returns);
		} catch (e) {
			if (e instanceof ApiError) {
				res.status(e.status).json({ error: e.message });
			} else if (typeof e === 'string') {
				res.status(500).json({ error: e });
			} else {
				res.status(500).json({ error: 'got unknown error' });
			}
		}
	};
}

