<template>
  <div>
    <b-card no-body class="pb-3 mb-2 border-0" v-if="news">
      <b-card-header class="border-0 d-inline-flex p-0">
        <b-card-img :src="news.img" class="rounded-lg card-image"/>
        <b-card-body>
          <b-card-title title-tag="h2" class="display-2 text-white" style="font-size: 2.25rem;">
            {{news.title}}
          </b-card-title>
          <p class="card-subtitle text-white pb-4" v-if="news.subtitle">
            {{ news.subtitle }}
          </p>
        </b-card-body>
      </b-card-header>
      <b-card-body class="text-white pl-0">
        <carousel v-bind="carouselOptions" v-if="news.slides" class="mt-4 mb-2">
          <slide v-for="(slide, index) in news.slides" :key="'slide-' + index" class="pr-1 pl-1">
            <b-card :img-src="slide" class="no-border" no-body></b-card>
          </slide>
        </carousel>
        <b-card-text class="mt-4 mb-2">


          <template v-if="news.blocks">
            <b-row v-for="(block, index) in news.blocks" :key="'block-' + index">
              <b-col class="border-bottom mt-3 mb-3">
                <h4>
                  {{ block.title }}
                </h4>
                <p class="p-2" v-html="normalizeText(block.text)"></p>
              </b-col>
            </b-row>
          </template>
          <template v-else>
            {{ news.text }}
          </template>


        </b-card-text>
      </b-card-body>
    </b-card>
    <b-row v-else>
      <b-col>
        News with id "{{ id }}" not found
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import {Carousel, Slide} from 'vue-carousel';

  let carouselOptions = {
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 5000,
    loop: true,
    paginationEnabled: true,
    perPage: 2,
    scrollPerPage: false
  };

  export default {
    name: 'News',
    components: {
      Carousel,
      Slide
    },
    data() {
      return {
        carouselOptions: null,
        img: 'https://hb.imgix.net/e8d2f653d2d74a0aa26150fe7998ddfbf72674b1.jpg?auto=compress,format&fit=crop&h=353&w=616&s=5815a257aa9eeeac939970dea5e59048',
        title: 'Daily Deal - Rise of Industry',
        publisher: 'VoxPop',
        text: 'Look for the deals each day on the front page of Steam. Or follow us on twitter or Facebook for instant notifications wherever you are!',
        releaseDate: '17 Feb 2019'
      }
    },
    created() {
      this.carouselOptions = carouselOptions;
    },
    computed: {
      id() {
        return this.$route.params.id;
      },
      news() {
        return this.$store.getters.getNewsById(this.id);
      }
    },
    methods: {
      normalizeText(text) {
        if (text) {
          return text.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/\n/g, '<br>');
        } else {
          return '';
        }
      }
    }
  }
</script>


<style scoped lang="scss">
  /deep/ .VueCarousel-pagination {
    text-align: left;

    .VueCarousel-dot-container {
      margin-top: 10px !important;

      .VueCarousel-dot {
        background-color: #696E80 !important;
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
