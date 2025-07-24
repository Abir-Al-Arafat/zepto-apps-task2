export class UI {
    constructor(bookService, wishlist) {
        this.bookService = bookService;
        this.wishlist = wishlist;
        this.booksContainer = document.getElementById('books-container');
        this.wishlistContainer = document.getElementById('wishlist-container');
        this.bookDetails = document.getElementById('book-details');
        this.genreFilter = document.getElementById('genre-filter');
    }

    init() {
        this.updateWishlistCount();
    }

    updateBookList(books) {
        if (!books || books.length === 0) {
            this.booksContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open"></i>
                    <p>No books found. Try adjusting your search or filters.</p>
                </div>`;
            return;
        }

        this.booksContainer.innerHTML = books.map(book => this._createBookCard(book)).join('');
        this._attachBookCardEventListeners();
    }

    updateWishlist(books) {
        if (!books || books.length === 0) {
            this.wishlistContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart"></i>
                    <p>Your wishlist is empty. Add some books!</p>
                </div>`;
            return;
        }

        this.wishlistContainer.innerHTML = books.map(book => this._createBookCard(book, true)).join('');
        this._attachBookCardEventListeners();
    }

    updateBookDetails(book) {
        this.bookDetails.innerHTML = `
            <div class="book-detail-header">
                <img 
                    src="${book.coverUrl || 'https://via.placeholder.com/300x450?text=No+Cover'}" 
                    alt="${book.title}" 
                    class="book-detail-cover"
                    onerror="this.src='https://via.placeholder.com/300x450?text=No+Image+Available'"
                >
                <div class="book-detail-info">
                    <h1 class="book-detail-title">${book.title}</h1>
                    <p class="book-detail-author">By ${book.author}</p>
                    <div class="book-detail-meta">
                        <span class="book-detail-id">ID: ${book.id}</span>
                        <div class="book-genres">
                            ${book.genres.slice(0, 5).map(genre => 
                                `<span class="genre-tag">${genre}</span>`
                            ).join('')}
                        </div>
                    </div>
                    <div class="book-actions">
                        <button class="wishlist-btn ${this.wishlist.isInWishlist(book.id) ? 'active' : ''}" 
                                data-id="${book.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="book-detail-description">
                <p>${book.downloadCount.toLocaleString()} downloads</p>
                <p>Languages: ${book.languages.join(', ') || 'Not specified'}</p>
                <p>${book.copyright ? '© ' + book.copyright : ''}</p>
            </div>`;
    }

    updateGenreFilter(genres) {
        const genreOptions = Array.from(genres)
            .sort()
            .map(genre => 
                `<option value="${genre}">${this._capitalizeFirstLetter(genre)}</option>`
            ).join('');
        
        this.genreFilter.innerHTML = `
            <option value="">All Genres</option>
            ${genreOptions}
        `;
    }

    updatePagination(pagination) {
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const pageNumbers = document.getElementById('page-numbers');
        
        prevBtn.disabled = !pagination.hasPrev;
        nextBtn.disabled = !pagination.hasNext;
        
        // Simple pagination: just show current page
        pageNumbers.textContent = `Page ${pagination.currentPage} of ${pagination.totalPages}`;
    }

    updateWishlistCount() {
        const count = this.wishlist.getWishlist().length;
        document.getElementById('wishlist-count').textContent = count;
    }

    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 3000);
        }, 100);
    }

    _createBookCard(book, isWishlist = false) {
        return `
            <div class="book-card" data-id="${book.id}">
                <img 
                    src="${book.coverUrl || 'https://via.placeholder.com/200x300?text=No+Cover'}" 
                    alt="${book.title}" 
                    class="book-cover"
                    onerror="this.src='https://via.placeholder.com/200x300?text=No+Image+Available'"
                >
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    ${book.genres.length > 0 ? `
                        <div class="book-genres">
                            ${book.genres.slice(0, 2).map(genre => 
                                `<span class="genre-tag">${genre}</span>`
                            ).join('')}
                        </div>
                    ` : ''}
                    <div class="book-actions">
                        <span class="book-id">#${book.id}</span>
                        <button class="wishlist-btn ${this.wishlist.isInWishlist(book.id) ? 'active' : ''}" 
                                data-id="${book.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>`;
    }

    _attachBookCardEventListeners() {
        // Book card click
        document.querySelectorAll('.book-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.wishlist-btn')) {
                    const bookId = card.dataset.id;
                    this.bookService.getBookById(bookId)
                        .then(book => {
                            this.updateBookDetails(book);
                            document.querySelector('.router-outlet').setAttribute('data-route', 'book-details');
                        })
                        .catch(error => {
                            this.showError('Failed to load book details');
                        });
                }
            });
        });

        // Wishlist button click
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const bookId = parseInt(btn.dataset.id);
                
                if (this.wishlist.isInWishlist(bookId)) {
                    this.wishlist.removeFromWishlist(bookId);
                    btn.classList.remove('active');
                    this.showError('Removed from wishlist');
                } else {
                    this.bookService.getBookById(bookId)
                        .then(book => {
                            this.wishlist.addToWishlist(book);
                            btn.classList.add('active');
                            this.showError('Added to wishlist');
                        });
                }
                
                this.updateWishlistCount();
                
                // If we're on the wishlist page, update the view
                if (document.querySelector('.router-outlet').getAttribute('data-route') === 'wishlist') {
                    this.updateWishlist(this.wishlist.getWishlist());
                }
            });
        });
    }

    _capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
