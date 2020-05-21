import { baseURL } from "../apiConfig";

export default {
  methods: {
    getImagePath(user) {
      return user.images.main ? `${baseURL}/news/${user.id}/${user.images.main}` : " ";
    }
  }
};
