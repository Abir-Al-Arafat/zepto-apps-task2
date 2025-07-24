export class Router {
    constructor(ui) {
        this.ui = ui;
        this.routes = {
            'home': this.showHomePage.bind(this),
            'wishlist': this.showWishlistPage.bind(this),
            'book-details': this.showBookDetailsPage.bind(this)
        };
        this.currentRoute = 'home';
        this.init();
    }

    init() {
        // Set up router outlet
        const routerOutlet = document.createElement('div');
        routerOutlet.className = 'router-outlet';
        routerOutlet.setAttribute('data-route', 'home');
        document.querySelector('.container').prepend(routerOutlet);
        
        // Handle back/forward browser navigation
        window.addEventListener('popstate', () => {
            this.navigate(window.location.hash.slice(1) || 'home', false);
        });

        // Set up navigation links
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigate(page);
            });
        });

        // Initial navigation
        const initialRoute = window.location.hash ? window.location.hash.slice(1) : 'home';
        this.navigate(initialRoute, false);
    }

    navigate(route, updateHistory = true) {
        if (this.routes[route]) {
            this.currentRoute = route;
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                if (link.getAttribute('data-page') === route) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });

            // Show the current page
            document.getElementById(`${route}-page`).classList.add('active');
            document.querySelector('.router-outlet').setAttribute('data-route', route);
            
            // Update URL
            if (updateHistory) {
                window.history.pushState({}, '', `#${route}`);
            }

            // Call the route handler
            this.routes[route]();
        }
    }

    showHomePage() {
        // Home page is already set up with the book list
        document.title = 'BookFinder - Home';
    }

    showWishlistPage() {
        document.title = 'BookFinder - My Wishlist';
        this.ui.updateWishlist(this.ui.wishlist.getWishlist());
    }

    showBookDetailsPage() {
        // Book details are handled by the UI class when a book is clicked
        document.title = 'BookFinder - Book Details';
    }
}
