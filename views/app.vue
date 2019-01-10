<template>
  <header>
    <nav class="lambdacolors_appbar">
      <div class="nav-wrapper">
        <a href="." class="brand-logo">AUR Browser</a>
        <a href="#" data-target="mobile-head-navbar" class="sidenav-trigger"><i class="material-icons">menu</i></a>
        <ul class="right hide-on-med-and-down">
          <li><a href="."><i class="material-icons left">home</i>Home</a></li>
          <li><a href="."><i class="material-icons left">info</i>About</a></li>
          <li><a href="."><i class="material-icons left">app</i>Packages</a></li>
        </ul>
      </div>
    </nav>

    <ul class="sidenav lambdacolors_appbar white-text" id="mobile-head-navbar">
      <li class="search">
        <form class="search-wrapper" method="get">
          <input id="sidenav_search" name="search" placeholder="Search">
          <i class="material-icons">search</i>
        </form>
      </li>
      <li><a href="." class="white-text"><i class="white-text material-icons left">home</i>Home</a></li>
      <li><a href="." class="white-text"><i class="white-text material-icons left">info</i>About</a></li>
      <li><a href="." class="white-text"><i class="white-text material-icons left">app</i>Packages</a></li>
    </ul>
  </header>

  <main id="main">

  </main>

  <footer class="page-footer lambdacolors_appbar">
    <div class="container">
      <div class="row">
        <div class="col s12">
          <h5 class="white-text"> Made with <i class="fas fa-heart red-text text-darken-1"></i> on <a href="https://github.com/LambdAurora/aurbrowser.git">GitHub</a></h5>
        </div>
      </div>
    </div>
    <div class="footer-copyright">
      <div class="container">
        v{{ version }}
      </div>
    </div>
  </footer>
</template>

<script>
	export default {
		name: "app"
	}
</script>

<style scoped>

</style>