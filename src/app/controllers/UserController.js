import * as Yup from 'yup';
import User from '../models/user';
import Image from '../models/image';
import jwt from 'jsonwebtoken';

class UserController {
  async signup(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string().required(),
      image: Yup.object().shape({
        data: Yup.string().notRequired(),
      }),
    });

    try {
      await schema.validate(req.body);
    } catch (e) {
      return res.status(400).json({ message: e.errors[0] });
    }

    let user = await User.findOne({ where: { email: req.body.email } });

    if (user) {
      return res
        .status(400)
        .json({ message: 'Existe outra conta com esse email' });
    }

    let { name, email, password, image } = req.body;

    var includes = [];

    if (image) {
      includes.push(Image);
    }

    user = await User.create(
      {
        name,
        email,
        password,
        image,
      },
      {
        include: includes,
      }
    );

    user = await User.findByPk(user.id);
    user.password_hash = undefined;

    return res.status(200).json(user);
  }

  async find(req, res) {
    var id = req.user.id;

    let user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    user = user.toJSON();

    user.password_hash = undefined;

    const token = jwt.sign(
      {
        user: {
          id: user.id,
        },
      },
      process.env.JWT_SECRET,
      {}
    );

    user.token = token;

    return res.status(200).json(user);
  }

  async signin(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (e) {
      return res.status(400).json({ message: e.errors[0] });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ message: 'Email e/ou senha inválidos' });
    }

    user.password = undefined;
    user.password_hash = undefined;

    const token = jwt.sign(
      {
        user: {
          id: user.id,
        },
      },
      process.env.JWT_SECRET,
      {}
    );

    let result = user.toJSON();
    result.token = token;

    return res.status(200).json(result);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().notRequired(),
      email: Yup.string().notRequired(),
      password: Yup.string().notRequired(),
      image: Yup.object().shape({
        data: Yup.string().notRequired(),
      }),
    });

    try {
      await schema.validate(req.body);
    } catch (e) {
      return res.status(400).json({ message: e.errors[0] });
    }

    var user = await User.findByPk(req.params.user_id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const { name, email, password, image } = req.body;

    user = await user.update({
      name,
      email,
      password,
      image,
    });

    if (image) {
      let newImage = await Image.create(image);

      await user.update({
        imageId: newImage.id,
      });
    }

    user = await User.findByPk(user.id);
    user.password_hash = undefined;

    return res.status(200).json(user);
  }
}

export default new UserController();
