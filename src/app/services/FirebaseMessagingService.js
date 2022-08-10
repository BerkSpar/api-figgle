require('dotenv/config');
import UserToken from '../models/user_token';
import axios from 'axios';

class FirebaseMessagingService {
  async sendToUser(user_id, { title, body }) {
    const tokens = await UserToken.findAll({
      where: {
        userId: user_id,
      },
    });

    tokens.forEach((e) => {
      this.sendMessage(e.value, {
        title,
        body,
      });
    });
  }

  async sendMessage(fcm_id, { title, body }) {
    try {
      const result = await axios.post(
        'https://fcm.googleapis.com/fcm/send',
        {
          to: fcm_id,
          notification: { title: title, body: body },
        },
        {
          headers: {
            Authorization: 'key=' + process.env.FIREBASE_AUTH,
          },
        }
      );

      return result.data;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

export default new FirebaseMessagingService();
