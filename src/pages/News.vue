<template>
  <div>
    <div class="d-flex">
      <h2 class="card-title display-2 text-nowrap pr-5 text-white" style="font-size: 2.25rem;">
        All news
      </h2>
      <b-select
        v-model="filterStatistics.selected"
        class="filter-period w-auto text-white font-weight-light"
        :options="filterStatistics.options"
      />
    </div>

    <ul class="list-unstyled">
      <b-media v-for="(n, index) in news" :key="index" tag="li" class="pt-2 pb-5 mb-5 border-bottom">
        <b-img slot="aside" :src="getImagePath(n)" class="align-self-start rounded-lg pr-4" height="141px" />
        <h4 class="display-4 mt-0 mb-1 text-white" style="font-size: 1.5rem;">
          <router-link :to="{ name: 'news-details', params: { id: n.id } }">
            {{ n.title }}
          </router-link>
          <!--<span v-if="index">-->
          <!--{{n.title}}-->
          <!--</span>-->
        </h4>
        <p class="small">
          {{ n.releaseDate }}
        </p>
        <h5 class="text-white small">Announcement - {{ n.publisher }}</h5>
        <p class="mb-0 text-white" style="font-size: 15px">
          {{ n.text }}
        </p>
      </b-media>
    </ul>
  </div>
</template>

<script>
import user from "../mixins/user";
import news from "../mixins/news";
import { mapActions, mapState } from "vuex";
import { LOAD_NEWS } from "../store/actions-types";

export default {
  name: "News",
  mixins: [user, news],
  data() {
    return {
      filterStatistics: {
        selected: "all",
        options: [
          {
            value: "all",
            text: "All News"
          },
          {
            value: "announcements",
            text: "Announcements"
          },
          {
            value: "clientUpdates",
            text: "Client Updates"
          },
          {
            value: "pressReleases",
            text: "Press Releases"
          }
        ]
      }
    };
  },
  computed: mapState({
    news: "news"
  }),
  created() {
    this.loadNews();
  },
  methods: {
    ...mapActions({ loadNews: LOAD_NEWS })
  }
};
</script>

<style scoped lang="scss">
h4 > a:hover {
  text-decoration: none;
}

.card-title {
  max-width: 540px;
  border: none;
}

.filter-period {
  margin-bottom: 1.5em;
}
</style>
