import jwt from 'jsonwebtoken';
import User from '../models/User';
import tokenConfig from '../../config/tokenConfig';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'user does not exists' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ message: 'password does not match' });
    }

    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email
      },
      token: jwt.sign({ id }, tokenConfig.secret, {
        expiresIn: tokenConfig.expiresIn
      })
    });
  }
}

export default new SessionController();
