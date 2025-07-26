import { BookService } from "./bookService.js";
import { UI } from "./ui.js";
import { Router } from "./router.js";
import { Wishlist } from "./wishlist.js";

export function initApp() {
  // Initialize services
  const bookService = new BookService();
  const wishlist = new Wishlist();
  const ui = new UI(bookService, wishlist);
  const router = new Router(ui);

  // Initialize UI
  ui.init();

  // Show loading indicator before fetching data
  ui.showLoading();

  // Load initial data
  bookService
    .fetchBooks()
    .then(() => {
      ui.updateBookList(bookService.filteredBooks);
      ui.updateGenreFilter(bookService.genres);
    })
    .catch((error) => {
      console.error("Error initializing app:", error);
      ui.showError("Failed to load books. Please try again later.");
    })
    .finally(() => {
      // Hide loading indicator when done
      ui.hideLoading();
    });

  // Set up event listeners
  setupEventListeners(ui, bookService, wishlist, router);
}

function setupEventListeners(ui, bookService, wishlist, router) {
  // Search input
  document.getElementById("search-input").addEventListener("input", (e) => {
    bookService.setSearchTerm(e.target.value);
    ui.updateBookList(bookService.filteredBooks);
  });

  // Genre filter
  document.getElementById("genre-filter").addEventListener("change", (e) => {
    bookService.setGenreFilter(e.target.value);
    ui.updateBookList(bookService.filteredBooks);
  });

  // Pagination
  document.getElementById("prev-page").addEventListener("click", () => {
    bookService.previousPage();
    ui.updateBookList(bookService.filteredBooks);
    ui.updatePagination(bookService.pagination);
  });

  document.getElementById("next-page").addEventListener("click", () => {
    bookService.nextPage();
    ui.updateBookList(bookService.filteredBooks);
    ui.updatePagination(bookService.pagination);
  });

  // Back button
  document.getElementById("back-button").addEventListener("click", () => {
    router.navigate("home");
  });

  // Mobile menu toggle
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".nav-links").classList.toggle("active");
    document.querySelector(".hamburger").classList.toggle("active");
  });

  // Close mobile menu when clicking on a nav link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelector(".nav-links").classList.remove("active");
      document.querySelector(".hamburger").classList.remove("active");
    });
  });
}
