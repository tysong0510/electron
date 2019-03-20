<template>
  <b-row
    class="vote-bar"
    v-bind="$attrs"
    :title="nVote.toFixed(1)"
  >
    <b-col
      class="rating"
      tag="span"
    >
      <i
        v-for="(value, index) in progressData"
        :key="index"
        :class="{star: true}"
      >
        <i
          class="progress"
          :style="`width: ${value}%;`"
        />
      </i>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'VoteBar',
  props: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 5,
    },
    vote: {
      required: true,
      type: [Number, String],
    },
  },
  data() {
    return {
      nMin: 0,
      nMax: 5,
    };
  },
  computed: {
    progressData() {
      const result = [];
      const step = (this.nMax - this.nMin) * 0.2;

      for (let i = 1; i <= 5; i += 1) {
        if (this.nVote >= this.nMin + step * i) {
          result.push(100);
        } else if (this.nVote < this.nMin + step * (i - 1)) {
          result.push(0);
        } else {
          result.push(Math.floor((this.nVote - (this.nMin + (step * (i - 1)))) * 100));
        }
      }

      return result;
    },
    nVote: {
      set() {
        this.vote = Number.parseFloat(this.vote);
      },
      get() {
        return Number.parseFloat(this.vote);
      },
    },
  },
  created() {
    this.normalizeVote();
  },
  updated() {
    this.normalizeVote();
  },
  methods: {
    normalizeVote() {
      if (this.min > this.max) {
        this.nMin = this.max;
        this.nMax = this.min;
      } else {
        this.nMin = this.min;
        this.nMax = this.max;
      }

      if (this.nVote < this.nMin) {
        this.nVote = this.nMin;
      } else if (this.nVote > this.nMax) {
        this.nVote = this.nMax;
      }
    },
  },
};
</script>

<style scoped lang="scss">
  $margin: .25em;
  $after-size: 120%;
  $size: 1em;

  .vote-bar {
    margin: auto 0;
    padding: 0;
    width: calc(#{$size} * 5 + #{$margin} * 10);

    .col {
      margin: auto 0;
      padding: 0;
    }
  }

  .star {
    background-image: url("../../assets/icons/star-empty.svg");
    background-color: transparent;
    background-size: cover;
    background-position: center;
    width: $size;
    height: $size;
    margin: 0 $margin;
    display: inline-flex;
    position: relative;

    /*&.full {*/
      /*background-image: none;*/
    /*}*/

    .progress {
      background-image: url("../../assets/icons/star.svg");
      background-color: transparent;
      background-size: cover;
      height: 100%;
      display: block;
      position: absolute;
    }

    /*&:after {
      content: "";
      display: block;
      position: absolute;
      width: $after-size;
      height: $after-size;
      top: calc((#{$after-size} - 100%) / 2 * -1);
      left: calc((#{$after-size} - 100%) / 2 * -1);
      background-image: url("../../assets/icons/star.svg");
      background-size: cover;
      z-index: -1;
    }*/
  }
</style>
