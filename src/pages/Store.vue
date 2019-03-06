<template>
  <!--<div>-->
  <!--<game-carousel-->
  <!--id="store-top"-->
  <!--title="Top"-->
  <!--:filter="filterStoreTop"-->
  <!--:store="storeTop"-->
  <!--:carousel-options="topCarouselOptions"-->
  <!--:controls-enabled="false"-->
  <!--view-all="store-top"-->
  <!--key="store-top"-->
  <!--&gt;-->
  <!--</game-carousel>-->
  <!--<game-carousel-->
  <!--id="store-featured"-->
  <!--title="Featured"-->
  <!--title-tag="h4"-->
  <!--:filter="filterStoreFeatured"-->
  <!--:store="storeFeatured"-->
  <!--:carousel-options="featuredCarouselOptions"-->
  <!--:controls-enabled="false"-->
  <!--view-all="store-featured"-->
  <!--key="store-featured"-->
  <!--&gt;-->
  <!--</game-carousel>-->
  <!--</div>-->
  <div class="text-white">
    <b-row>
      <b-col>
        <b-row>
          <b-col>
            <h2>{{ storeTitle }}</h2>
          </b-col>
          <b-col cols="4" v-if="filter">
            <b-select :options="filter.options" class="filter-period text-white" v-model="filterSelected">
            </b-select>
          </b-col>
          <b-col v-if="filter"></b-col>
        </b-row>
      </b-col>
      <b-col v-if="filter"></b-col>
    </b-row>
    <b-row>
      <b-col v-for="(game, index) in content" :key="index"
             :class="'p-2 rounded-lg game mt-4 mb-2 col-' + getCols(index)"
             @click="$router.push({name: 'game-details', params: {id: game.id}})" style="cursor: pointer;">
        <b-card no-body class="border-0">
          <b-card-img :src="game.img" class="rounded-lg" top></b-card-img>
          <b-card-body style="padding-left: 0; padding-right: 0;">
            <b-card-title title-tag="h5" class="font-weight-normal">{{ game.title }}</b-card-title>
            <b-card-text class="font-weight-normal">{{ game.price }}</b-card-text>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  // import GameCarousel from '../components/Carousel/GameCarousel';

  let colCounter = 0;

  export default {
    // components: {
    //   GameCarousel
    // },
    data() {
      return {
        name: 'Store',
        filterSelected: 'day',
        storeTitle: '',
        store: null,
        filter: null,
        // topCarouselOptions: {
        //   perPageCustom: [[0, 1], [768, 3]],
        //   autoplay: false
        // },
        // featuredCarouselOptions: {
        //   perPageCustom: [[0, 2], [768, 4], [980, 5]],
        //   perPage: 5,
        //   autoplay: false
        // },
        // storeTop: {
        //   sort: true,
        //   content: {
        //     'day': [
        //       {
        //         rating: 9.876,
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         title: 'Watch dogs 2',
        //         id: '1',
        //         price: '49,99 $'
        //       },
        //       {
        //         rating: 19.876,
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         title: 'Watch dogs 3',
        //         id: '2',
        //         price: '59,99 $'
        //       },
        //       {
        //         rating: 29.876,
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         title: 'Watch dogs 4',
        //         id: '3',
        //         price: '69,99 $'
        //       },
        //       {
        //         rating: 29.876,
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         title: 'Watch dogs 5',
        //         id: '4',
        //         price: '69,99 $'
        //       },
        //       {
        //         rating: 29.876,
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         title: 'Watch dogs 6',
        //         id: '5',
        //         price: '69,99 $'
        //       },
        //       {
        //         rating: 29.876,
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         title: 'Watch dogs 7',
        //         id: '5',
        //         price: '69,99 $'
        //       }
        //     ],
        //     'week': [
        //       {
        //         rating: 9.876,
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         title: 'Watch dogs 2',
        //         id: '1',
        //         price: '49,99 $'
        //       },
        //     ],
        //     'month': [
        //       {
        //         rating: 9.876,
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         title: 'Watch dogs 2',
        //         id: '1',
        //         price: '49,99 $'
        //       },
        //     ],
        //     'year': [
        //       {
        //         rating: 9.876,
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         title: 'Watch dogs 2',
        //         id: '1',
        //         price: '49,99 $'
        //       },
        //     ],
        //     'all': [
        //       {
        //         rating: 9.876,
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         title: 'Watch dogs 2',
        //         id: '1',
        //         price: '49,99 $'
        //       },
        //     ]
        //   }
        // },
        // filterStoreTop: {
        //   default: 'day',
        //   options: [
        //     {
        //       value: null,
        //       text: '-- Please select period --',
        //       disabled: true
        //     },
        //     {
        //       value: 'day',
        //       text: 'Day'
        //     },
        //     {
        //       value: 'week',
        //       text: 'Week'
        //     },
        //     {
        //       value: 'month',
        //       text: 'Month'
        //     },
        //     {
        //       value: 'year',
        //       text: 'Year'
        //     },
        //     {
        //       value: 'all',
        //       text: 'All Time'
        //     },
        //   ]
        // },
        // storeFeatured: {
        //   sort: false,
        //   content: {
        //     'day': [
        //       {
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         id: '1',
        //         title: 'Watch dogs 2',
        //         price: '49,99 $'
        //       },
        //       {
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         title: 'Watch dogs 3',
        //         id: '2',
        //         price: '59,99 $'
        //       },
        //       {
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         title: 'Watch dogs 4',
        //         price: '69,99 $'
        //       },
        //       {
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         title: 'Watch dogs 5',
        //         price: '69,99 $'
        //       },
        //       {
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         title: 'Watch dogs 6',
        //         price: '69,99 $'
        //       },
        //       {
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         title: 'Watch dogs 7',
        //         price: '69,99 $'
        //       },
        //       {
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         title: 'Watch dogs 7',
        //         price: '69,99 $'
        //       },
        //       {
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         title: 'Watch dogs 7',
        //         price: '69,99 $'
        //       },
        //       {
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         title: 'Watch dogs 7',
        //         price: '69,99 $'
        //       },
        //       {
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         title: 'Watch dogs 7',
        //         price: '69,99 $'
        //       },
        //       {
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         title: 'Watch dogs 7',
        //         price: '69,99 $'
        //       }
        //     ],
        //     'week': [
        //       {
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         id: '1',
        //         title: 'Watch dogs 2',
        //         price: '49,99 $'
        //       },
        //     ],
        //     'month': [
        //       {
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         id: '1',
        //         title: 'Watch dogs 2',
        //         price: '49,99 $'
        //       },
        //     ],
        //     'year': [
        //       {
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         id: '1',
        //         title: 'Watch dogs 2',
        //         price: '49,99 $'
        //       },
        //     ],
        //     'all': [
        //       {
        //         img: 'https://images-eds-ssl.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTczwPpf10BNAIpjg93OVBXieOlxLDUVdALKHvpC.iQYxhJ_MV4dWn12.v4JDpBEq98zwdFQu.VX8YiXAUipAMnZiclYvMLWJBmbkXmtgap7EoOhB4uOi.AKoKaNKf_HbkBKAGLvSNKDhGlxfTEgstMT1QntZQmtMbhK5WzjSV5lDs-&h=1080&w=1920&format=jpg',
        //         id: '1',
        //         title: 'Watch dogs 2',
        //         price: '49,99 $'
        //       },
        //     ]
        //   }
        // },
        // filterStoreFeatured: {
        //   default: 'day',
        //   options: [
        //     {
        //       value: null,
        //       text: '-- Please select period --',
        //       disabled: true
        //     },
        //     {
        //       value: 'day',
        //       text: 'Day'
        //     },
        //     {
        //       value: 'week',
        //       text: 'Week'
        //     },
        //     {
        //       value: 'month',
        //       text: 'Month'
        //     },
        //     {
        //       value: 'year',
        //       text: 'Year'
        //     },
        //     {
        //       value: 'all',
        //       text: 'All Time'
        //     },
        //   ]
        // }
      };
    },
    computed: {
      currentStore() {
        return this.$router.currentRoute.name;
      },
      content: {
        get() {
          if (!this.store) {
            this.getData(this.currentStore);
          }

          if (this.store && this.store.hasOwnProperty('content')) {
            if (this.filter) {
              return this.store.content[this.filterSelected];
            } else {
              if (Array.isArray(this.store.content)) {
                return this.store.content;
              } else {
                return this.store.content[Object.keys(this.store.content)
                  .pop()];
              }
            }
          } else {
            return null;
          }
        }
      }
    },
    methods: {
      getCols(index) {
        if (index === 0) {
          colCounter = 0;
        }

        colCounter += 1;

        if (colCounter < 4) {
          return '4';
        } else {
          return '2_5';
        }
      },
      storeSort(store, byField = 'rating', order = 'DESC') {
        let orderVector = 0;

        switch (order) {
          case 'ASC':
            orderVector = 1;
            break;
          case 'DESC':
          default:
            orderVector = -1;
        }

        if (store && store.content && !Array.isArray(store.content)) {
          for (let key in store.content) {
            if (store.content.hasOwnProperty(key)) {
              store.content[key].sort((a, b) => {
                return (a[byField] - b[byField]) * (orderVector);
              });
            }
          }
        } else {
          store.content.sort((a, b) => {
            return (a[byField] - b[byField]) * (orderVector);
          });
        }
      },
      getData(storeName) {
        let filter = this.$store.getters.getFilterByName(storeName);
        if (filter) {
          this.filter = filter;
          this.filterSelected = this.filter.default;
        }

        let store = this.$store.getters.getRatingStoreByName(storeName);

        this.storeTitle = store.title;

        if (store.sort) {
          this.storeSort(store, store.byField, store.order);
        }

        this.store = store;
      }
    },
    mounted() {

    },
    created() {
      this.getData(this.currentStore);
    },
    beforeDestroy() {
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../assets/scss/partials/store";

  .game {
    transition: ease-in-out 0.25s;

    &:hover {
      background-color: $block-hover-background-color;
    }
  }

  .col-2_5 {
    -webkit-box-flex: 0;
    flex: 0 0 20%;
    max-width: 20%;
  }
</style>
