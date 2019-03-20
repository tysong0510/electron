import Vue from 'vue';
import Vuex from 'vuex';
import games from './games';

Vue.use(Vuex);

/**
 * Library for deep merging objects
 * @see https://github.com/TehShrike/deepmerge
 */
const deepMerge = require('deepmerge');

const demoData = {
  state: {
    demoData: {
      news: [
        {
          id: '1',
          img: 'https://hb.imgix.net/e8d2f653d2d74a0aa26150fe7998ddfbf72674b1.jpg?auto=compress,format&fit=crop&h=353&w=616&s=5815a257aa9eeeac939970dea5e59048',
          title: 'Daily Deal - Rise of Industry, 33% Off',
          publisher: 'VoxPop',
          text: 'Look for the deals each day on the front page of Steam. Or follow us on twitter or Facebook for instant notifications wherever you are!',
          releaseDate: '17 Feb 2019',
          subtitle: 'Subtitle',
          slides: [
            'https://steamcdn-a.akamaihd.net/steam/apps/671440/ss_e6bd0dbb3d3105f2098d1cab6f5a218b45f8eb9d.600x338.jpg?t=1551364955',
            'https://steamcdn-a.akamaihd.net/steam/apps/671440/ss_6442059cddacb3de13fdd7ee4bf289815417bac1.600x338.jpg?t=1551364955',
            'https://steamcdn-a.akamaihd.net/steam/apps/671440/ss_75a294655aea1690fa297341fe0f850864ddfda9.600x338.jpg?t=1551364955',
          ],
          blocks: [
            {
              title: 'Reviews',
              text: '“It is not often that we walk out of a Gamescom meeting saying “Wow!”, but we did with Rise of Industry. We saw amazing depth and equally amazing performance and some really clever and fun ideas.”\n'
                + 'Hooked Gamers\n'
                + '\n'
                + '“Rise of Industry features just enough realistic detail to making zooming on my little towns a joy, and just enough abstraction that I never lost sight of how all my trade routes and harvesting operations fit together. It\'s beautiful.”\n'
                + 'PC Gamer\n'
                + '\n'
                + '“This is exactly how an Early Access release should be handled.”\n'
                + 'Hardcore Gamer',
            },
            {
              title: 'About this game',
              text: 'Test',
            },
          ],
        },
        {
          img: 'https://cdn-static.denofgeek.com/sites/denofgeek/files/styles/main_wide/public/4/36/shenmue_3.jpg?itok=-GWyPiz0',
          title: 'Daily Deal - Shenmue I II, 35% Off',
          publisher: 'VoxPop',
          text: 'Look for the deals each day on the front page of Steam. Or follow us on twitter or Facebook for instant notifications wherever you are!',
          releaseDate: '17 Feb 2019',
        },
        {
          img: 'https://hb.imgix.net/0db7d0c29cfac802798e9c1dc640cdce5318adfb.jpeg?auto=compress,format&fit=crop&h=353&w=616&s=c7b52ed96ec474d4165408810a973ebf',
          title: 'Daily Deal - Absolver, 75% Off',
          publisher: 'VoxPop',
          text: 'Look for the deals each day on the front page of Steam. Or follow us on twitter or Facebook for instant notifications wherever you are!',
          releaseDate: '17 Feb 2019',
        },
        {
          img: 'https://gagadget.com/media/uploads/FarCry01.png',
          title: 'Now Available on Steam - Far   Cry New Dawn',
          publisher: 'VoxPop',
          text: 'Look for the deals each day on the front page of Steam. Or follow us on twitter or Facebook for instant notifications wherever you are!',
          releaseDate: '17 Feb 2019',
        },
      ],
      games: [
        {
          id: '1',
          img: 'https://i.imgur.com/OKRBCD8.png',

          title: 'Beglitched',
          releaseDate: 'Oct 6, 2018',
          size: '4.2 GB',
          price: '49,99 $',
          text: '7 hours',
          vote: (Math.random() * 5),
          downloaded: Math.floor(Math.random() * 1000),
          lastPlayed: new Date(),
          developer: 'Hexecutable',
          publisher: 'Hexecutable',
          description: 'Beglitched is a game about insecurity, in our computers and ourselves',
          slides: [
            'https://i.imgur.com/B9Vd4av.png',
            'https://i.imgur.com/EH91SwS.png',
            'https://i.imgur.com/XxoNHmD.png',
            'https://i.imgur.com/MSrWG2l.png',
          ],
        },
        {
          id: '2',
          img: 'https://i.imgur.com/cmw30Hr.png',
          title: 'Fortune 499',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: 'FREE',
          text: '24 hours',
          vote: (Math.random() * 5),
          downloaded: Math.floor(Math.random() * 1000),
          lastPlayed: '2017-01-13 10:49',
          developer: 'AP Thompson',
          publisher: 'AP Thompson',
          description: 'There is no future in the future.',
          slides: [
            'https://i.imgur.com/XS8rrws.jpg',
            'https://i.imgur.com/q4UcwnL.jpg',
            'https://i.imgur.com/636SI8G.jpg',
            'https://i.imgur.com/6nXi3o7.jpg',
          ],
        },
        {
          id: '3',
          img: 'https://i.imgur.com/GOppcWb.jpg',
          title: 'Getting Over It',
          releaseDate: 'Dec 6, 2017',
          size: '4.2 GB',
          price: 'FREE',
          text: '14 hours',
          vote: (Math.random() * 5),
          downloaded: Math.floor(Math.random() * 1000),
          lastPlayed: '2018-12-13 15:40',
          developer: 'Bennett Foddy',
          publisher: 'Bennett Foddy',
          description: 'A game I made for a certain kind of person. To hurt them.',
          slides: [
            'https://i.imgur.com/dZaoHNj.jpg',
            'https://i.imgur.com/CIUGytF.jpg',
          ],
        },
        {
          id: '4',
          img: 'https://i.imgur.com/hdoXi4I.jpg',
          title: 'The Norwood Suite',
          releaseDate: 'Oct 2, 2017',
          size: '4.2 GB',
          price: 'FREE',
          text: '2 hours',
          vote: (Math.random() * 5),
          downloaded: Math.floor(Math.random() * 1000),
          developer: 'Cosmo D',
          publisher: 'Alliance',
          description: 'Explore the mysterious Hotel Norwood in this surreal first-person adventure. Curious characters, forgotten secrets, '
            + 'and head-nodding music await your arrival.',
          slides: [
            'https://i.imgur.com/WbjVBsy.jpg',
            'https://i.imgur.com/KlIMkE3.jpg',
            'https://i.imgur.com/PznLj0m.jpg',
            'https://i.imgur.com/V2AidvL.jpg',
            'https://i.imgur.com/UQCXvfe.jpg',
          ],
        },
        {
          id: '5',
          img: 'https://steamcdn-a.akamaihd.net/steam/apps/578080/header.jpg?t=1545084399',
          title: 'PLAYERUNKNOWN\'S BATTLEGROUNDS',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: '49,99 $',
          text: '230 hours',
          vote: (Math.random() * 5),
          downloaded: Math.floor(Math.random() * 1000),
          description: 'PLAYERUNKNOWN\'S BATTLEGROUNDS is a battle royale shooter that pits 100 players against each other in a struggle for survival. Gather supplies and outwit your opponents to become the last person standing.\n'
            + '\n'
            + 'PLAYERUNKNOWN, aka Brendan Greene, is a pioneer of the battle royale genre and the creator of the battle royale game modes in the ARMA series and H1Z1: King of the Kill. At PUBG Corp., Greene is working with a veteran team of developers to make PUBG into the world\'s premiere battle royale experience. ',
          slides: [],
        },
        {
          id: '6',
          img: 'https://cdn4.dogonews.com/images/e86dc505-53fc-4120-ba93-df8b596b8133/fortnite-907210.jpg',
          title: 'Fortnite: Battle Royale',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: '49,99 $',
          text: '2 hours',
          vote: (Math.random() * 5),
          downloaded: Math.floor(Math.random() * 1000),
          lastPlayed: '2019-03-11 16:40',
          slides: [],
        },
        {
          id: '7',
          img: 'http://xn--h1aibaeth.xn--p1ai/uploads/posts/2016-05/1464478081_cs16_classic.jpg',
          title: 'Counter Strike 1.6',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: '49,99 $',
          text: '30 hours',
          vote: (Math.random() * 5),
          downloaded: Math.floor(Math.random() * 1000),
          slides: [],
        },
        {
          id: '8',
          img: 'https://steamcdn-a.akamaihd.net/steam/apps/271590/header.jpg?t=1544815097',
          title: 'Grand Theft Auto V',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: '49,99 $',
          text: '70 hours',
          vote: (Math.random() * 5),
          downloaded: Math.floor(Math.random() * 1000),
          slides: [],
        },
        {
          id: '9',
          img: 'https://steamcdn-a.akamaihd.net/steam/apps/230410/header.jpg?t=1551385498',
          title: 'Warframe',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: '49,99 $',
          text: '0 hours',
          vote: (Math.random() * 5),
          downloaded: Math.floor(Math.random() * 1000),
          lastPlayed: new Date(new Date().setDate(new Date().getDate() + 4)),
          slides: [],
        },
        {
          id: '10',
          img: 'https://steamcdn-a.akamaihd.net/steam/apps/346110/header_alt_assets_0.jpg?t=1551808117',
          title: 'ARK: Survival Evolved',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: '49,99 $',
          text: '0 hours',
          vote: (Math.random() * 5),
          downloaded: Math.floor(Math.random() * 1000),
          lastPlayed: '2019-03-11 16:40',
          slides: [],
        },
        {
          id: '11',
          img: 'https://steamcdn-a.akamaihd.net/steam/apps/289070/header.jpg?t=1550120776',
          title: 'Sid Meier’s Civilization® VI',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: '49,99 $',
          text: '15 hours',
          vote: (Math.random() * 5),
          downloaded: Math.floor(Math.random() * 1000),
          description: 'Originally created by legendary game designer Sid Meier, Civilization is a turn-based strategy game in which you attempt to build an empire to stand the test of time. Become Ruler of the World by establishing and leading a civilization from the Stone Age to the Information Age. Wage war, conduct diplomacy, advance your culture, and go head-to-head with history’s greatest leaders as you attempt to build the greatest civilization the world has ever known.\n'
            + '\n'
            + 'Civilization VI offers new ways to engage with your world: cities now physically expand across the map, active research in technology and culture unlocks new potential, and competing leaders will pursue their own agendas based on their historical traits as you race for one of five ways to achieve victory in the game.\n'
            + '\n'
            + '    EXPANSIVE EMPIRES:\n'
            + '    See the marvels of your empire spread across the map like never before. Each city spans multiple tiles so you can custom build your cities to take full advantage of the local terrain.\n'
            + '    ACTIVE RESEARCH:\n'
            + '    Unlock boosts that speed your civilization’s progress through history. To advance more quickly, use your units to actively explore, develop your environment, and discover new cultures.\n'
            + '    DYNAMIC DIPLOMACY:\n'
            + '    Interactions with other civilizations change over the course of the game, from primitive first interactions where conflict is a fact of life, to late game alliances and negotiations.\n'
            + '    COMBINED ARMS:\n'
            + '    Expanding on the “one unit per tile” design, support units can now be embedded with other units, like anti-tank support with infantry, or a warrior with settlers. Similar units can also be combined to form powerful “Corps” units.\n'
            + '    ENHANCED MULTIPLAYER:\n'
            + '    In addition to traditional multiplayer modes, cooperate and compete with your friends in a wide variety of situations all designed to be easily completed in a single session.\n'
            + '    A CIV FOR ALL PLAYERS:\n'
            + '    Civilization VI provides veteran players new ways to build and tune their civilization for the greatest chance of success. New tutorial systems introduce new players to the underlying concepts so they can easily get started.',
          slides: [
            'https://steamcdn-a.akamaihd.net/steam/apps/289070/ss_36c63ebeb006b246cb740fdafeb41bb20e3b330d.600x338.jpg?t=1550120776',
            'https://steamcdn-a.akamaihd.net/steam/apps/289070/ss_cf53258cb8c4d283e52cf8dce3edf8656f83adc6.600x338.jpg?t=1550120776',
            'https://steamcdn-a.akamaihd.net/steam/apps/289070/ss_f501156a69223131ee8b12452f3003698334e964.600x338.jpg?t=1550120776',
            'https://steamcdn-a.akamaihd.net/steam/apps/289070/ss_fd6bbe6791ee8ab68f8a91455fa3c25b4dd9bca7.600x338.jpg?t=1550120776',
          ],
        },
        {
          id: '12',
          img: 'https://steamcdn-a.akamaihd.net/steam/apps/252490/header.jpg?t=1549762598',
          title: 'Rust',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: '49,99 $',
          text: '298 hours',
          vote: (Math.random() * 5),
          downloaded: Math.floor(Math.random() * 1000),
          slides: [],
        },
      ],
      rating: {
        'store-top': {
          day: [
            {
              id: '1',
              value: Math.random() * 10,
            },
            {
              id: '2',
              value: Math.random() * 10,
            },
            {
              id: '3',
              value: Math.random() * 10,
            },
            {
              id: '4',
              value: Math.random() * 10,
            },
            {
              id: '5',
              value: Math.random() * 10,
            },
            {
              id: '6',
              value: Math.random() * 10,
            },
            {
              id: '7',
              value: Math.random() * 10,
            },
            {
              id: '8',
              value: Math.random() * 10,
            },
            {
              id: '9',
              value: Math.random() * 10,
            },
            {
              id: '10',
              value: Math.random() * 10,
            },
            {
              id: '11',
              value: Math.random() * 10,
            },
            {
              id: '12',
              value: Math.random() * 10,
            },
          ],
          week: [
            {
              id: '1',
              value: Math.random() * 10,
            },
            {
              id: '2',
              value: Math.random() * 10,
            },
            {
              id: '3',
              value: Math.random() * 10,
            },
            {
              id: '4',
              value: Math.random() * 10,
            },
            {
              id: '5',
              value: Math.random() * 10,
            },
            {
              id: '6',
              value: Math.random() * 10,
            },
            {
              id: '7',
              value: Math.random() * 10,
            },
            {
              id: '8',
              value: Math.random() * 10,
            },
            {
              id: '9',
              value: Math.random() * 10,
            },
            {
              id: '10',
              value: Math.random() * 10,
            },
            {
              id: '11',
              value: Math.random() * 10,
            },
            {
              id: '12',
              value: Math.random() * 10,
            },
          ],
          month: [
            {
              id: '1',
              value: Math.random() * 10,
            },
            {
              id: '2',
              value: Math.random() * 10,
            },
            {
              id: '3',
              value: Math.random() * 10,
            },
            {
              id: '4',
              value: Math.random() * 10,
            },
            {
              id: '5',
              value: Math.random() * 10,
            },
            {
              id: '6',
              value: Math.random() * 10,
            },
            {
              id: '7',
              value: Math.random() * 10,
            },
            {
              id: '8',
              value: Math.random() * 10,
            },
            {
              id: '9',
              value: Math.random() * 10,
            },
            {
              id: '10',
              value: Math.random() * 10,
            },
            {
              id: '11',
              value: Math.random() * 10,
            },
            {
              id: '12',
              value: Math.random() * 10,
            },
          ],
          year: [
            {
              id: '1',
              value: Math.random() * 10,
            },
            {
              id: '2',
              value: Math.random() * 10,
            },
            {
              id: '3',
              value: Math.random() * 10,
            },
            {
              id: '4',
              value: Math.random() * 10,
            },
            {
              id: '5',
              value: Math.random() * 10,
            },
            {
              id: '6',
              value: Math.random() * 10,
            },
            {
              id: '7',
              value: Math.random() * 10,
            },
            {
              id: '8',
              value: Math.random() * 10,
            },
            {
              id: '9',
              value: Math.random() * 10,
            },
            {
              id: '10',
              value: Math.random() * 10,
            },
            {
              id: '11',
              value: Math.random() * 10,
            },
            {
              id: '12',
              value: Math.random() * 10,
            },
          ],
          all: [
            {
              id: '1',
              value: Math.random() * 10,
            },
            {
              id: '2',
              value: Math.random() * 10,
            },
            {
              id: '3',
              value: Math.random() * 10,
            },
            {
              id: '4',
              value: Math.random() * 10,
            },
            {
              id: '5',
              value: Math.random() * 10,
            },
            {
              id: '6',
              value: Math.random() * 10,
            },
            {
              id: '7',
              value: Math.random() * 10,
            },
            {
              id: '8',
              value: Math.random() * 10,
            },
            {
              id: '9',
              value: Math.random() * 10,
            },
            {
              id: '10',
              value: Math.random() * 10,
            },
            {
              id: '11',
              value: Math.random() * 10,
            },
            {
              id: '12',
              value: Math.random() * 10,
            },
          ],
        },
        'store-featured': {
          day: [
            {
              id: '2',
            },
            {
              id: '4',
            },
          ],
          week: [
            {
              id: '2',
            },
            {
              id: '4',
            },
            {
              id: '1',
            },
            {
              id: '3',
            },
          ],
          month: [
            {
              id: '2',
            },
            {
              id: '4',
            },
            {
              id: '1',
            },
            {
              id: '3',
            },
            {
              id: '5',
            },
          ],
          year: [
            {
              id: '2',
            },
            {
              id: '4',
            },
            {
              id: '1',
            },
            {
              id: '3',
            },
            {
              id: '5',
            },
            {
              id: '6',
            },
            {
              id: '7',
            },
          ],
          all: [
            {
              id: '2',
            },
            {
              id: '4',
            },
            {
              id: '1',
            },
            {
              id: '3',
            },
            {
              id: '5',
            },
            {
              id: '6',
            },
            {
              id: '7',
            },
            {
              id: '8',
            },
            {
              id: '9',
            },
          ],
        },
        'store-all': '*',
        'my-top-games': [
          {
            id: '1',
            value: 1,
          },
          {
            id: '2',
            value: 2,
          },
          {
            id: '3',
            value: 3,
          },
          {
            id: '4',
            value: '4',
          },
          {
            id: '5',
            value: 5,
          },
        ],
        'my-files': '*',
        'my-recommendation': '*',
        'recently-played': '*',
      },
      stores: [
        {
          name: 'store-top',
          title: 'Top',
          sort: true,
          order: 'DESC',
        },
        {
          name: 'store-featured',
          title: 'Featured',
        },
        {
          name: 'store-all',
          title: 'All games',
        },
        {
          name: 'my-top-games',
          title: 'Your top games',
          sort: true,
          order: 'ASC',
        },
        {
          name: 'my-files',
          title: 'Your files',
          sort: true,
          byField: 'id',
        },
        {
          name: 'my-recommendation',
          title: 'Your recommendation',
          sort: false,
        },
        {
          name: 'recently-played',
          title: 'Recently played',
          sort: false,
        },
      ],
      filters: {
        'store-top': {
          default: 'day',
          options: [
            {
              value: null,
              text: '-- Please select period --',
              disabled: true,
            },
            {
              value: 'day',
              text: 'Day',
            },
            {
              value: 'week',
              text: 'Week',
            },
            {
              value: 'month',
              text: 'Month',
            },
            {
              value: 'year',
              text: 'Year',
            },
            {
              value: 'all',
              text: 'All Time',
            },
          ],
        },
        'store-featured': {
          default: 'day',
          options: [
            {
              value: null,
              text: '-- Please select period --',
              disabled: true,
            },
            {
              value: 'day',
              text: 'Day',
            },
            {
              value: 'week',
              text: 'Week',
            },
            {
              value: 'month',
              text: 'Month',
            },
            {
              value: 'year',
              text: 'Year',
            },
            {
              value: 'all',
              text: 'All Time',
            },
          ],
        },
      },
    },
  },
  mutations: {},
  actions: {},
};

