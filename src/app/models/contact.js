import Sequelize, { Model } from 'sequelize';
import Address from './address';
import Image from './image';
import User from './user';

class Contact extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        remember_at: Sequelize.DATE,
      },
      {
        sequelize,
        modelName: 'contact',
        defaultScope: {
          include: [Image, Address],
          attributes: { 
            exclude: ['deleted_at'],
          },
        }, 
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(User);
    this.belongsTo(Image);
    this.belongsTo(Address);
  }
}

export default Contact;
