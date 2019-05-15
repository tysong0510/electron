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
        <b-img slot="aside" :src="n.img" class="align-self-start rounded-lg pr-4" height="141px" />
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

export default {
  name: "News",
  mixins: [user],
  data() {
    return {
      // news: {
      //   content: [
      //     {
      //       img: 'https://hb.imgix.net/e8d2f653d2d74a0aa26150fe7998ddfbf72674b1.jpg?auto=compress,format&fit=crop&h=353&w=616&s=5815a257aa9eeeac939970dea5e59048',
      //       title: 'Daily Deal - Rise of Industry, 33% Off',
      //       publisher: 'VoxPop',
      //       text: 'Look for the deals each day on the front page of Steam. Or follow us on twitter or Facebook for instant notifications wherever you are!',
      //       releaseDate: '17 Feb 2019'
      //     },
      //     {
      //       img: 'https://cdn-static.denofgeek.com/sites/denofgeek/files/styles/main_wide/public/4/36/shenmue_3.jpg?itok=-GWyPiz0',
      //       title: 'Daily Deal - Shenmue I II, 35% Off',
      //       publisher: 'VoxPop',
      //       text: 'Look for the deals each day on the front page of Steam. Or follow us on twitter or Facebook for instant notifications wherever you are!',
      //       releaseDate: '17 Feb 2019'
      //     },
      //     {
      //       img: 'https://hb.imgix.net/0db7d0c29cfac802798e9c1dc640cdce5318adfb.jpeg?auto=compress,format&fit=crop&h=353&w=616&s=c7b52ed96ec474d4165408810a973ebf',
      //       title: 'Daily Deal - Absolver, 75% Off',
      //       publisher: 'VoxPop',
      //       text: 'Look for the deals each day on the front page of Steam. Or follow us on twitter or Facebook for instant notifications wherever you are!',
      //       releaseDate: '17 Feb 2019'
      //     },
      //     {
      //       img: 'https://gagadget.com/media/uploads/FarCry01.png',
      //       title: 'Now Available on Steam - Far Cry New Dawn',
      //       publisher: 'VoxPop',
      //       text: 'Look for the deals each day on the front page of Steam. Or follow us on twitter or Facebook for instant notifications wherever you are!',
      //       releaseDate: '17 Feb 2019'
      //     },
      //   ],
      // },
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
  computed: {
    news() {
      return this.$store.getters.news;
    }
  },
  methods: {}
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
