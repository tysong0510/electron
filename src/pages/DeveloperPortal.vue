<template>
  <div>
    <h2 class="text-center text-white">
      Developer Portal
    </h2>

    <b-row>
      <b-col>
        <b-row class="p-5">
          <b-col class="text-center">
            <b-form id="developerPortal" @submit.prevent="developerPortal">
              <b-form-group label="Developer" label-for="developer" class="text-left">
                <b-form-input id="developer" ref="developerPortal" v-model="developer" name="developer" required type="text" />
                <b-form-invalid-feedback :state="!developerValidation">
                  Error with developer name
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label="Title" label-for="title" class="text-left">
                <b-form-input id="title" v-model="title" name="title" required type="text" />
                <b-form-invalid-feedback :state="!titleValidation">
                  Error with Title name
                </b-form-invalid-feedback>
              </b-form-group>
              <!--
              <b-form-group label="Description" label-for="description" class="text-left">
                <b-form-input id="description" v-model="description" name="description" required type="text" />
                <b-form-invalid-feedback :state="!descriptionValidation">
                  Error with Description
                </b-form-invalid-feedback>
              </b-form-group>
-->

              <b-form-group label="Description" class="text-left">
                <div class="editor">
                  <editor-menu-bar v-slot="{ commands, isActive }" :editor="editor">
                    <div class="menubar text-left">
                      <button class="menubar__button" :class="{ 'is-active': isActive.bold() }" type="button" @click="commands.bold">
                        <b-icon-type-bold></b-icon-type-bold>
                      </button>

                      <button class="menubar__button" :class="{ 'is-active': isActive.italic() }" type="button" @click="commands.italic">
                        <b-icon-type-italic></b-icon-type-italic>
                      </button>

                      <button class="menubar__button" :class="{ 'is-active': isActive.strike() }" type="button" @click="commands.strike">
                        <b-icon-type-strikethrough></b-icon-type-strikethrough>
                      </button>

                      <button
                        class="menubar__button"
                        :class="{ 'is-active': isActive.underline() }"
                        type="button"
                        @click="commands.underline"
                      >
                        <b-icon-type-underline></b-icon-type-underline>
                      </button>

                      <button class="menubar__button" :class="{ 'is-active': isActive.code() }" type="button" @click="commands.code">
                        <b-icon-code></b-icon-code>
                      </button>

                      <button
                        class="menubar__button"
                        :class="{ 'is-active': isActive.paragraph() }"
                        type="button"
                        @click="commands.paragraph"
                      >
                        p
                      </button>

                      <button
                        class="menubar__button"
                        :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                        type="button"
                        @click="commands.heading({ level: 1 })"
                      >
                        H1
                      </button>

                      <button
                        class="menubar__button"
                        :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                        type="button"
                        @click="commands.heading({ level: 2 })"
                      >
                        H2
                      </button>

                      <button
                        class="menubar__button"
                        :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                        type="button"
                        @click="commands.heading({ level: 3 })"
                      >
                        H3
                      </button>

                      <button
                        class="menubar__button"
                        :class="{ 'is-active': isActive.bullet_list() }"
                        type="button"
                        @click="commands.bullet_list"
                      >
                        <b-icon-list-ul></b-icon-list-ul>
                      </button>

                      <button
                        class="menubar__button"
                        :class="{ 'is-active': isActive.ordered_list() }"
                        type="button"
                        @click="commands.ordered_list"
                      >
                        <b-icon-list-ol></b-icon-list-ol>
                      </button>

                      <button
                        class="menubar__button"
                        :class="{ 'is-active': isActive.blockquote() }"
                        type="button"
                        @click="commands.blockquote"
                      >
                        <b-icon-blockquote-left></b-icon-blockquote-left>
                      </button>

                      <button
                        class="menubar__button"
                        :class="{ 'is-active': isActive.code_block() }"
                        type="button"
                        @click="commands.code_block"
                      >
                        <b-icon-code-slash></b-icon-code-slash>
                      </button>

                      <button class="menubar__button" type="button" @click="commands.horizontal_rule">
                        <b-icon-type-underline></b-icon-type-underline>
                      </button>

                      <button class="menubar__button" type="button" @click="commands.undo">
                        <b-icon-arrow-counterclockwise></b-icon-arrow-counterclockwise>
                      </button>

                      <button class="menubar__button" type="button" @click="commands.redo">
                        <b-icon-arrow-clockwise></b-icon-arrow-clockwise>
                      </button>
                    </div>
                  </editor-menu-bar>
                  <editor-content class="editor__content" :editor="editor" :v-model="description" />
                </div>
              </b-form-group>

              <b-form-group label="Logo Photo (2:1)" label-for="logoPhoto" class="text-left">
                <b-form-file
                  v-model="logoPhoto"
                  accept="image/*"
                  placeholder="Choose Logo Photo..."
                  required
                  drop-placeholder="Drop file here..."
                ></b-form-file>
                <div class="mt-3">Selected file: {{ logoPhoto ? logoPhoto.name : "" }}</div>
                <b-form-invalid-feedback :state="!logoPhotoValidation">
                  Please enter Logo Photo
                </b-form-invalid-feedback>
              </b-form-group>

              <b-form-group label="Gameplay Images" label-for="images" class="text-left">
                <b-form-file
                  id="userFiles"
                  ref="userFile"
                  v-model="images"
                  accept="image/*"
                  placeholder="Choose Images..."
                  required
                  multiple
                  drop-placeholder="Drop file here..."
                  @change="selectedFile"
                ></b-form-file>
                <div class="mt-3">Selected file: {{ images ? images.name : "" }}</div>
                <b-form-invalid-feedback :state="!imagesValidation">
                  Please enter Images
                </b-form-invalid-feedback>
              </b-form-group>

              <!--
              <b-form-group label="Images" label-for="images" class="text-left">
                <input ref="userFile" type="file" name="images" @change="selectedFile" />
              </b-form-group>
