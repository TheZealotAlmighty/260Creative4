<template>
  <div class="creator">
    <h1>Submit Your Character</h1>
    <div class="heading">
      <div class="circle">1</div>
      <h2>Add a Character</h2>
    </div>
    <div class="add">
      <div class="form">
        <input v-model="name" placeholder="Name" />
        <p></p>
        <input v-model="description" placeholder="Description" />
        <p></p>
        <input v-model="age" placeholder="Age" />
        <p></p>
        <input v-model="powers" placeholder="Powers" />
        <p></p>
        <input v-model="creator" placeholder="Creator" />
        <p></p>
        <input type="file" name="photo" @change="fileChanged" />
        <button @click="upload">Upload</button>
      </div>
      <div class="upload" v-if="addItem">
        <h2>{{ addItem.title }}</h2>
        <img :src="addItem.path" />
      </div>
    </div>
    <div class="heading">
      <div class="circle">2</div>
      <h2>Edit/Delete a Character (Please be nice and only edit/delete your own characters)</h2>
    </div>
    <div class="edit">
      <div class="form">
        <input v-model="findTitle" placeholder="Search" />
        <div class="suggestions" v-if="suggestions.length > 0">
          <div
            class="suggestion"
            v-for="s in suggestions"
            :key="s.id"
            @click="selectItem(s)"
          >
            {{ s.name }}
          </div>
        </div>
      </div>
      <div class="upload" v-if="findItem">
        <input v-model="findItem.name" />
        <p></p>
        <input v-model="findItem.age" />
        <p></p>
        <input v-model="findItem.description" />
        <p></p>
        <input v-model="findItem.powers" />
        <p></p>
        <input v-model="findItem.creator" />
        <p></p>
        <img :src="findItem.path" />
      </div>
      <div class="actions" v-if="findItem">
        <button @click="deleteItem(findItem)">Delete</button>
        <button @click="editItem(findItem)">Edit</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Admin",
  data() {
    return {
      name: "",
      file: null,
      description: "",
      age: null,
      powers: "",
      addItem: null,
      items: [],
      findTitle: "",
      findItem: null,
    };
  },
  computed: {
    suggestions() {
      let items = this.items.filter(item => item.name.toLowerCase().startsWith(this.findTitle.toLowerCase()));
      return items.sort((a, b) => a.name > b.name);
    }
  },
  created() {
    this.getItems();
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0];
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append("photo", this.file, this.file.name);
        let r1 = await axios.post("/api/photos", formData);
        let r2 = await axios.post("/api/items", {
          name: this.name,
          path: r1.data.path,
          age: this.age,
          description: this.description,
          powers: this.powers,
          creator: this.creator,
        });
        this.addItem = r2.data;
        this.$alert("Your submission has been accepted.");
      } catch (error) {
        //console.log(error);
        this.$alert("Your submission failed.");
      }
    },
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      } catch (error) {
        //console.log(error);
      }
    },
    selectItem(item) {
      this.findTitle = "";
      this.findItem = item;
    },
    async deleteItem(item) {
      try {
        await axios.delete("/api/items/" + item._id);
        this.findItem = null;
        this.getItems();
        this.$alert("Character deleted.  I hope that was yours.");
        return true;
      } catch (error) {
        //console.log(error);
        this.$alert("Failed to delete the character.");
      }
    },
    async editItem(item) {
      try {
        await axios.put("/api/items/" + item._id, {
          name: this.findItem.name,
          description: this.findItem.description,
          age: this.findItem.age,
          powers: this.findItem.powers,
        });
        this.findItem = null;
        this.getItems();
        this.$alert("Character information updated.  I hope that was your character.");
        return true;
      } catch (error) {
        //console.log(error);
        this.$alert("Failed to update the character information.");
      }
    },
  },
};
</script>

<style scoped>
.image h2 {
  font-style: italic;
  font-size: 1em;
}

.heading {
  display: flex;
  margin-bottom: 20px;
  margin-top: 20px;
}

.heading h2 {
  margin-top: 8px;
  margin-left: 10px;
}

.add,
.edit {
  display: flex;
}

.circle {
  border-radius: 50%;
  width: 18px;
  height: 18px;
  padding: 8px;
  background: #333;
  color: #fff;
  text-align: center;
}

/* Form */
input,
textarea,
select,
button {
  font-family: "Montserrat", sans-serif;
  font-size: 1em;
}

.form {
  margin-right: 50px;
}

/* Uploaded images */
.upload h2 {
  margin: 0px;
}

.upload img {
  max-width: 300px;
}

/* Suggestions */
.suggestions {
  width: 200px;
  border: 1px solid #ccc;
}

.suggestion {
  min-height: 20px;
}

.suggestion:hover {
  background-color: #5bdeff;
  color: #fff;
}
</style>
