<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 mt-2 px-4 sm:px-6 lg:px-8"
  >
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full sm:w-96">
      <h2 class="text-2xl font-bold text-gray-800 text-center mb-6">
        Confirm Your Email
      </h2>

      <!-- Display the email to the user -->
      <p class="text-center text-gray-600 mb-4">
        A confirmation code has been sent to <strong>{{ email }}</strong
        >. Please enter it below.
      </p>

      <form @submit.prevent="handleConfirmation">
        <div class="mb-4">
          <label class="block text-gray-700">Confirmation Code</label>
          <input
            type="text"
            v-model="confirmationCode"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your confirmation code"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Confirm Account
        </button>
      </form>

      <p class="text-center text-gray-600 mt-4">
        Didn't receive the code?
        <button
          @click="resendConfirmationCode"
          class="text-blue-500 hover:underline"
        >
          Resend Code
        </button>
      </p>
    </div>
  </div>
</template>

<script>
import { API_URL } from "@/Constant/constatant";
import axios from "axios";
import { toast } from "vue3-toastify";

export default {
  props: {
    email: {
      type: String,
      required: true, 
    },
  },
  data() {
    return {
      confirmationCode: "",
    };
  },
  methods: {
    async handleConfirmation() {
      if (!this.confirmationCode) {
        toast.error("Confirmation code is required", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      try {
        const result = await axios.post(
          `${API_URL}/api/auth/confirm`,
          {
            email: this.email,
            ConfirmationCode: this.confirmationCode,
          }
        );

        if (result.data.status === "success") {
          toast.success("Account confirmed successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
          this.$router.push("/login");
        } else {
          toast.error("Confirmation failed", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "An error occurred, please try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
    },

    async resendConfirmationCode() {
      try {
        const result = await axios.post(
          `${API_URL}/api/auth/resend`,
          {
            email: this.email,
          }
        );

        if (result.data.status === "success") {
          toast.success("Confirmation code resent successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error("Failed to resend confirmation code", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "An error occurred, please try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
    },
  },
};
</script>