/**
 * Merge stores
 */
const stores = deepMerge.all(
  [
    games,
    demoData,
  ],
);

export default new Vuex.Store({
  ...stores,
  getters: {
    news: (state) => {
      const news = [];

      for (const current of state.demoData.news) {
        /**
         * @type {({} & {img, releaseDate, publisher, id, text, title}) | any}
         */
        const normalized = Object.assign({}, current);

        if (normalized.id) {
          news.push(normalized);

          continue;
        }

        normalized.id = encodeURI(
          current.title.toLowerCase()
            .replace(/%/g, '')
            .replace(/\s+/g, '_'),
        );
        news.push(normalized);
      }

      return news;
    },
    getNewsById: (state, getters) => id => getters.news.filter(elem => elem.id === id).pop(),
    games: state => state.demoData.games,
    // TODO remove getGameById
    getGameById: state => id => state.demoData.games.filter(game => game.id === id).pop(),
    getFilterByName: state => (name) => {
      if (state.demoData.filters.hasOwnProperty(name)) {
        return state.demoData.filters[name];
      }
      return null;
    },
    getRatingStoreByName: (state, getters) => (name) => {
      if (state.demoData.rating.hasOwnProperty(name)) {
        let rating = null;

        if (typeof state.demoData.rating[name] === 'object' && !Array.isArray(state.demoData.rating[name])) {
          rating = Object.assign({}, state.demoData.rating[name]);
        } else if (Array.isArray(state.demoData.rating[name])) {
          rating = state.demoData.rating[name].slice(0);
        } else {
          rating = state.demoData.rating[name];
        }

        const { games } = getters;

        if (typeof rating === 'object') {
          for (const key in rating) {
            if (rating.hasOwnProperty(key)) {
              const result = [];

              if (rating[key].reduce) {
                rating[key].reduce((res, elem) => {
                  const rate = elem.hasOwnProperty('value') ? elem.value : null;
                  const id = Number.parseInt(elem.id);

                  let newElem = games.filter(cur => Number.parseInt(cur.id) === id).pop();

                  if (newElem) {
                    newElem = Object.assign({}, newElem);

                    if (rate) {
                      newElem.rating = rate;
                    }

                    result.push(newElem);
                  }
                }, result);
              } else {
                const newElem = games.filter((cur) => {
                  /**
                   * @type {number}
                   */
                  const id = Number.parseInt(rating[key].id);

                  return Number.parseInt(cur.id) === id;
                }).pop();

                if (newElem) {
                  newElem.rating = rating[key].hasOwnProperty('value') ? rating[key].value : null;
                  rating[key] = newElem;

                  continue;
                }
              }

              rating[key] = result;
            }
          }
        } else if (rating) {
          switch (rating) {
            /**
             * Return all games
             */
            case '*': {
              rating = games.slice(0);
              break;
            }
          }
        }

        const storeInfo = state.demoData.stores.filter(elem => elem.name === name).pop();

        return {
          sort: storeInfo && storeInfo.sort,
          byField: storeInfo && storeInfo.byField,
          order: storeInfo && storeInfo.order,
          title: storeInfo ? (storeInfo.title || name) : name,
          content: rating,
        };
      }
      const storeInfo = state.demoData.stores.filter(elem => elem.name === name).pop();

      return {
        title: storeInfo ? (storeInfo.title || name) : name,
      };
    },
  },
});
