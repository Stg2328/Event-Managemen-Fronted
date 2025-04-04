<template>
  <header
    class="navbar bg-white shadow-md fixed w-full z-50 overflow-hidden relative"
  >
    <div
      class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-20"
    ></div>
    <div
      class="absolute top-1/3 left-1/4 w-24 h-24 bg-blue-400 opacity-30 rounded-full blur-2xl animate-pulse"
    ></div>
    <div
      class="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-400 opacity-30 rounded-full blur-3xl animate-bounce"
    ></div>

    <div
      class="container mx-auto px-6 flex justify-between items-center py-4 relative z-10"
    >
      <div class="flex items-center space-x-3">
        <img
          src="@/assets/logo.png"
          class="w-30 h-14 pb-5 transition-transform transform hover:scale-130"
        />
      </div>

      <nav class="hidden md:flex space-x-6 text-lg">
        <a href="#" class="nav-link">Home</a>
        <a href="#" class="nav-link">About</a>
        <a href="#" class="nav-link">Services</a>
        <a href="#" class="nav-link">Events</a>
        <a href="#" class="nav-link">Contact</a>
      </nav>

      <div class="flex items-center space-x-4">
        <button
          v-if="isLoggedIn"
          type="button"
          class="bg-red-500 text-white rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105"
          style="padding: 5px !important; margin-bottom: 10px"
          @click="logout"
        >
          Log Out
        </button>
        <button
          v-else
          type="button"
          class="bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition-transform transform hover:scale-105"
          style="padding: 5px !important; margin-bottom: 10px"
          @click="$router.push({ name: 'login' })"
        >
          Log In
        </button>

        <button
          class="md:hidden focus:outline-none"
          @click="toggleMenu"
          style="
            padding: 5px !important;
            margin-bottom: 10px;
            background-color: transparent;
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-8 h-8 text-gray-600 transition-transform transform hover:rotate-90"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
    v-show="menuOpen"
    class="md:hidden bg-white shadow-md py-4 transition-all transform ease-in-out duration-300 fixed top-16 left-0 w-full z-50"
  >
    <nav class="flex flex-col items-center space-y-6">
      <a
        href="#"
        class="nav-link"
      >
        Home
      </a>
      <a
        href="#"
        class="nav-link"
      >
        About
      </a>
      <a
        href="#"
        class="nav-link"
      >
        Services
      </a>
      <a
        href="#"
        class="nav-link"
      >
        Events
      </a>
      <a
        href="#"
        class="nav-link"
      >
        Contact
      </a>

      <button
        v-if="isLoggedIn"
        type="button"
        class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg hover:from-red-600 hover:to-red-800 focus:ring-4 focus:ring-red-300 transition-all transform hover:scale-105 flex items-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7" />
        </svg>
        <span>Log Out</span>
      </button>
    </nav>
  </div>
  </header>
</template>

<script>
import { toast } from "vue3-toastify";

export default {
  name: "HeaderComponent",
  data() {
    return {
      token: null,
      menuOpen: false,
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.token !== null;
    },
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.token = null;
      this.$router.push({ name: "login" });
      this.$store.dispatch("logout");
      toast.error("Logout successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        theme: "dark",
      });
    },
    toggleMenu() {
      console.log("Menu Open:", this.menuOpen);
      this.menuOpen = !this.menuOpen;
    },
  },
  mounted() {
    let token = localStorage.getItem("token");
    if (token) {
      this.token = token;
    }
  },
};
</script>

<style scoped>
.nav-link {
  @apply text-gray-700 hover:text-blue-600 transition-transform transform hover:scale-110;
}
.nav-link {
  @apply text-gray-700 text-xl font-medium transition-transform transform hover:text-blue-600 hover:scale-105 py-2 px-4 rounded-md duration-300;
}

.nav-link:hover {
  background-color: rgba(100, 116, 139, 0.1); 
}

.md:hidden {
  transition: transform 0.3s ease-in-out;
  transform: translateY(0);
}

.md:hidden {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

button {
  @apply py-2 px-6 rounded-lg border border-transparent hover:border-red-400 transition-all duration-300;
}

button:hover {
  background-color: rgba(255, 99, 71, 0.1); 
}

button:active {
  transform: scale(0.98);
}
</style>