-->
              <b-form-group label="Publisher" label-for="publisher" class="text-left">
                <b-form-input id="publisher" v-model="publisher" name="publisher" required type="text" />
                <b-form-invalid-feedback :state="!publisherValidation">
                  Error with Publisher
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label="Price" label-for="price" class="text-left">
                <b-input-group prepend="$" class="dollarSign">
                  <b-form-input id="price" v-model="price" name="price" required placeholder="0.00" type="number" step="0.01" min="0" />
                </b-input-group>
                <b-form-invalid-feedback :state="!priceValidation">
                  Error with Price
                </b-form-invalid-feedback>
              </b-form-group>

              <b-form-group label="Packed Game File" label-for="magnetURI" class="text-left">
                <b-form-file
                  v-model="magnetURI"
                  accept=".exe, .dmg"
                  placeholder="Choose game file..."
                  drop-placeholder="Drop file here..."
                ></b-form-file>
                <div class="mt-3">Selected file: {{ magnetURI ? magnetURI.name : "" }}</div>
                <b-form-invalid-feedback :state="!magnetURIValidation">
                  {{ gameFileMsg }}
                </b-form-invalid-feedback>
              </b-form-group>
              <!--
              <b-form-group label="Profit Sharing Percentage" label-for="profitSharing" class="text-left">
                <b-input-group append="%" class="dollarSign">
                  <b-form-input
                    id="profitSharing"
                    v-model="profitSharing"
                    name="profitSharing"
                    placeholder="00"
                    type="number"
                    step="1.00"
                    min="0"
                    max="100"
                  />
                </b-input-group>
                <b-form-invalid-feedback :state="!profitSharingValidation">
                  Error with Price
                </b-form-invalid-feedback>
              </b-form-group>
