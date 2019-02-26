<template>
  <div>
    <b-container>
      <b-row id="store-top">
        <b-col>
          <b-row class="controls">
            <b-col class="card-title">
              Top
            </b-col>
            <b-col>
              <b-select class="filter-period" :options="filterPeriod.options" v-model="filterPeriod.selected">
              </b-select>
            </b-col>
            <b-col>
              <b-button-group>
                <b-button></b-button>
              </b-button-group>
            </b-col>
          </b-row>
          <b-row class="content">

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
