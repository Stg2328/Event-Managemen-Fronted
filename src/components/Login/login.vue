<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 mt-2 px-4 sm:px-6 lg:px-8">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full sm:w-96">
      <h2 class="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input
            type="email"
            :value="email"
            @input="updateEmail($event.target.value)"
            :class="{ 'border-red-500': emailError }"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
          <p v-if="emailError" class="text-red-500 text-sm">{{ emailError }}</p>
        </div>
        <div class="mb-4 relative">
          <label class="block text-gray-700">Password</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            :value="password"
            @input="updatePassword($event.target.value)"
            :class="{ 'border-red-500': passwordError }"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            class="absolute right-3 top-9 text-gray-500"
            @click="togglePassword"
            id="toggle"
          >
            <span v-if="showPassword">🙈</span>
            <span v-else>👁️</span>
          </button>
          <p v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</p>
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          :disabled="!isFormValid"
        >
          Login
        </button>
      </form>
      <p class="text-center text-gray-600 mt-4">
        Don't have an account?
        <router-link
          to="/"
          class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Go To Sign Up
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import axios from "axios";
import { toast } from "vue3-toastify";
import { API_URL } from "@/Constant/constatant";

export default {
  name: "LoginComponent",
  data() {
    return {
      showPassword: false,
    };
  },
  computed: {
    ...mapState("loginform", ["email", "password", "emailError", "passwordError"]),
    ...mapGetters("loginform", ["isFormValid"]),
        token: state => state.token,
    
  },
  methods: {
    ...mapActions("loginform", ["updateEmail", "updatePassword", "resetForm"]),

    async handleLogin() {
      if (!this.isFormValid) return;

      try {
        const result = await axios.post(`${API_URL}/api/auth/login`, {
          email: this.email,
          password: this.password,
        });

        if (result.data.status === "success") {
          const token = result.data.data.accessToken;
          this.$store.dispatch("login", token);
          this.$router.push({ name: "landing" });
          toast.success("Login successful!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            theme: "dark",
          });

          this.resetForm(); 
        } else {
          toast.error("Invalid credentials", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            theme: "dark",
          });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred, please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          theme: "dark",
        });
      }
    },

    togglePassword() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style>
body {
  font-family: "Inter", sans-serif;
}
#toggle {
  background-color: transparent;
}
</style>
