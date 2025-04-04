import { createStore } from "vuex";
import axios from "axios";
import { API_URL } from "@/Constant/constatant";
import { toast } from "vue3-toastify";
import Swal from "sweetalert2";
function handleTokenError(error) {
  if (error.response?.data?.message === "Token verification failed") {
    toast.error("Session expired. Please login again.", {
      position: "top-right",
      autoClose: 3000,
      theme: "dark",
    });
    localStorage.removeItem("token");
    this.$store.dispatch("logout");
    this.$router.push({ name: "login" });
    return true;
  }
  return false;
}

const store = createStore({
  state() {
    return {
      token: localStorage.getItem("token") || null,
    };
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    removeToken(state) {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  actions: {
    login({ commit }, token) {
      commit("setToken", token);
    },
    logout({ commit }) {
      commit("removeToken");
    },
  },
  modules: {
    loginform: {
      namespaced: true,
      state: {
        email: "",
        password: "",
        emailError: "",
        passwordError: "",
      },
      mutations: {
        setEmail(state, email) {
          state.email = email;
          state.emailError =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
              ? ""
              : "Please enter a valid email address";
        },
        setPassword(state, password) {
          state.password = password;
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

          state.passwordError = passwordRegex.test(password)
            ? ""
            : "Password must be at least 8 characters long, contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.";
        },
        resetForm(state) {
          state.email = "";
          state.password = "";
          state.emailError = "";
          state.passwordError = "";
        },
      },
      actions: {
        updateEmail({ commit }, email) {
          commit("setEmail", email);
        },
        updatePassword({ commit }, password) {
          commit("setPassword", password);
        },
        resetForm({ commit }) {
          commit("resetForm");
        },
      },
      getters: {
        isFormValid: (state) =>
          !state.emailError &&
          !state.passwordError &&
          state.email &&
          state.password,
      },
    },

    signupform: {
      namespaced: true,
      state: {
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        nameError: "",
        emailError: "",
        passwordError: "",
        phoneError: "",
      },
      mutations: {
        setName(state, name) {
          const nameRegex = /^[A-Za-z]+$/;

          state.name = name;
          state.nameError =
            nameRegex.test(name) && name.length >= 3
              ? ""
              : "Name must be at least 3 characters long and contain only alphabets";
        },

        setEmail(state, email) {
          state.email = email;
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          state.emailError = emailRegex.test(email)
            ? ""
            : "Please enter a valid email address";
        },
        setPassword(state, password) {
          state.password = password;
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

          state.passwordError = passwordRegex.test(password)
            ? ""
            : "Password must be at least 8 characters long, contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.";
        },
        setPhoneNumber(state, phoneNumber) {
          state.phoneNumber = phoneNumber;

          const phoneRegex = /^\+?[1-9]\d{1,14}$/;

          state.phoneError = phoneRegex.test(phoneNumber)
            ? ""
            : "Please enter a valid phone number (e.g., +918160681684)";
        },
        resetForm(state) {
          state.name = "";
          state.email = "";
          state.password = "";
          state.phoneNumber = "";
          state.nameError = "";
          state.emailError = "";
          state.passwordError = "";
          state.phoneError = "";
        },
      },
      actions: {
        updateName({ commit }, name) {
          commit("setName", name);
        },
        updateEmail({ commit }, email) {
          commit("setEmail", email);
        },
        updatePassword({ commit }, password) {
          commit("setPassword", password);
        },
        updatePhoneNumber({ commit }, phoneNumber) {
          commit("setPhoneNumber", phoneNumber);
        },
        resetForm({ commit }) {
          commit("resetForm");
        },
      },
      getters: {
        isFormValid: (state) =>
          !state.nameError &&
          !state.emailError &&
          !state.passwordError &&
          !state.phoneError &&
          state.name &&
          state.email &&
          state.password &&
          state.phoneNumber,
      },
    },
    eventform: {
      namespaced: true,
      state: {
        eventForm: {
          title: "",
          description: "",
          date: "",
          eventTime: "",
          file: null,
        },
        editingEvent: null,
        events: [],
        isLoading: false,
        page: 1,
        limit: 3,
        totalPages: 1,
        search: "",
        sortBy: "date",
        sortOrder: "asc",
        formVisible: false,
      },
      mutations: {
        setEvents(state, events) {
          state.events = events;
        },
        setEventForm(state, event) {
          state.eventForm = { ...event };
        },
        setEditingEvent(state, event) {
          state.editingEvent = event;
        },
        resetEventForm(state) {
          state.eventForm = {
            title: "",
            description: "",
            date: "",
            eventTime: "",
            file: null,
          };
          state.editingEvent = null;
        },
        setPage(state, page) {
          state.page = page;
        },
        setTotalPages(state, totalPages) {
          state.totalPages = totalPages;
        },
        setIsLoading(state, isLoading) {
          state.isLoading = isLoading;
        },
        setSearch(state, search) {
          state.search = search;
        },
        setSort(state, { sortBy, sortOrder }) {
          state.sortBy = sortBy;
          state.sortOrder = sortOrder;
        },
        setFile(state, file) {
          state.eventForm.file = file;
        },
        setFormVisible(state, visible) {
          state.formVisible = visible;
        },
      },
      actions: {
        async fetchEvents({ commit, state }) {
          commit("setIsLoading", true);
          try {
            const response = await axios.get(`${API_URL}/api/events`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              params: {
                page: state.page,
                limit: state.limit,
                search: state.search,
                sortBy: state.sortBy,
                sortOrder: state.sortOrder,
              },
            });
            commit("setEvents", response.data.data.data);
            commit(
              "setTotalPages",
              Math.ceil(response.data.data.total / state.limit)
            );
          } catch (error) {
            if (!handleTokenError(error)) {
              toast.error(
                error.response?.data?.message ||
                  "An error occurred, please try again.",
                {
                  position: "top-right",
                  autoClose: 3000,
                  theme: "dark",
                }
              );
            }
          } finally {
            commit("setIsLoading", false);
          }
        },

        async submitEvent({ commit, dispatch, state }) {
          const formData = new FormData();
          formData.append("title", state.eventForm.title);
          formData.append("description", state.eventForm.description);
          formData.append("date", state.eventForm.date);

          // Append file if it exists
          if (state.eventForm.file) {
            formData.append("file", state.eventForm.file);
          }

          const method = state.editingEvent ? "put" : "post";
          const url = state.editingEvent
            ? `${API_URL}/api/events/${state.editingEvent.id}`
            : `${API_URL}/api/events`;

          try {
            await axios({
              method,
              url,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              data: formData,
            });
            toast.success(
              state.editingEvent
                ? "Event Updated successfully!"
                : "Event Created successfully!",
              {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                theme: "dark",
              }
            );
            commit("resetEventForm");
            dispatch("fetchEvents");
          } catch (error) {
            if (!handleTokenError(error)) {
              toast.error(
                error.response?.data?.message ||
                  "An error occurred, please try again.",
                {
                  position: "top-right",
                  autoClose: 3000,
                  theme: "dark",
                }
              );
            }
            console.error("Error submitting event:", error);
          }
        },
        async deleteEvent({ dispatch }, eventId) {
          // Show confirmation popup using SweetAlert2
          const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it",
            reverseButtons: true,
          });

          if (!result.isConfirmed) {
            return;
          }

          try {
            await axios.delete(`${API_URL}/api/events/${eventId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });

            Swal.fire("Deleted!", "The event has been deleted.", "success");

            toast.success("Event Deleted successfully!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              theme: "dark",
            });

            dispatch("fetchEvents");
          } catch (error) {
            if (!handleTokenError(error)) {
              toast.error(
                error.response?.data?.message ||
                  "An error occurred, please try again.",
                {
                  position: "top-right",
                  autoClose: 3000,
                  theme: "dark",
                }
              );
            }
            console.error("Error deleting event:", error);
          }
        },

        setPagination({ commit }, { page, limit }) {
          commit("setPage", page);
          commit("setLimit", limit);
        },

        setSearch({ commit }, search) {
          commit("setSearch", search);
        },

        setSort({ commit }, { sortBy, sortOrder }) {
          commit("setSort", { sortBy, sortOrder });
        },

        setFile({ commit }, file) {
          commit("setFile", file);
        },
      },
      getters: {
        events: (state) => state.events,
        eventForm: (state) => state.eventForm,
        editingEvent: (state) => state.editingEvent,
        isLoading: (state) => state.isLoading,
        pagination: (state) => ({
          page: state.page,
          totalPages: state.totalPages,
        }),
        search: (state) => state.search,
        sortBy: (state) => state.sortBy,
        sortOrder: (state) => state.sortOrder,
      },
    },
  },
});

export default store;
