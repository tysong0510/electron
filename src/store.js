import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
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
              text: '“It is not often that we walk out of a Gamescom meeting saying “Wow!”, but we did with Rise of Industry. We saw amazing depth and equally amazing performance and some really clever and fun ideas.”\n' +
                'Hooked Gamers\n' +
                '\n' +
                '“Rise of Industry features just enough realistic detail to making zooming on my little towns a joy, and just enough abstraction that I never lost sight of how all my trade routes and harvesting operations fit together. It\'s beautiful.”\n' +
                'PC Gamer\n' +
                '\n' +
                '“This is exactly how an Early Access release should be handled.”\n' +
                'Hardcore Gamer'
            },
            {
              title: 'About this game',
              text: 'Test'
            }
          ]
        },
        {
          img: 'https://cdn-static.denofgeek.com/sites/denofgeek/files/styles/main_wide/public/4/36/shenmue_3.jpg?itok=-GWyPiz0',
          title: 'Daily Deal - Shenmue I II, 35% Off',
          publisher: 'VoxPop',
          text: 'Look for the deals each day on the front page of Steam. Or follow us on twitter or Facebook for instant notifications wherever you are!',
          releaseDate: '17 Feb 2019'
        },
        {
          img: 'https://hb.imgix.net/0db7d0c29cfac802798e9c1dc640cdce5318adfb.jpeg?auto=compress,format&fit=crop&h=353&w=616&s=c7b52ed96ec474d4165408810a973ebf',
          title: 'Daily Deal - Absolver, 75% Off',
          publisher: 'VoxPop',
          text: 'Look for the deals each day on the front page of Steam. Or follow us on twitter or Facebook for instant notifications wherever you are!',
          releaseDate: '17 Feb 2019'
        },
        {
          img: 'https://gagadget.com/media/uploads/FarCry01.png',
          title: 'Now Available on Steam - Far   Cry New Dawn',
          publisher: 'VoxPop',
          text: 'Look for the deals each day on the front page of Steam. Or follow us on twitter or Facebook for instant notifications wherever you are!',
          releaseDate: '17 Feb 2019'
        },
      ],
      games: [
        {
          id: '1',
          img: 'https://steamcdn-a.akamaihd.net/steam/apps/447040/header.jpg?t=1527101545',
          title: 'Watch_Dogs® 2',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: '49,99 $',
          text: '7 hours',
          vote: 4.6,
          description: 'Play as Marcus Holloway, a brilliant young hacker living in the birthplace of the tech revolution, the San Francisco Bay Area.\n' +
            'Team up with Dedsec, a notorious group of hackers, to execute the biggest hack in history; take down ctOS 2.0, an invasive operating system being used by criminal masterminds to monitor and manipulate citizens on a massive scale.\n' +
            '\n' +
            '    Explore the dynamic open-world, full of gameplay possibilities\n' +
            '    Hack into every connected device and take control of the city infrastructure.\n' +
            '    Develop different skills to suit your playstyle, and upgrade your hacker tools – RC cars, Quadcopter drone, 3D printed weapons and much more.\n' +
            '    Stay seamlessly connected to your friends with a brand new co-op and adversarial multiplayer Watch Dogs experience.\n' +
            '\n' +
            '\n' +
            'PUT YOUR EYES IN CTRL\n' +
            'Get the upper hand with Tobii Eye Tracking. Let your gaze aid you in weaponizing the “internet of things”, aim at enemies and take cover while you naturally explore the environment. Combine the extensive eye tracking feature set to pinpoint enemies, interact with your surroundings, locate shelter points, and rapidly select hackable targets. Let your vision lead the hacking of the city’s digital brain.\n' +
            '\n' +
            'Compatible with all Tobii Eye Tracking gaming devices.\n' +
            '----\n' +
            'Additional notes:\n' +
            'Eye tracking features available with Tobii Eye Tracking.',
          slides: [
            'https://steamcdn-a.akamaihd.net/steam/apps/447040/ss_8071f719fea2d45baa805449ec550395db700118.600x338.jpg?t=1527101545',
            'https://steamcdn-a.akamaihd.net/steam/apps/447040/ss_b93d600b2a0372d6b5a5d191b46654ba489819d1.600x338.jpg?t=1527101545',
            'https://steamcdn-a.akamaihd.net/steam/apps/447040/ss_6eb9108a5ac2f33942d15ebf0801f0e69373d4f8.600x338.jpg?t=1527101545',
            'https://steamcdn-a.akamaihd.net/steam/apps/447040/ss_3466ea1a9e73594961b9f73fd560f379f7f49870.600x338.jpg?t=1527101545',
          ]
        },
        {
          id: '2',
          img: 'https://steamcdn-a.akamaihd.net/steam/apps/730/header.jpg?t=1550873343',
          title: 'Counter-Strike: Global Offensive',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: 'FREE',
          text: '24 hours',
          vote: 4.8,
          description: 'Counter-Strike: Global Offensive (CS: GO) expands upon the team-based action gameplay that it pioneered when it was launched 19 years ago.\n' +
            '\n' +
            'CS: GO features new maps, characters, weapons, and game modes, and delivers updated versions of the classic CS content (de_dust2, etc.).\n' +
            '\n' +
            '"Counter-Strike took the gaming industry by surprise when the unlikely MOD became the most played online PC action game in the world almost immediately after its release in August 1999," said Doug Lombardi at Valve. "For the past 12 years, it has continued to be one of the most-played games in the world, headline competitive gaming tournaments and selling over 25 million units worldwide across the franchise. CS: GO promises to expand on CS\' award-winning gameplay and deliver it to gamers on the PC as well as the next gen consoles and the Mac." ',
          slides: [
            'https://steamcdn-a.akamaihd.net/steam/apps/730/ss_34090867f1a02b6c17652ba9043e3f622ed985a9.600x338.jpg?t=1550873343',
            'https://steamcdn-a.akamaihd.net/steam/apps/730/ss_1d30c9a215fd621e2fd74f40d93b71587bf6409c.600x338.jpg?t=1550873343',
            'https://steamcdn-a.akamaihd.net/steam/apps/730/ss_baa02e979cd3852e3c4182afcd603ab64e3502f9.600x338.jpg?t=1550873343',
            'https://steamcdn-a.akamaihd.net/steam/apps/730/ss_ffe584c163a2b16e9c1b733b1c8e2ba669fb1204.600x338.jpg?t=1550873343'
          ]
        },
        {
          id: '3',
          img: 'https://steamcdn-a.akamaihd.net/steam/apps/570/header.jpg?t=1543590720',
          title: 'Dota 2',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: 'FREE',
          text: '14 hours',
          vote: 4.4,
          description: 'The most-played game on Steam.\n' +
            'Every day, millions of players worldwide enter battle as one of over a hundred Dota heroes. And no matter if it\'s their 10th hour of play or 1,000th, there\'s always something new to discover. With regular updates that ensure a constant evolution of gameplay, features, and heroes, Dota 2 has truly taken on a life of its own.\n' +
            '\n' +
            'One Battlefield. Infinite Possibilities.\n' +
            'When it comes to diversity of heroes, abilities, and powerful items, Dota boasts an endless array—no two games are the same. Any hero can fill multiple roles, and there\'s an abundance of items to help meet the needs of each game. Dota doesn\'t provide limitations on how to play, it empowers you to express your own style.\n' +
            '\n' +
            'All heroes are free.\n' +
            'Competitive balance is Dota\'s crown jewel, and to ensure everyone is playing on an even field, the core content of the game—like the vast pool of heroes—is available to all players. Fans can collect cosmetics for heroes and fun add-ons for the world they inhabit, but everything you need to play is already included before you join your first match.\n' +
            '\n' +
            'Bring your friends and party up.\n' +
            'Dota is deep, and constantly evolving, but it\'s never too late to join.\n' +
            'Learn the ropes playing co-op vs. bots. Sharpen your skills in the hero demo mode. Jump into the behavior- and skill-based matchmaking system that ensures you\'ll\n' +
            'be matched with the right players each game. ',
          slides: [
            'https://steamcdn-a.akamaihd.net/steam/apps/570/ss_86d675fdc73ba10462abb8f5ece7791c5047072c.600x338.jpg?t=1543590720',
            'https://steamcdn-a.akamaihd.net/steam/apps/570/ss_ad8eee787704745ccdecdfde3a5cd2733704898d.600x338.jpg?t=1543590720',
            'https://steamcdn-a.akamaihd.net/steam/apps/570/ss_7ab506679d42bfc0c0e40639887176494e0466d9.600x338.jpg?t=1543590720',
            'https://steamcdn-a.akamaihd.net/steam/apps/570/ss_b33a65678dc71cc98df4890e22a89601ee56a918.600x338.jpg?t=1543590720'
          ]
        },
        {
          id: '4',
          img: 'https://versiya.info/uploads/posts/2018-11/1542721739_league-of-legends_0.jpg',
          title: 'League of legends',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: 'FREE',
          text: '2 hours',
          vote: 4.0,
          slides: []
        },
        {
          id: '5',
          img: 'https://steamcdn-a.akamaihd.net/steam/apps/578080/header.jpg?t=1545084399',
          title: 'PLAYERUNKNOWN\'S BATTLEGROUNDS',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: '49,99 $',
          text: '230 hours',
          vote: 4.9,
          description: 'PLAYERUNKNOWN\'S BATTLEGROUNDS is a battle royale shooter that pits 100 players against each other in a struggle for survival. Gather supplies and outwit your opponents to become the last person standing.\n' +
            '\n' +
            'PLAYERUNKNOWN, aka Brendan Greene, is a pioneer of the battle royale genre and the creator of the battle royale game modes in the ARMA series and H1Z1: King of the Kill. At PUBG Corp., Greene is working with a veteran team of developers to make PUBG into the world\'s premiere battle royale experience. ',
          slides: []
        },
        {
          id: '6',
          img: 'https://cdn4.dogonews.com/images/e86dc505-53fc-4120-ba93-df8b596b8133/fortnite-907210.jpg',
          title: 'Fortnite: Battle Royale',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: '49,99 $',
          text: '2 hours',
          vote: 3.7,
          slides: []
        },
        {
          id: '7',
          img: 'http://xn--h1aibaeth.xn--p1ai/uploads/posts/2016-05/1464478081_cs16_classic.jpg',
          title: 'Counter Strike 1.6',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: '49,99 $',
          text: '30 hours',
          vote: 4.5,
          slides: []
        },
        {
          id: '8',
          img: 'https://steamcdn-a.akamaihd.net/steam/apps/271590/header.jpg?t=1544815097',
          title: 'Grand Theft Auto V',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: '49,99 $',
          text: '70 hours',
          vote: 4.6,
          slides: []
        },
        {
          id: '9',
          img: 'https://steamcdn-a.akamaihd.net/steam/apps/230410/header.jpg?t=1551385498',
          title: 'Warframe',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: '49,99 $',
          text: '0 hours',
          vote: 3.9,
          slides: []
        },
        {
          id: '10',
          img: 'https://steamcdn-a.akamaihd.net/steam/apps/346110/header_alt_assets_0.jpg?t=1551808117',
          title: 'ARK: Survival Evolved',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: '49,99 $',
          text: '0 hours',
          vote: 3.1,
          slides: []
        },
        {
          id: '11',
          img: 'https://steamcdn-a.akamaihd.net/steam/apps/289070/header.jpg?t=1550120776',
          title: 'Sid Meier’s Civilization® VI',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: '49,99 $',
          text: '15 hours',
          vote: 3.8,
          description: 'Originally created by legendary game designer Sid Meier, Civilization is a turn-based strategy game in which you attempt to build an empire to stand the test of time. Become Ruler of the World by establishing and leading a civilization from the Stone Age to the Information Age. Wage war, conduct diplomacy, advance your culture, and go head-to-head with history’s greatest leaders as you attempt to build the greatest civilization the world has ever known.\n' +
            '\n' +
            'Civilization VI offers new ways to engage with your world: cities now physically expand across the map, active research in technology and culture unlocks new potential, and competing leaders will pursue their own agendas based on their historical traits as you race for one of five ways to achieve victory in the game.\n' +
            '\n' +
            '    EXPANSIVE EMPIRES:\n' +
            '    See the marvels of your empire spread across the map like never before. Each city spans multiple tiles so you can custom build your cities to take full advantage of the local terrain.\n' +
            '    ACTIVE RESEARCH:\n' +
            '    Unlock boosts that speed your civilization’s progress through history. To advance more quickly, use your units to actively explore, develop your environment, and discover new cultures.\n' +
            '    DYNAMIC DIPLOMACY:\n' +
            '    Interactions with other civilizations change over the course of the game, from primitive first interactions where conflict is a fact of life, to late game alliances and negotiations.\n' +
            '    COMBINED ARMS:\n' +
            '    Expanding on the “one unit per tile” design, support units can now be embedded with other units, like anti-tank support with infantry, or a warrior with settlers. Similar units can also be combined to form powerful “Corps” units.\n' +
            '    ENHANCED MULTIPLAYER:\n' +
            '    In addition to traditional multiplayer modes, cooperate and compete with your friends in a wide variety of situations all designed to be easily completed in a single session.\n' +
            '    A CIV FOR ALL PLAYERS:\n' +
            '    Civilization VI provides veteran players new ways to build and tune their civilization for the greatest chance of success. New tutorial systems introduce new players to the underlying concepts so they can easily get started.',
          slides: [
            'https://steamcdn-a.akamaihd.net/steam/apps/289070/ss_36c63ebeb006b246cb740fdafeb41bb20e3b330d.600x338.jpg?t=1550120776',
            'https://steamcdn-a.akamaihd.net/steam/apps/289070/ss_cf53258cb8c4d283e52cf8dce3edf8656f83adc6.600x338.jpg?t=1550120776',
            'https://steamcdn-a.akamaihd.net/steam/apps/289070/ss_f501156a69223131ee8b12452f3003698334e964.600x338.jpg?t=1550120776',
            'https://steamcdn-a.akamaihd.net/steam/apps/289070/ss_fd6bbe6791ee8ab68f8a91455fa3c25b4dd9bca7.600x338.jpg?t=1550120776'
          ]
        },
        {
          id: '12',
          img: 'https://steamcdn-a.akamaihd.net/steam/apps/252490/header.jpg?t=1549762598',
          title: 'Rust',
          releaseDate: '20 feb. 2019',
          size: '4.2 GB',
          price: '49,99 $',
          text: '298 hours',
          vote: 3.9,
          slides: []
        }
      ],
      rating: {
        'store-top': {
          day: [
            {
              id: '1',
              value: 9.713
            },
            {
              id: '2',
              value: 8.415
            },
            {
              id: '3',
              value: 8.222
            },
            {
              id: '4',
              value: 7.82
            },
            {
              id: '5',
              value: 7.19
            },
            {
              id: '6',
              value: 8.362
            },
            {
              id: '7',
              value: 5.192
            },
            {
              id: '8',
              value: 6.112
            },
            {
              id: '9',
              value: 7.211
            },
            {
              id: '10',
              value: 3.123
            },
            {
              id: '11',
              value: 8.412
            },
            {
              id: '12',
              value: 7.123
            },
          ],
          week: [
            {
              id: '1',
              value: 7.713
            },
            {
              id: '2',
              value: 3.415
            },
            {
              id: '3',
              value: 8.222
            },
            {
              id: '4',
              value: 5.82
            },
            {
              id: '5',
              value: 6.19
            },
            {
              id: '6',
              value: 9.362
            },
            {
              id: '7',
              value: 5.192
            },
            {
              id: '8',
              value: 7.112
            },
            {
              id: '9',
              value: 7.211
            },
            {
              id: '10',
              value: 8.123
            },
            {
              id: '11',
              value: 5.412
            },
            {
              id: '12',
              value: 9.123
            },
          ],
          month: [
            {
              id: '1',
              value: 6.713
            },
            {
              id: '2',
              value: 4.415
            },
            {
              id: '3',
              value: 8.222
            },
            {
              id: '4',
              value: 4.82
            },
            {
              id: '5',
              value: 9.19
            },
            {
              id: '6',
              value: 2.362
            },
            {
              id: '7',
              value: 6.192
            },
            {
              id: '8',
              value: 8.112
            },
            {
              id: '9',
              value: 2.211
            },
            {
              id: '10',
              value: 9.123
            },
            {
              id: '11',
              value: 9.412
            },
            {
              id: '12',
              value: 9.123
            },
          ],
          year: [
            {
              id: '1',
              value: 4.713
            },
            {
              id: '2',
              value: 9.415
            },
            {
              id: '3',
              value: 5.222
            },
            {
              id: '4',
              value: 7.82
            },
            {
              id: '5',
              value: 4.19
            },
            {
              id: '6',
              value: 9.362
            },
            {
              id: '7',
              value: 8.192
            },
            {
              id: '8',
              value: 4.112
            },
            {
              id: '9',
              value: 9.211
            },
            {
              id: '10',
              value: 2.123
            },
            {
              id: '11',
              value: 6.412
            },
            {
              id: '12',
              value: 1.123
            },
          ],
          all: [
            {
              id: '1',
              value: 4.713
            },
            {
              id: '2',
              value: 7.415
            },
            {
              id: '3',
              value: 9.222
            },
            {
              id: '4',
              value: 4.82
            },
            {
              id: '5',
              value: 7.19
            },
            {
              id: '6',
              value: 6.362
            },
            {
              id: '7',
              value: 9.192
            },
            {
              id: '8',
              value: 4.112
            },
            {
              id: '9',
              value: 6.211
            },
            {
              id: '10',
              value: 9.123
            },
            {
              id: '11',
              value: 6.412
            },
            {
              id: '12',
              value: 8.123
            },
          ]
        },
        'store-featured': {
          day: [
            {
              id: '2'
            },
            {
              id: '4'
            }
          ],
          week: [
            {
              id: '2'
            },
            {
              id: '4'
            },
            {
              id: '1'
            },
            {
              id: '3'
            }
          ],
          month: [
            {
              id: '2'
            },
            {
              id: '4'
            },
            {
              id: '1'
            },
            {
              id: '3'
            },
            {
              id: '5'
            }
          ],
          year: [
            {
              id: '2'
            },
            {
              id: '4'
            },
            {
              id: '1'
            },
            {
              id: '3'
            },
            {
              id: '5'
            },
            {
              id: '6'
            },
            {
              id: '7'
            }
          ],
          all: [
            {
              id: '2'
            },
            {
              id: '4'
            },
            {
              id: '1'
            },
            {
              id: '3'
            },
            {
              id: '5'
            },
            {
              id: '6'
            },
            {
              id: '7'
            },
            {
              id: '8'
            },
            {
              id: '9'
            }
          ]
        }
      },
      stores: [
        {
          name: 'store-top',
          title: 'Top',
          sort: true,
          order: 'DESC'
        },
        {
          name: 'store-featured',
          title: 'featured'
        }
      ],
      filters: {
        'store-top': {
          default: 'day',
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
            {
              value: 'all',
              text: 'All Time'
            },
          ]
        },
        'store-featured': {
          default: 'day',
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
            {
              value: 'all',
              text: 'All Time'
            },
          ]
        }
      }
    }
  },
  getters: {
    news: state => {
      let news = [];

      for (let current of state.demoData.news) {
        /**
         * @type {({} & {img, releaseDate, publisher, id, text, title}) | any}
         */
        let normalized = Object.assign({}, current);

        if (normalized.id) {
          news.push(normalized);

          continue;
        }

        normalized.id = encodeURI(
          current.title.toLowerCase()
            .replace(/%/g, '')
            .replace(/\s+/g, '_')
        );
        news.push(normalized);
      }

      return news;
    },
    getNewsById: (state, getters) => id => {
      return getters.news.filter((elem) => {
        return elem.id === id;
      }).pop();
    },
    games: state => {
      return state.demoData.games;
    },
    getGameById: state => id => {
      return state.demoData.games.filter((game) => {
        return game.id === id;
      }).pop();
    },
    getFilterByName: (state) => (name) => {
      if (state.demoData.filters.hasOwnProperty(name)) {
        return state.demoData.filters[name];
      } else {
        return {};
      }
    },
    getRatingStoreByName: (state, getters) => name => {
      if (state.demoData.rating.hasOwnProperty(name)) {
        let rating = Object.assign({}, state.demoData.rating[name]);
        let games = getters.games;

        for (let key in rating) {
          if (rating.hasOwnProperty(key)) {
            let result = [];

            rating[key].reduce((res, elem) => {
              let rate = elem.hasOwnProperty('value') ? elem['value'] : null;
              let id = Number.parseInt(elem.id);

              let newElem = games.filter((cur) => {
                return Number.parseInt(cur.id) === id;
              }).pop();

              if (newElem) {
                newElem = Object.assign({}, newElem);

                if (rate) {
                  newElem.rating = rate;
                }

                result.push(newElem);
              }
            }, result);

            rating[key] = result;
          }
        }

        let storeInfo = state.demoData.stores.filter((elem) => {
          return elem.name === name;
        }).pop();

        return {
          sort: storeInfo.sort,
          order: storeInfo.order,
          title: storeInfo ? storeInfo.title : name,
          content: rating
        };
      } else {
        return null;
      }
    }
  },
  mutations: {},
  actions: {},
});