-->
              <b-form-invalid-feedback :state="!otherError">
                Error connecting to server. Please try again. Error message is: {{ msg }}
              </b-form-invalid-feedback>
            </b-form>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="w-100 d-flex">
            <b-button
              size="lg"
              variant="primary"
              class="btn-auth"
              style="min-width: 180px; margin: 0 auto;"
              type="submit"
              form="developerPortal"
              :disabled="loading"
            >
              <span v-if="!loading" style="max-width: 1em; max-height: 1em;">Submit</span>
              <b-spinner v-else></b-spinner>
            </b-button>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-modal id="developerConfirm" ref="developerConfirm" class="modalConfirm" centered hide-footer title="Game Submission">
      <b-row class="my-3 mb-3">
        <b-col class="text-center">
          <h5 class="font-weight-normal">
            Your game has been submitted!
          </h5>
        </b-col>
      </b-row>
      <b-row class="my-3">
        <b-col class="text-center">
          <b-button size="lg" variant="primary" class="btn-auth" style="max-width: 250px;" @click="hideModal">
            Continue
          </b-button>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
//import { ACTION_GAME } from "../store/modules/auth";
//import Axios from "axios";
import user from "../mixins/user";
import { USER } from "../store/modules/auth";
import axios from "axios";
import aws from "aws-sdk";
import createTorrent from "create-torrent";
import magnetLink from "magnet-link";
//import WebTorrent from "webtorrent";
//import fs from "fs";
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History
} from "tiptap-extensions";

aws.config.update({
  accessKeyId: "AKIASKCWLEX6DIWB2K4E",
  secretAccessKey: "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",
  region: "us-east-2"
});

//const s3 = aws.s3();

