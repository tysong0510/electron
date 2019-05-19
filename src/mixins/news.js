import { baseURL } from "../apiConfig";

export default {
  methods: {
    getImagePath(news, type = "main") {
      if (news.images) {
        switch (type) {
          case "main":
            return news.images.main ? `${baseURL}/news/${news.id}/${news.images.main}` : null;
          case "slides":
            if (news.images.slides || news.images.images) {
              const slides = [];

              for (const slide of news.images.slides || news.images.images) {
                slides.push(`${baseURL}/news/${news.id}/${slide}`);
              }

              return slides;
            }
            return null;
        }
      } else {
        return null;
      }
    }
  }
};
