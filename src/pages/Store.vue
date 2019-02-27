<template>
  <div>
    <b-container>
      <b-row id="store-top">
        <b-col>
          <b-row class="controls">
            <b-col class="modal-title">
              <h3>
                Top
              </h3>
            </b-col>
            <b-col>
              <b-select class="filter-period" :options="filterPeriod.options" v-model="filterPeriod.selected">
              </b-select>
            </b-col>
            <b-col class="offset-6">
              <b-button-group class="d-flex m-auto">
                <b-button variant="link">&#60;</b-button>
                <b-button variant="link">&#62;</b-button>
              </b-button-group>
            </b-col>
          </b-row>
          <b-row class="content">
            <b-col class="block">
              <b-img :src="storeTop.content[0].img" :alt="storeTop.content[0].title" width="100%"></b-img>
              <div class="block-title">
                {{ storeTop.content[0].title }}
              </div>
              <div>
                {{ storeTop.content[0].price }}
              </div>
            </b-col>
          </b-row>
        </b-col>
        <b-col></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        storeTop: {
          content: [
            {
              img: "https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg",
              title: "Watch dogs 2",
              price: "49,99 $"
            }
          ],
        },
        filterPeriod: {
          selected: 'day',
          options: [
            {
              value: null,
              text: '-- Please select period --',
              disabled: true
            },
            {
              value: 'day',
              text: 'Day'
            },
            {
              value: 'week',
              text: 'Week'
            },
            {
              value: 'month',
              text: 'Month'
            },
            {
              value: 'year',
              text: 'Year'
            },
          ]
        }
      };
    },
    computed: {},
    methods: {},
    mounted() {},
    beforeDestroy() {}
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
