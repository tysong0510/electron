<template>
  <div>
    <b-card no-body class="flex-row pb-3 mb-2">
      <b-card-img src="https://hb.imgix.net/e8d2f653d2d74a0aa26150fe7998ddfbf72674b1.jpg?auto=compress,format&fit=crop&h=353&w=616&s=5815a257aa9eeeac939970dea5e59048" class="rounded-lg card-imgage" />
      <b-card-body>
        <h2 class="card-title display-2 text-white" style="font-size: 2.25rem;">
          {{title}}
        </h2>
        <!--<b-row no-gutters>-->
          <!--<b-col class="col-auto mr-auto">-->
          <!--</b-col>-->
          <!--<b-col class="col-auto">-->
          <!--</b-col>-->
        <!--</b-row>-->

        <p class="card-subtitle text-white pb-4">
        </p>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
  export default {
    name: 'News',
    data() {
      return {
        img: 'https://hb.imgix.net/e8d2f653d2d74a0aa26150fe7998ddfbf72674b1.jpg?auto=compress,format&fit=crop&h=353&w=616&s=5815a257aa9eeeac939970dea5e59048',
        title: 'Daily Deal - Rise of Industry',
        publisher: 'VoxPop',
        text: 'Look for the deals each day on the front page of Steam. Or follow us on twitter or Facebook for instant notifications wherever you are!',
        releaseDate: '17 Feb 2019'
      }
    },
    methods: {}
  }
</script>


<style scoped lang="scss">
  .card-imgage {
    height: 214px;
    /*width: 273px;*/
    width: auto;
  }
</style>
