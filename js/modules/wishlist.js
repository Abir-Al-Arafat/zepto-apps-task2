export class Wishlist {
    constructor() {
        this.wishlistKey = 'bookWishlist';
        this.wishlist = this._loadWishlist();
    }

    getWishlist() {
        return [...this.wishlist];
    }

    addToWishlist(book) {
        if (!this.isInWishlist(book.id)) {
            this.wishlist.push(book);
            this._saveWishlist();
        }
    }

    removeFromWishlist(bookId) {
        this.wishlist = this.wishlist.filter(book => book.id !== bookId);
        this._saveWishlist();
    }

    isInWishlist(bookId) {
        return this.wishlist.some(book => book.id === bookId);
    }

    _loadWishlist() {
        try {
            const savedWishlist = localStorage.getItem(this.wishlistKey);
            return savedWishlist ? JSON.parse(savedWishlist) : [];
        } catch (error) {
            console.error('Error loading wishlist from localStorage:', error);
            return [];
        }
    }

    _saveWishlist() {
        try {
            localStorage.setItem(this.wishlistKey, JSON.stringify(this.wishlist));
        } catch (error) {
            console.error('Error saving wishlist to localStorage:', error);
        }
    }
}
