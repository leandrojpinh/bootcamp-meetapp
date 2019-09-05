import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      user_name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const userEmail = await User.findOne({
      where: { email: req.body.email },
    });
    if (userEmail) {
      return res.status(400).json({ error: `User's e-mail already exists.` });
    }

    const userUsername = await User.findOne({
      where: { user_name: req.body.user_name },
    });
    if (userUsername) {
      return res.status(400).json({ error: `User's username already exists.` });
    }

    const { id, name, user_name, email, provider } = await User.create(
      req.body
    );

    return res.json({
      id,
      name,
      user_name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      userName: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(8),
      password: Yup.string()
        .min(8)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { email, userName, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (userName !== user.user_name) {
      const userExists = await User.findOne({
        where: { userName },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Password does not match.' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      user_name: userName,
      email,
      provider,
    });
  }
}

export default new UserController();
