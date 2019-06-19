<template>
  <div :class="{ loading: pending }">
    <b-row v-if="error" class="error">
      <b-col>News with id "{{ id }}" not found {{ error }} {{ /* TODO print user friendly error message */ }}</b-col>
    </b-row>
    <b-card v-if="!pending && news" no-body class="pb-3 mb-2 border-0">
      <b-card-header class="border-0 d-inline-flex p-0">
        <b-card-img :src="getImagePath(news)" class="rounded-lg card-image" />
        <b-card-body>
          <b-card-title title-tag="h2" class="display-2 text-white" style="font-size: 2.25rem;">
            {{ news.title }}
          </b-card-title>
          <p v-if="news.subtitle" class="card-subtitle text-white pb-4">
            {{ news.subtitle }}
          </p>
        </b-card-body>
      </b-card-header>
      <b-card-body class="text-white pl-0">
        <!--        <carousel v-if="news.images && news.images.slides" v-bind="carouselOptions" class="mt-4 mb-2">-->
        <!--          <slide v-for="(slide, index) in getImagePath(news, 'slides')" :key="'slide-' + index" class="pr-1 pl-1">-->
        <!--            <b-card :img-src="slide" class="no-border" no-body />-->
        <!--          </slide>-->
        <!--        </carousel>-->
        <b-card-text class="mt-4 mb-2">
          <template v-if="news.blocks">
            <b-row v-for="(block, index) in news.blocks" :key="'block-' + index">
              <b-col class="border-bottom mt-3 mb-3">
                <h4>
                  {{ block.title }}
                </h4>
                <p class="p-2" v-html="normalizeText(block.text)" />
              </b-col>
            </b-row>
          </template>
          <div v-html="news.description"></div>
        </b-card-text>
      </b-card-body>
    </b-card>
    <b-row v-else>
      <b-col> News with id "{{ id }}" not found </b-col>
    </b-row>
  </div>
</template>

<script>
// import { Carousel, Slide } from "vue-carousel";
import user from "../mixins/user";
import news from "../mixins/news";
import { mapActions, mapState } from "vuex";
import { LOAD_NEWS_ITEM } from "../store/actions-types";

const carouselOptions = {
  autoplay: true,
  autoplayHoverPause: true,
  autoplayTimeout: 5000,
  loop: true,
  paginationEnabled: true,
  perPage: 2,
  scrollPerPage: false
};

export default {
  name: "News",
  components: {
    // Carousel,
    // Slide
  },
  mixins: [user, news],
  // data() {
  //   return {
  //     carouselOptions: null,
  //     img:
  //       "https://hb.imgix.net/e8d2f653d2d74a0aa26150fe7998ddfbf72674b1.jpg?auto=compress,format&fit=crop&h=353&w=616&s=5815a257aa9eeeac939970dea5e59048",
  //     title: "Daily Deal - Rise of Industry",
  //     publisher: "VoxPop",
  //     text:
  //       "Look for the deals each day on the front page of Steam. Or follow us on twitter or Facebook for instant notifications wherever you are!",
  //     releaseDate: "17 Feb 2019"
  //   };
  // },
  computed: {
    id() {
      return this.$route.params.id;
    },
    ...mapState({
      news: "newsItem",
      pending: state => state.pending.newsItem,
      error: state => state.error.newsItem
    })
    // news() {
    //   return this.$store.getters.getNewsById(this.id);
    // }
  },

  watch: {
    $route: "fetchData"
  },

  created() {
    this.carouselOptions = carouselOptions;
    this.fetchData();
  },

  methods: {
    normalizeText(text) {
      if (text) {
        return text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;")
          .replace(/\n/g, "<br>");
      }
      return "";
    },
    fetchData() {
      const itemId = this.$route.params.id || 0;
      this.loadNewsItem({ params: { id: itemId } });
    },
    ...mapActions({ loadNewsItem: LOAD_NEWS_ITEM })
  }
};
</script>

<style scoped lang="scss">
/deep/ .VueCarousel-pagination {
  text-align: left;

  .VueCarousel-dot-container {
    margin-top: 10px !important;

    .VueCarousel-dot {
      background-color: #696e80 !important;
      height: 12px !important;
      width: 12px !important;
      padding: 0 !important;
      margin: 10px;

      &:focus {
        outline: unset;
      }

      &.VueCarousel-dot--active {
        background-color: white !important;
        box-shadow: 0 0 10px white;
      }
    }
  }
}

.card-header {
  background-color: unset;
}

.card-image {
  height: 214px;
  /*width: 273px;*/
  width: auto;
}
</style>
