<template>
  <Header />
  <div class="main-content">
    <router-view />
  </div>
  <Footer />
</template>

<script>
import Footer from "@/components/Footer/Footer.vue";
import Header from "@/components/Header/Header.vue";

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px; /* Adjust height as needed */
  background: #fff;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.main-content {
  flex: 1;
  padding-bottom: 80px; /* Adjust based on footer height */
  overflow-y: auto;
}

.vue3-toastify .Toastify__toast--success {
  background-color: #28a745 !important; /* Custom green */
  color: #fff !important;
  font-weight: bold !important;
}

.vue3-toastify .Toastify__toast--error {
  background-color: #dc3545 !important; /* Custom red */
  color: #fff !important;
  font-weight: bold !important;
}

.vue3-toastify .Toastify__toast--info {
  background-color: #17a2b8 !important;
  color: #fff !important;
}

.vue3-toastify .Toastify__progress-bar {
  background-color: #4caf50 !important; 
}

</style>
