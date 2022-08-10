import jwt from 'jsonwebtoken';
import User from '../models/user';

require('dotenv/config');

class Auth {
  verify(req, res, next) {
    const token = req.headers['x-access-token'];

    if (!token) {
      return res.status(401).json({ message: 'Sem token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
      if (err) {
        return res.status(401).json({ message: 'Não autorizado' });
      }

      let user = await User.findByPk(decoded.user.id);

      if (!user) {
        return res.status(401).json({ message: 'Não autorizado' });
      }

      req.user = user;
      next();
    });
  }
}

export default new Auth();
