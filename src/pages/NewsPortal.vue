<template>
  <div>
    <h2 class="text-center text-white">
      News Portal
    </h2>

    <b-row>
      <b-col>
        <b-row class="p-5">
          <b-col class="text-center">
            <b-form id="newsPortal" @submit.prevent="newsPortal">
              <b-form-group label="Title" label-for="title" class="text-left">
                <b-form-input id="title" v-model="title" name="title" required type="text" />
                <b-form-invalid-feedback :state="!titleValidation">
                  Error with Title name
                </b-form-invalid-feedback>
              </b-form-group>

              <b-form-group label="Logo Photo" label-for="logoPhoto" class="text-left">
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

              <!--
              <b-form-group>
                <b-textarea v-model="description" rows="15" cols="15" placeholder="Enter Body..." required> </b-textarea>
              </b-form-group>
-->
              <b-form-group>
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
              <!-- {{html }} -->
              <!--
              <b-form-group label="News Article Images" label-for="images" class="text-left">
                <b-form-file
                  id="newsImages"
                  ref="newsImages"
                  v-model="newsImages"
                  accept="image/*"
                  placeholder="Choose Images..."
                  required
                  multiple
                  drop-placeholder="Drop file here..."
                  @change="selectedFile"
                ></b-form-file>
                <div class="mt-3">Selected file: {{ newsImages ? newsImages.name : "" }}</div>
                <b-form-invalid-feedback :state="!newsImagesValidation">
                  Please enter Images
                </b-form-invalid-feedback>
              </b-form-group>

              
              <b-form-group label="Publisher" label-for="publisher" class="text-left">
                <b-form-input id="publisher" v-model="publisher" name="publisher" required type="text" />
                <b-form-invalid-feedback :state="!publisherValidation">
                  Error with Publisher
                </b-form-invalid-feedback>
              </b-form-group>
-->
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
              form="newsPortal"
              :disabled="loading"
            >
              <span v-if="!loading" style="max-width: 1em; max-height: 1em;">Submit</span>
              <b-spinner v-else></b-spinner>
            </b-button>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-modal id="newsConfirm" ref="newsConfirm" class="newsConfirm" centered hide-footer title="Game Submission">
      <b-row class="my-3 mb-3">
        <b-col class="text-center">
          <h5 class="font-weight-normal">
            Your News Article has been submitted!
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
import axios from "axios";
import aws from "aws-sdk";

aws.config.update({
  accessKeyId: "AKIASKCWLEX6DRFAPAMQ",
  secretAccessKey: "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",
  region: "us-east-2"
});

export default {
  name: "NewsPortal",
  components: {
    EditorContent,
    EditorMenuBar
  },
  data() {
    return {
      title: "",
      titleValidation: false,
      logoPhoto: null,
      logoPhotoValidation: false,
      newsImages: [],
      newsImagesValidation: false,
      description: "",
      descriptionValidation: false,
      publisher: "",
      publisherValidation: false,
      loading: false,
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
  methods: {
    async newsPortal() {
      this.loading = true;
      console.log("made it to news portal function...");
      console.log("title: " + this.title);
      //console.log("description: " + this.description);
      console.log("outputting html from editor below...");
      console.log(this.html);
      console.log(this.logoPhoto);
      console.log(this.newsImages);

      var logoPhotoURL = await this.uploadSingleFileToS3(this.title, this.logoPhoto, this.logoPhoto.name);
      //var newsImagesURL = await this.uploadMultipleFilesToS3(this.title, this.newsImages);

      console.log("logoPhotoURL: " + logoPhotoURL);
      //console.log(newsImagesURL);

      let images = {
        main: logoPhotoURL,
        slides: []
      };

      /*
      if (newsImagesURL != null) {
        for (var i = 0; i < newsImagesURL.length; i++) {
          console.log("newsImagesURL at position: " + i);
          console.log(newsImagesURL[i]);
          images.slides.push(newsImagesURL[i]);
        }
      }*/

      console.log("outputting images object below...");
      console.log(images);

      let newsItem = {
        title: this.title,
        description: this.html,
        images: images
      };

      try {
        axios.post("/news", newsItem);
      } catch (e) {
        console.log(e);
      }
      this.formReset();
      this.loading = false;
      this.showModal();
    },

    formReset() {
      this.title = null;
      this.description = null;
      this.logoPhoto = null;
      this.newsImages = null;
      this.editor.clearContent(true);
    },

    selectedFile() {
      console.log("selectedFile...");
    },
    showModal() {
      this.$refs["newsConfirm"].show();
    },
    hideModal() {
      this.$refs["newsConfirm"].hide();
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
              Bucket: "voxpop-news-bucket",
              Key: concatenatedTitleName + "/" + date.getTime() + "_" + concatName,
              Body: files[i],
              ACL: "public-read"
            },
            function(err, data) {
              if (err) {
                reject(err);
              } else {
                localArray.push(data.Location);
                console.log(localArray);
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

        var regName = name;
        var concatName = regName.replace(/ /g, "-");

        await s3.upload(
          {
            Bucket: "voxpop-news-bucket",
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
