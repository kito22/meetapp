import Sequelize, { Model } from 'sequelize';
import { isBefore } from 'date-fns';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        location: Sequelize.STRING,
        date: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          }
        }
      },
      { sequelize }
    );
    return this;
  }

  static associate(model) {
    this.hasMany(model.Subscription, { foreignKey: 'meetup_id', as: 'meetup' });
    this.belongsTo(model.File, { foreignKey: 'banner_id', as: 'banner' });
    this.belongsTo(model.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default Meetup;
