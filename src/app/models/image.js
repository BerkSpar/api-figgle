import Sequelize, { Model } from 'sequelize';

class Image extends Model {
  static init(sequelize) {
    super.init(
      {
        data: Sequelize.TEXT({
          length: 'medium',
        }), 
        url: {
          type: Sequelize.VIRTUAL(Sequelize.STRING, ['url']),
          get: function() {
            return process.env.HOST + '/image/' + this.get('id');
          }
        }, 
      },
      {
        sequelize,
        modelName: 'image',
        defaultScope: {
          attributes: { exclude: ['data', 'deleted_at', 'created_at', 'updated_at'] },
        }, 
        scopes: {
          withData: {
            attributes: { exclude: ['deleted_at'] },
          }
        }
      }
    );

    return this;
  }

  static associate(models) {

  }
}

export default Image;
