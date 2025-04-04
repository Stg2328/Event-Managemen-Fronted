<template>
  <footer class="footer bg-gray-900 text-white py-12 relative overflow-hidden">
    <div class="container mx-auto px-6">
      <div class="grid md:grid-cols-4 gap-8 text-center md:text-left">
        <div>
          <h5 class="text-xl font-bold">About Us</h5>
          <p class="text-gray-400 mt-2 text-sm">
            We specialize in managing high-quality events and creating seamless experiences.
          </p>
        </div>
        <div>
          <h5 class="text-xl font-bold">Quick Links</h5>
          <ul class="mt-2 space-y-2 text-gray-400">
            <li><a href="#" class="hover:text-blue-400 transition duration-300">Privacy Policy</a></li>
            <li><a href="#" class="hover:text-blue-400 transition duration-300">Terms of Service</a></li>
            <li><a href="#" class="hover:text-blue-400 transition duration-300">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h5 class="text-xl font-bold">Event Management</h5>
          <ul class="mt-2 space-y-2 text-gray-400">
            <li><a href="#" class="hover:text-blue-400 transition duration-300">Upcoming Events</a></li>
            <li><a href="#" class="hover:text-blue-400 transition duration-300">Past Events</a></li>
            <li><a href="#" class="hover:text-blue-400 transition duration-300">Get Involved</a></li>
          </ul>
        </div>
        <div>
          <h5 class="text-xl font-bold">Follow Us</h5>
          <div class="mt-2 flex justify-center md:justify-start space-x-4">
            <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <hr class="border-gray-700 my-6" />
      <p class="text-center text-gray-400">© 2025 STG. All Rights Reserved.</p>
    </div>
    
    <!-- Background Effects -->
    <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900 to-black opacity-10"></div>
    <div class="absolute top-1/3 left-1/4 w-24 h-24 bg-blue-500 opacity-20 rounded-full blur-2xl animate-pulse"></div>
    <div class="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-500 opacity-20 rounded-full blur-3xl animate-bounce"></div>
  </footer>
</template>

<script>
export default {
  name: "FooterComponent",
};
</script>

<style scoped>
.footer a {
  transition: color 0.3s ease-in-out;
}

.social-icon {
  @apply text-gray-400 hover:text-blue-400 transition duration-300 text-lg;
}
</style>