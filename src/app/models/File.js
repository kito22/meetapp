import Sequelize, { Model } from 'sequelize';
import { get } from 'http';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.STRING,
          get() {
            return `http://localhost:3333/files/${this.path}`;
          }
        }
      },
      { sequelize }
    );
  }
}

export default File;
