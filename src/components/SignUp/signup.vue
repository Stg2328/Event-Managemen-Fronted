<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 mt-2 px-4 sm:px-6 lg:px-8"
    style="margin-top: 60px"
  >
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full sm:w-96">
      <h2 class="text-2xl font-bold text-gray-800 text-center mb-6">
        Register
      </h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-gray-700">Name</label>
          <input
            type="text"
            :value="name"
            @input="updateName($event.target.value)"
            :class="{ 'border-red-500': nameError }"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
            required
          />
          <p v-if="nameError" class="text-red-500 text-sm">{{ nameError }}</p>
        </div>
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
          <p v-if="passwordError" class="text-red-500 text-sm">
            {{ passwordError }}
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Phone Number</label>
          <input
            type="tel"
            :value="phoneNumber"
            @input="updatePhoneNumber($event.target.value)"
            :class="{ 'border-red-500': phoneError }"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number"
            required
          />
          <p v-if="phoneError" class="text-red-500 text-sm">{{ phoneError }}</p>
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          :disabled="!isFormValid"
        >
          Sign Up
        </button>
      </form>
      <p class="text-center text-gray-600 mt-4">
        Already have an account?
        <router-link
          to="/login"
          class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Go To Login
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
  name: "SignupComponent",
  data() {
    return {
      showPassword: false,
    };
  },
  computed: {
    ...mapState("signupform", [
      "name",
      "email",
      "password",
      "phoneNumber",
      "nameError",
      "emailError",
      "passwordError",
      "phoneError",
    ]),
    ...mapGetters("signupform", ["isFormValid"]),
    token: (state) => state.token,
  },
  methods: {
    ...mapActions("signupform", [
      "updateName",
      "updateEmail",
      "updatePassword",
      "updatePhoneNumber",
      "resetForm",
    ]),

    async handleRegister() {
      if (!this.isFormValid) return;

      try {
        const result = await axios.post(`${API_URL}/api/auth/register`, {
          name: this.name,
          email: this.email,
          password: this.password,
          phoneNumber: this.phoneNumber,
        });

        if (result.data.status === "success") {
          this.$router.push({
            name: "confirmAccount",
            params: { email: this.email.trim() },
          });
          toast.success(
            "Registration successful! Please check your email to confirm your account.",
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              theme: "dark",
            }
          );

          this.resetForm();
        } else {
          toast.error("Registration failed", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            theme: "dark",
          });
        }
      } catch (error) {
        console.log(error);
        
        if (
          error?.response?.data?.status === "error" &&
          error?.response?.data?.message === "User already exists"
        ) {
          console.log("hii");

          await axios.post(`${API_URL}/api/auth/resend`, {
            email: this.email,
          });

          // Route to the confirm page directly if the user already exists
          this.$router.push({
            name: "confirmAccount",
            params: { email: this.email.trim() },
          });
          toast.info(
            "This email is already registered. Please check your inbox to confirm your account.",
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              theme: "dark",
            }
          );
        }else{
          toast.error(
          error.response?.data?.message ||
            "An error occurred, please try again.",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            theme: "dark",
          }
        );
        }

      }
    },

    togglePassword() {
      this.showPassword = !this.showPassword;
    },
  },
  mounted() {
    if (this.token) {
      this.$router.push({ name: "landing" });
    }
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