export default {
  name: "DeveloperPortal",
  components: {
    EditorContent,
    EditorMenuBar
  },
  mixins: user,
  data() {
    return {
      developer: null,
      developerValidation: false,
      title: null,
      titleValidation: false,
      logoPhoto: null,
      logoPhotoValidation: false,
      images: [],
      imagesValidation: false,
      description: null,
      descriptionValidation: false,
      publisher: null,
      publisherValidation: false,
      price: null,
      priceValidation: false,
      magnetURI: [],
      magnetURIValidation: false,
      profitSharing: null,
      profitSharingValidation: false,
      gameFileMsg: "",
      otherError: false,
      overallErrors: false,
      packed: false,
      gameSubmissionData: [],
      //endpointURL: "https://voxpop-image-bucket.s3.us-east-2.amazonaws.com/",
      ws: "",
      xs: "",
      loading: false,
      submissionError: false,
      msg: "",
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History()
        ],
        onUpdate: ({ getHTML }) => {
          this.html = getHTML();
        }
      }),
      html: ""
    };
  },
  computed: {
    avatar: {
      get() {
        const userAvatar = this[USER];

        if (userAvatar) {
          //console.log("user has a profile picture!");
          //return `${baseURL}/profile/${this[USER].id}/${userAvatar}`;
          return userAvatar; //returning string directly from AWS
        }
        /**
         * Return 1x1 transparent PNG pixel
         */
        return null;
      }
    }
  },
  methods: {
    formReset() {
      this.developer = null;
      this.title = null;
      this.images = null;
      this.description = null;
      this.publisher = null;
      this.magnetURI = null;
      this.price = null;
      this.logoPhoto = null;
      this.editor.clearContent(true);
    },
    showModal() {
      this.$refs["developerConfirm"].show();
    },
    hideModal() {
      this.$refs["developerConfirm"].hide();
    },
    goTo(modal = "profile") {
      if (typeof modal === "object") {
        return;
      }

      this.$router.push({ query: Object.assign({}, this.$route.query, { auth: modal }, this.noRedirect ? { "no-redirect": true } : {}) });
    },
    goBack() {
      this.$router.replace({
        query: Object.assign({}, this.$route.query, { auth: "developerPortal" }, this.noRedirect ? { "no-redirect": true } : {})
      });
    },
    selectedFile() {
      //need to figure out how to show contents of object
      console.log("inside of selected File");
      console.log(this.$refs);
      var fileInput = document.getElementById("userFiles");
      this.images = fileInput.files;
      //console.log(files);

      //this.images = this.$refs.userFile.files;
      //this.images = this.$refs.userFile.files;
      console.log(this.images);
    },
    async isPacked(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
          //resolve(reader.result);
          var array = new Uint8Array(reader.result);
          resolve(array);
        };

        reader.onerror = reject;

        reader.readAsArrayBuffer(file);
      });
    },
    async createTorrentFile(userGame) {
      // console.log("outputting webtorrent variable below...");
      //console.log(WebTorrent);
      return new Promise((resolve, reject) => {
        createTorrent(
          userGame,
          {
            announceList: [["ws://localhost:8000"], ["udp://localhost:8000"]]
          },
          (err, torrent) => {
            if (!err) {
              resolve(torrent);
            } else {
              reject(err);
            }
          }
        );
      });
    },
    async createMagnetURI(createdTorrentFile, xs, ws) {
      return new Promise((resolve, reject) => {
        magnetLink(createdTorrentFile, (linkErr, linkData) => {
          if (!linkErr) {
            var magnetLink = linkData + "&dn=" + this.magnetURI.name + ws + xs;

            //console.log("magnetLink: " + magnetLink);
            resolve(magnetLink);
          } else {
            reject(linkErr);
          }
        });
      });
    },
    async developerPortal(evt) {
      evt.preventDefault();
      //console.log("Images from developer portal: " + this.$refs.userFile.files);
      this.loading = true;

      //alert("Developer Portal is not active at the moment");

      /*const formData = new FormData();
      formData.append("developer", this.developer);
      formData.append("title", this.title);
      formData.append("description", this.description);

      formData.append("publisher", this.publisher);
      formData.append("price", this.price);
      formData.append("gameFile", this.magnetURI);
      //console.log("This is what magnetURI: " + this.magnetURI);

      formData.append("logoPhoto", this.logoPhoto);

      for (var i = 0; i < this.images.length; i++) {
        let imageFiles = this.images[i];
        console.log("This is image " + i + ": " + imageFiles);
        formData.append("images", imageFiles);
      }

      try {
        await axios.post("/games", formData);
      } catch (err) {
        const res = err && err.response;
        this.overallErrors = true;

        //error check for game being packed
        if (res && res.status == 406) {
          this.magnetURIValidation = true;
          this.gameFileMsg = "This game is not packed using VoxPop Game's packer, please try again";
        } 
        else if (res && res.status == 400) {
          this.magnetURIValidation = true;
          this.gameFileMsg = "The time limit to submit this packed game has passed, please try again with a newer packed version";
        }
        else {
          this.otherError = true;
          this.msg = err.message;
          console.log(err.message);
        }
        this.loading = false;
      }*/

      /*
      console.log(this.magnetURI);
      var stringy = "";

      //Need to make a check to see if game is packed
      var reader = new FileReader();
      //reader.readAsDataURL(this.magnetURI);
      reader.readAsArrayBuffer(this.magnetURI);

      reader.onload = function() {
        //stringy = reader.result;
        console.log(reader.result);
        var array = new Uint8Array(reader.result);
        console.log(array);

        var start = 0;
        var n = 1000000;
        var i = 0;
        while (i < array.length) {
          while (start < n) {
            stringy += String.fromCharCode(array[start]);
            start++;
          }
          //console.log("stringy after 12 is: " + stringy);
          if (stringy.includes("<VoxPop Game")) {
            i = array.length;
            this.packed = true;
            console.log("found string");
          } else {
            n = n * 2;
            i = start;
            //stringy = "";
            console.log("did not find string");
          }

          if (!this.packed) {
            this.magnetURIValidation = true;
            this.gameFileMsg = "This game is not packed...";
          }
        }

        //console.log("true or false: " + stringy.includes("<VoxPop Game"));

        //console.log(binaryString);
      };*/

      /**
       * This code is used to create Torrent file then magnet link
       */

      /*
      console.log(this.magnetURI);

      createTorrent(this.magnetURI, (err, torrent) => {
        if (!err) {
          console.log(torrent);



          magnetLink(torrent, (linkErr, linkData) => {
            if(!linkErr) {
              console.log(linkData);
              var magnetLink =
                linkData +
                "&dn=" +
                this.magnetURI.name +
                "&ws=https%3A%2F%2Fvoxpop-image-bucket.s3.us-east-2.amazonaws.com%2Ftorrents%2F" +
                "&xs=https%3A%2F%2Fvoxpop-image-bucket.s3.us-east-2.amazonaws.com%2Ftorrents%2Ftest.torrent"
                console.log("magnetLink: " + magnetLink);
                //magnet:?xt=urn:btih:315bc8011ff4cab4a444a61571864d4af3c1abf9&dn=packedBeglitchedAprilEighteenth.exe&ws=https%3A%2F%2Fvoxpop-image-bucket.s3.us-east-2.amazonaws.com%2Ftorrents%2F&xs=https%3A%2F%2Fvoxpop-image-bucket.s3.us-east-2.amazonaws.com%2Ftorrents%2Ftest.torrent
            } else {
              console.log(linkErr);
            }
          })
        }
        else {
          console.log(err);
        }
      })*/

      /**
       * Code below here is used to submit files to aws and DB
       */

      var packedID = "";
      try {
        const array = await this.isPacked(this.magnetURI);
        //var array = new Uint8Array(isPackedResult);
        console.log(array);

        var stringy = "";
        var start = 0;
        var n = 1000000;
        var i = 0;

        var foundStart = null;
        var foundEnd = null;
        while (i < array.length) {
          while (start < n) {
            stringy += String.fromCharCode(array[start]);
            start++;
          }
          //console.log("stringy after 12 is: " + stringy);
          if (stringy.includes("<VoxPop Game")) {
            i = array.length;
            this.packed = true;
            console.log("found string");

            //NEED TO GET the first index and last index of this string from in here then create another loop to get game ID
            foundStart = stringy.indexOf("<VoxPop Game");
            //console.log("foundStart: " + foundStart);
            foundEnd = stringy.indexOf(">", foundStart);
            //console.log("foundEnd: " + foundEnd);

            for (var j = foundStart; j < foundEnd; j++) {
              packedID += String.fromCharCode(array[j]);
            }

            packedID = packedID.replace(/\D/g, "");
          } else {
            n = n * 2;
            i = start;
            //stringy = "";
            console.log("did not find string");
          }
        }
      } catch (e) {
        console.log(e.message);
      }

      if (this.packed) {
        console.log("found...");
        console.log("packedID: " + packedID);
        console.log("title: ", this.title);
        console.log("logo photo: ", this.logoPhoto);
        console.log("logoPhoto name: ", this.logoPhoto.name);
        var logoPhotoFileURL = await this.uploadSingleFileToS3(this.title, this.logoPhoto, this.logoPhoto.name);
        var gamePlayFileURLS = await this.uploadMultipleFilesToS3(this.title, this.images);
        // var torrentFile = await this.createTorrentFile(this.magnetURI);
        // console.log("torrentFile output from dev portal below...");
        // console.log(torrentFile);
        var gameFileURL = await this.uploadSingleFileToS3(this.title, this.magnetURI, this.magnetURI.name);
        console.log("logo photo url: ", logoPhotoFileURL);
        console.log("gamePlayFileURLs: ", gamePlayFileURLS);
        console.log("gameFileURL: ", gameFileURL);

        //var gameFileURL = await this.uploadSingleFileToS3(this.title, torrentFile, this.magnetURI.name);
        /* gameFileURL = gameFileURL.replace(/:/g, "%3A");
        gameFileURL = gameFileURL.replace(/\//g, "%2F");

        this.xs = "&xs=" + gameFileURL;

        
        var lastIndex = gameFileURL.lastIndexOf("%2F");
        this.ws = "&ws=" + gameFileURL.slice(0, lastIndex + 3);
        //this.ws = "&ws=" + gameFileURL;
        var magnetLink = await this.createMagnetURI(torrentFile, this.xs, this.ws);
        console.log("magnetLink is:  " + magnetLink);
        console.log("logoPhotoURL: " + logoPhotoFileURL);
        console.log(gamePlayFileURLS);
        console.log("gameFileURL: " + gameFileURL);
        console.log("Next line is torrent file");
        console.log(torrentFile);
        //action to send to db
*/
        const formData = new FormData();
        formData.append("developer", this.developer);
        formData.append("title", this.title);

        //formData.append("description", this.description);
        /**
         * Put html as description because of editor
         */
        formData.append("description", this.html);

        formData.append("publisher", this.publisher);
        formData.append("price", this.price);
        //formData.append("gameFile", magnetLink);
        formData.append("gameFile", gameFileURL);
        //console.log("This is what magnetURI: " + this.magnetURI);

        formData.append("logoPhoto", logoPhotoFileURL);

        for (var k = 0; k < gamePlayFileURLS.length; k++) {
          let imageFiles = gamePlayFileURLS[k];
          console.log("This is image " + k + ": " + imageFiles);
          formData.append("images", imageFiles);
        }
        formData.append("gameID", packedID);

        try {
          await axios.post("/games", formData);
        } catch (err) {
          const res = err && err.response;

          if (res && res.status == 404) {
            this.magnetURIValidation = true;
            this.gameFileMsg = "The time limit to submit this packed game has passed, please try again with a newly packed version";
          } else {
            this.otherError = true;
            this.msg = err.message;
            console.log(err.message);
          }
        }

        this.formReset();
        this.$refs["developerConfirm"].show();
      } else {
        this.magnetURIValidation = true;
        this.gameFileMsg = "This game is not packed...Please try again";
      }

      this.loading = false;
    },

    async uploadMultipleFilesToS3(title, files) {
      return new Promise(async function(resolve, reject) {
        var localArray = [];
        var date = new Date();
        var s3 = new aws.S3();

        var concatenatedTitleName = title;
        concatenatedTitleName = concatenatedTitleName.replace(/ /g, "-");

        for (var i = 0; i < files.length; i++) {
          var regName = files[i].name;
          var concatName = regName.replace(/ /g, "-");

          await s3.upload(
            {
              Bucket: "voxpop-image-bucket",
              Key: concatenatedTitleName + "/" + date.getTime() + "_" + concatName,
              Body: files[i],
              ACL: "public-read"
            },
            function(err, data) {
              if (err) {
                reject(err);
              } else {
                localArray.push(data.Location);
              }
            }
          );
        }
        resolve(localArray);
      });
    },

    async uploadSingleFileToS3(title, file, name) {
      return new Promise(async function(resolve, reject) {
        var date = new Date();
        var s3 = new aws.S3();

        var concatenatedTitleName = title;
        concatenatedTitleName = concatenatedTitleName.replace(/ /g, "-");

        console.log("name inside upload function: ", name);
        var regName = name;
        console.log("regName: ", regName);
        var concatName = regName.replace(/ /g, "-");

        await s3.upload(
          {
            Bucket: "voxpop-image-bucket",
            Key: concatenatedTitleName + "/" + date.getTime() + "_" + concatName,
            Body: file,
            ACL: "public-read"
          },
          function(err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data.Location);
              console.log("upload complete");
            }
          }
        );
      });
    }
  }
};
</script>

<style lang="scss">
@import "../assets/scss/main.scss";

.custom-file-input:lang(en) ~ .custom-file-label::after {
  content: "Browse Files";
  color: #696e80;
  background-color: transparent;
}

.input-group-text {
  background-color: transparent;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.menubar__button {
  background: transparent;
  color: #696e80;
  text-align: left;
}

.is-active {
  background-color: white;
}

.editor__content {
  border: solid #696e80 1px;
  height: 250px;
  position: relative;
}

.ProseMirror {
  outline-color: white;
  height: 250px;
  text-align: left;
  overflow: auto;
}

.ProseMirror p {
  margin-left: 10px;
}
</style>
