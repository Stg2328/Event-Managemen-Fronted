<template>
  <div class="mt-20 px-4">
    <!-- Toggle Form Button -->
    <div style="display: flex; flex-direction: row-reverse">
      <button
        @click="toggleForm"
        class="mt-5 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-md"
      >
        {{ editingEvent ? "Close Form" : "Create Event" }}
      </button>
    </div>

    <!-- Event Form -->
    <form
      v-if="showForm"
      @submit.prevent="submitEvent"
      class="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto mt-6 border border-gray-400"
    >
      <h2 class="text-2xl font-semibold text-center">
        {{ editingEvent ? "Update Event" : "Create Event" }}
      </h2>
      <div class="mt-4">
        <input
          v-model="eventForm.title"
          placeholder="Event Title"
          required
          class="w-full border p-2 rounded"
        />
      </div>
      <div class="mt-4">
        <textarea
          v-model="eventForm.description"
          placeholder="Event Description"
          required
          class="w-full border p-2 rounded"
        ></textarea>
      </div>
      <div class="mt-4 grid grid-cols-2 gap-4">
        <input
          type="date"
          v-model="eventForm.date"
          :min="minDate"
          required
          class="border p-2 rounded w-full"
        />
      </div>

      <!-- File Upload -->
      <div class="mt-4">
        <input
          type="file"
          @change="handleFileChange"
          accept=".png"
          class="w-full border p-2 rounded"
        />
        <p v-if="fileError" class="text-red-500 text-sm">{{ fileError }}</p>
      </div>

      <button
        type="submit"
        class="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
      >
        {{ editingEvent ? "Update Event" : "Create Event" }}
      </button>
    </form>

    <!-- Search & Sorting Controls -->
    <div class="flex justify-between mt-4">
      <input
        v-model="searchQuery"
        @input="searchEvents"
        placeholder="Search Events"
        class="border p-2 rounded w-1/3"
      />
      <div class="flex space-x-4">
        <button
          @click="sortEvents('title', sortOrder === 'asc' ? 'desc' : 'asc')"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Sort by Title
        </button>
        <button
          @click="sortEvents('date', sortOrder === 'asc' ? 'desc' : 'asc')"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Sort by Date
        </button>
      </div>
    </div>

    <!-- Event Listing with Pagination -->
    <div
      v-if="events.length && !showForm"
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 px-4"
    >
      <div
        v-for="event in events"
        :key="event.id"
        class="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between"
      >
        <!-- Event Image or Default Image -->
        <div class="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
          <img
            v-if="!editingEvent"
            :src="event.fileUrl || require('@/assets/3718970.jpg')"
            alt="Event Image"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Event Title with Icon -->
        <div class="flex items-center mt-4">
          <i class="fas fa-calendar-alt text-blue-500 mr-2"></i>
          <h3 class="text-xl font-semibold">{{ event.title }}</h3>
        </div>

        <!-- Event Description with Icon -->
        <div class="flex items-center mt-2">
          <i class="fas fa-info-circle text-gray-500 mr-2"></i>
          <p class="text-gray-600 text-sm md:text-base">
            {{ event.description }}
          </p>
        </div>

        <!-- Event Date with Icon -->
        <div class="flex items-center mt-2">
          <i class="fas fa-calendar-day text-gray-500 mr-2"></i>
          <p class="text-gray-500 text-sm md:text-base">
            Date: {{ formatDate(event.date) }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between items-center mt-4 space-x-4">
          <!-- Edit Button with Icon -->
          <button
            @click="editEvent(event)"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2 text-sm md:text-base transition-all duration-300 transform hover:scale-105"
          >
            <i class="fas fa-edit"></i>
            <span>Edit</span>
          </button>

          <button
            @click="deleteEvent(event.id)"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center space-x-2 text-sm md:text-base transition-all duration-300 transform hover:scale-105"
          >
            <i class="fas fa-trash-alt"></i>
            <span>Delete</span>
          </button>

          <button
            v-if="event.fileUrl"
            @click.prevent="downloadImage(event)"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center space-x-2 text-sm md:text-base transition-all duration-300 transform hover:scale-105"
          >
            <i class="fas fa-download"></i>
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>

    <div
      v-else-if="!showForm && events.length === 0"
      class="text-center text-gray-500 mt-10"
    >
      No events found
    </div>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="flex justify-center mt-6">
      <button
        @click="changePage(page - 1)"
        :disabled="page <= 1"
        class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
      >
        Prev
      </button>
      <span class="mx-4 py-2">Page {{ page }} of {{ totalPages }}</span>
      <button
        @click="changePage(page + 1)"
        :disabled="page >= totalPages"
        class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { saveAs } from "file-saver";
export default {
  name: "EventManagement",
  data() {
    return {
      searchQuery: "",
      fileError: "",
      sortOrder: "asc",
      minDate: new Date().toISOString().split("T")[0],
    };
  },
  computed: {
    ...mapState({
      events: (state) => state.eventform.events,
      eventForm: (state) => state.eventform.eventForm,
      editingEvent: (state) => state.eventform.editingEvent,
      isLoading: (state) => state.eventform.isLoading,
      page: (state) => state.eventform.page,
      totalPages: (state) => state.eventform.totalPages,
    }),
    ...mapGetters({
      sortBy: "eventform.sortBy",
    }),
    showForm() {
      return this.$store.state.eventform.formVisible;
    },
  },
  methods: {
    ...mapActions({
      fetchEvents: "eventform/fetchEvents",
      submitEvent: "eventform/submitEvent",
      deleteEvent: "eventform/deleteEvent",
      setSearch: "eventform/setSearch",
      setSort: "eventform/setSort",
      setPagination: "eventform/setPagination",
      setFile: "eventform/setFile",
    }),

    toggleForm() {
      this.fileError = "";
      this.$store.dispatch("eventform/setFile", null);
      this.$store.commit("eventform/resetEventForm");

      if (this.editingEvent) {
        this.$store.commit("eventform/setEditingEvent", null);
      }

      const formVisible = !this.$store.state.eventform.formVisible;
      this.$store.commit("eventform/setFormVisible", formVisible);
    },

    formatDate(date) {
      const d = new Date(date);
      return d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },

    handleFileChange(event) {
      const file = event.target.files[0];

      if (file) {
        if (file.type !== "image/png") {
          this.fileError = "Only PNG files are allowed.";
          this.$store.dispatch("eventform/setFile", null);
          return;
        }

        if (file.size > 2 * 1024 * 1024) {
          this.fileError = "File size must be less than 2MB.";
          this.$store.dispatch("eventform/setFile", null);
          return;
        }

        this.fileError = "";
        this.$store.dispatch("eventform/setFile", file);
      }
    },

    async submitEvent() {
      if (this.fileError) {
        return;
      }

      await this.$store.dispatch("eventform/submitEvent");
      this.toggleForm();
      this.fetchEvents();
    },

    searchEvents() {
      this.setSearch(this.searchQuery);
      this.fetchEvents();
    },
    async downloadImage(eventData) {
      try {
        if (!eventData.fileUrl) {
          console.error("No file URL available for this event.");
          return;
        }

        const response = await fetch(eventData.fileUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch file");
        }

        const blob = await response.blob();
        const fileName = eventData.fileUrl.split("/").pop();
        saveAs(blob, fileName);
      } catch (error) {
        console.error("Error downloading the file:", error);
      }
    },

    sortEvents(sortBy, sortOrder) {
      this.setSort({ sortBy, sortOrder });
      this.fetchEvents();
    },

    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.setPagination({ page, limit: 10 });
      this.fetchEvents();
    },
    formatDateForInput(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const day = d.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    editEvent(event) {
      // Convert the date to a Date object and then format it to yyyy-MM-dd
      const eventWithDate = {
        ...event,
        file: null,
        date: this.formatDateForInput(event.date),
      };

      this.eventForm = eventWithDate;
      this.$store.commit("eventform/setEventForm", eventWithDate);
      this.$store.commit("eventform/setEditingEvent", event);
      this.$store.commit("eventform/setFormVisible", true);
    },
  },

  created() {
    this.fetchEvents();
  },
};
</script>

<style scoped>
/* Add custom styles here */
</style>
