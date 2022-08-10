import FilterParser from '../services/FilterParser';
import * as Yup from 'yup';
import Contact from '../models/contact';
import Address from '../models/address';
import Image from '../models/image';

class ContactController {
  async create(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().notRequired(),
      address: Yup.object().shape({
        street: Yup.string().notRequired(),
        number: Yup.string().notRequired(),
        district: Yup.string().notRequired(),
        zip: Yup.string().notRequired(),
        city: Yup.string().notRequired(),
        state: Yup.string().notRequired(),
        country: Yup.string().notRequired(),
        complement: Yup.string().notRequired(),
      }),
      image: Yup.object().shape({
        data: Yup.string().notRequired(),
      }),
      remembeer_at: Yup.date().notRequired(),
    });

    try {
      await schema.validate(req.body);
    } catch (e) {
      return res.status(400).json({ message: e.errors[0] });
    }

    let { name, email, image, address, remembeer_at } = req.body;

    var includes = [];

    if (image) {
      includes.push(Image);
    }

    if (address) {
      includes.push(Address);
    }

    var contact = await Contact.create(
      {
        name,
        email,
        image,
        address,
        remembeer_at,
        userId: req.user.id,
      },
      { include: includes }
    );

    contact = await Contact.findByPk(contact.id);

    return res.status(200).json(contact);
  }

  async find(req, res) {
    const id = req.params.contact_id;

    let contact = await Contact.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contato não encontrado' });
    }

    return res.status(200).json(contact);
  }

  async index(req, res) {
    var limit = req.query.limit
      ? (limit = parseInt(req.query.limit))
      : undefined;

    var offset = req.query.offset
      ? (offset = parseInt(req.query.offset))
      : undefined;

    var order = undefined;
    if (req.query.order) {
      order = JSON.parse(req.query.order);
    }

    var where = {};
    if (req.query.filter) {
      where = JSON.parse(req.query.filter);
      where = FilterParser.replacer(where);
    }

    where['userId'] = req.user.id;

    var contacts = await Contact.findAll({
      limit,
      offset,
      order,
      where,
      subQuery: false,
    });

    return res.status(200).json(contacts);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().notRequired(),
      email: Yup.string().notRequired(),
      address: Yup.object().shape({
        street: Yup.string().notRequired(),
        number: Yup.string().notRequired(),
        district: Yup.string().notRequired(),
        zip: Yup.string().notRequired(),
        city: Yup.string().notRequired(),
        state: Yup.string().notRequired(),
        country: Yup.string().notRequired(),
        complement: Yup.string().notRequired(),
      }),
      image: Yup.object().shape({
        data: Yup.string().notRequired(),
      }),
      remembeer_at: Yup.date().notRequired(),
    });

    try {
      await schema.validate(req.body);
    } catch (e) {
      return res.status(400).json({ message: e.errors[0] });
    }

    let contact = await Contact.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contato não encontrado' });
    }

    let { name, email, image, address, remembeer_at } = req.body;

    contact = await contact.update({
      name,
      email,
      remembeer_at,
    });

    contact = await Contact.findByPk(contact.id);

    if (image) {
      let newImage = await Image.create(image);

      await contact.update({
        imageId: newImage.id,
      });
    }

    if (address) {
      let newAddress = await Address.create(address);

      await contact.update({
        addressId: newAddress.id,
      });
    }

    return res.status(200).json(contact);
  }

  async destroy(req, res) {
    const id = req.params.contact_id;

    let contact = await Contact.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contato não encontrado' });
    }

    await contact.destroy();

    return res.status(200).json({ message: 'Contato apagado com sucesso!' });
  }
}

export default new ContactController();
